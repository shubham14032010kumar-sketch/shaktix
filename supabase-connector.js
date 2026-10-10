/**
 * SHAKTIX Supabase Cloud Connector
 * Synchronizes client inquiries, AI Agent leads, and bookings directly with Supabase Postgres DB.
 */

window.SHAKTIX_SUPABASE = {
  key: 'sb_publishable_BOVcJBPy2_NAoJxA_ffDLA_yctC2frr',
  
  getUrl: function() {
    return localStorage.getItem('shaktix_supabase_url') || '';
  },

  setUrl: function(url) {
    if (url) {
      url = url.trim().replace(/\/+$/, '');
      localStorage.setItem('shaktix_supabase_url', url);
    }
  },

  saveLead: async function(lead) {
    // 1. Always save in localStorage backup
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

    // 2. Sync to Supabase Cloud if URL is provided
    const url = this.getUrl();
    if (!url) {
      console.log('⚡ Lead saved locally. Connect Supabase Project URL to sync to cloud.');
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
        return { status: 'synced', message: 'Synced to Supabase' };
      } else {
        const err = await response.text();
        console.warn('Supabase sync response:', err);
        return { status: 'error', error: err };
      }
    } catch (err) {
      console.error('Supabase network error:', err);
      return { status: 'network_error', error: err.message };
    }
  }
};
