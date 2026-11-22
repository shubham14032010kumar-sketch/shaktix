/**
 * SHAKTIX Supabase Cloud Connector with Resilient Offline-First Queue
 * Synchronizes client inquiries, AI Agent leads, and bookings directly with Supabase Postgres DB.
 */

window.SHAKTIX_SUPABASE = {
  key: 'sb_publishable_BOVcJBPy2_NAoJxA_ffDLA_yctC2frr',
  url: 'https://wdgtapmrhzjseihivuoj.supabase.co',
  
  getUrl: function() {
    return localStorage.getItem('shaktix_supabase_url') || this.url;
  },

  setUrl: function(url) {
    if (url) {
      url = url.trim().replace(/\/+$/, '');
      localStorage.setItem('shaktix_supabase_url', url);
    }
  },

  getQueue: function() {
    try {
      return JSON.parse(localStorage.getItem('shaktix_lead_queue') || '[]');
    } catch (e) {
      return [];
    }
  },

  setQueue: function(queue) {
    try {
      localStorage.setItem('shaktix_lead_queue', JSON.stringify(queue));
    } catch (e) {
      console.warn('Could not store lead queue:', e);
    }
  },

  enqueueLead: function(lead) {
    const queue = this.getQueue();
    queue.push({
      lead: lead,
      attempts: 0,
      timestamp: new Date().toISOString()
    });
    this.setQueue(queue);
  },

  flushQueue: async function() {
    const queue = this.getQueue();
    if (!queue.length) return;

    const url = this.getUrl();
    if (!url) return;

    const remainingQueue = [];
    for (const item of queue) {
      try {
        const endpoint = `${url}/rest/v1/leads`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: item.lead.name,
            phone: item.lead.phone,
            category: item.lead.category || item.lead.industry,
            notes: item.lead.notes || '',
            source: item.lead.source || 'Website'
          })
        });

        if (!response.ok) {
          item.attempts += 1;
          if (item.attempts < 5) remainingQueue.push(item);
        }
      } catch (err) {
        item.attempts += 1;
        if (item.attempts < 5) remainingQueue.push(item);
      }
    }
    this.setQueue(remainingQueue);
  },

  saveLead: async function(lead) {
    // 1. Always save in primary localStorage leads repository
    try {
      let localLeads = JSON.parse(localStorage.getItem('shaktix_leads') || '[]');
      localLeads.unshift({
        name: lead.name || 'Anonymous',
        phone: lead.phone || '',
        category: lead.category || lead.industry || 'General',
        notes: lead.notes || '',
        source: lead.source || 'Website',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('shaktix_leads', JSON.stringify(localLeads));
    } catch (e) {
      console.warn('LocalStorage backup error:', e);
    }

    // 2. Queue for resilient cloud sync
    this.enqueueLead(lead);

    // 3. Attempt immediate sync
    const url = this.getUrl();
    if (!url) {
      console.log('⚡ Lead secured locally. Cloud sync ready upon DB reconnection.');
      return { status: 'local_only', message: 'Saved to local storage' };
    }

    try {
      const endpoint = `${url}/rest/v1/leads`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          category: lead.category || lead.industry,
          notes: lead.notes || '',
          source: lead.source || 'Website'
        })
      });

      if (response.ok) {
        console.log('✅ Lead synced successfully to Supabase Cloud!');
        this.flushQueue(); // Try flushing any previous queued items
        return { status: 'synced', message: 'Synced to Supabase' };
      } else {
        const err = await response.text();
        console.warn('Supabase sync response (queued for retry):', err);
        return { status: 'queued', error: err };
      }
    } catch (err) {
      console.warn('Supabase network offline (queued for retry):', err.message);
      return { status: 'queued', error: err.message };
    }
  }
};

// Auto retry queue whenever browser regains internet connectivity
window.addEventListener('online', () => {
  if (window.SHAKTIX_SUPABASE) {
    window.SHAKTIX_SUPABASE.flushQueue();
  }
});
