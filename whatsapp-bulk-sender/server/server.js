/**
 * SHAKTIX WhatsApp Bulk Sender & Custom CRM Backend Server
 * Express Server with Rate-limited Message Dispatcher & Webhooks
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const WhatsAppCloudApiService = require('./services/whatsappCloudApi');
const { router: webhookRouter, webhookEventsLog, suppressionList } = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve frontend UI statically
app.use(express.static(path.join(__dirname, '..')));

// Instantiate WhatsApp Service
const waService = new WhatsAppCloudApiService();

// In-Memory Database (Acts as local mock/cache, seamlessly swappable with Postgres)
let contactsDb = [
  { id: '1', name: 'Dr. Rajiv Sharma', phone: '919876543210', business: 'Apex Dental Care', city: 'Delhi', stage: 'contacted', tags: ['clinic', 'vip'], optIn: true },
  { id: '2', name: 'Vikram Malhotra', phone: '919811223344', business: 'IronFit Gym', city: 'Mumbai', stage: 'new_lead', tags: ['gym'], optIn: true },
  { id: '3', name: 'Ananya Roy', phone: '919712345678', business: 'Roy Hospitality', city: 'Kolkata', stage: 'proposal_sent', tags: ['restaurant'], optIn: true },
  { id: '4', name: 'Sanjay Gupta', phone: '919988776655', business: 'Gupta Tutorials', city: 'Patna', stage: 'closed_won', tags: ['institute'], optIn: true }
];

let campaignsDb = [
  {
    id: 'camp-101',
    name: 'Diwali Festival 30% Off Offer',
    template: 'festival_promo_2026',
    targetTag: 'all',
    total: 4,
    sent: 4,
    delivered: 4,
    read: 3,
    failed: 0,
    status: 'completed',
    createdAt: new Date().toISOString()
  }
];

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Webhook endpoint
app.use('/api/webhook', webhookRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SHAKTIX WhatsApp Bulk Platform & CRM',
    timestamp: new Date().toISOString(),
    suppressedNumbersCount: suppressionList.size
  });
});
// Test message endpoint (development only)
app.post('/api/test/message', async (req, res) => {
  const { phone, text } = req.body;
  if (!phone || !text) return res.status(400).json({ success: false, error: 'phone and text required' });
  const result = await waService.sendTextMessage({ to: phone, body: text });
  res.json({ success: result.success, details: result });
});

// WhatsApp API Config / Health
app.get('/api/whatsapp/status', async (req, res) => {
  if (!process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN.includes('your_')) {
    return res.json({
      configured: false,
      message: 'Meta API Token not configured in .env yet. System is running in Interactive Simulation Mode.'
    });
  }
  const result = await waService.getPhoneNumberHealth();
  res.json({ configured: true, result });
});

// 1. CONTACTS & CRM API
app.get('/api/contacts', (req, res) => {
  const { tag, stage, search } = req.query;
  let filtered = [...contactsDb];

  if (tag && tag !== 'all') {
    filtered = filtered.filter(c => c.tags.includes(tag));
  }
  if (stage && stage !== 'all') {
    filtered = filtered.filter(c => c.stage === stage);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.business && c.business.toLowerCase().includes(q))
    );
  }
  res.json({ success: true, count: filtered.length, contacts: filtered });
});

app.post('/api/contacts', (req, res) => {
  const { name, phone, business, city, stage, tags } = req.body;
  if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

  const formattedPhone = waService.formatPhoneNumber(phone);
  const newContact = {
    id: 'c_' + Date.now(),
    name: name || 'Valued Client',
    phone: formattedPhone,
    business: business || '',
    city: city || '',
    stage: stage || 'new_lead',
    tags: Array.isArray(tags) ? tags : [tags || 'general'],
    optIn: true,
    createdAt: new Date().toISOString()
  };

  contactsDb.push(newContact);
  res.json({ success: true, contact: newContact });
});

// Bulk Import Contacts from CSV/JSON
app.post('/api/contacts/bulk-import', (req, res) => {
  const { contacts } = req.body;
  if (!Array.isArray(contacts)) {
    return res.status(400).json({ success: false, error: 'Expected array of contacts' });
  }

  let added = 0;
  let skipped = 0;

  contacts.forEach(c => {
    if (!c.phone) { skipped++; return; }
    const formatted = waService.formatPhoneNumber(c.phone);

    // Skip if already in suppression list
    if (suppressionList.has(formatted)) {
      skipped++;
      return;
    }

    const existingIndex = contactsDb.findIndex(item => item.phone === formatted);
    const newRecord = {
      id: existingIndex >= 0 ? contactsDb[existingIndex].id : 'c_' + Math.random().toString(36).substr(2, 9),
      name: c.name || 'Client',
      phone: formatted,
      business: c.business || '',
      city: c.city || '',
      stage: c.stage || 'new_lead',
      tags: Array.isArray(c.tags) ? c.tags : (c.tags ? [c.tags] : ['imported']),
      optIn: true,
      importedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      contactsDb[existingIndex] = { ...contactsDb[existingIndex], ...newRecord };
    } else {
      contactsDb.push(newRecord);
      added++;
    }
  });

  res.json({ success: true, added, skipped, totalContacts: contactsDb.length });
});

// Update Lead Stage in Custom CRM
app.patch('/api/contacts/:id/stage', (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  const contact = contactsDb.find(c => c.id === id);
  if (!contact) return res.status(400).json({ success: false, error: 'Contact not found' });

  contact.stage = stage;
  res.json({ success: true, contact });
});

// 2. CAMPAIGN DISPATCH ENGINE (With Rate Throttling)
app.post('/api/campaigns/dispatch', async (req, res) => {
  const { campaignName, templateName, targetTag, customVariables = {} } = req.body;

  // Filter eligible recipients
  let eligibleRecipients = contactsDb.filter(c => {
    // 1. Must have opt-in
    if (!c.optIn) return false;
    // 2. Must not be in suppression list
    if (suppressionList.has(c.phone)) return false;
    // 3. Tag match
    if (targetTag && targetTag !== 'all' && !c.tags.includes(targetTag)) return false;
    return true;
  });

  if (eligibleRecipients.length === 0) {
    return res.status(400).json({ success: false, error: 'No eligible opted-in recipients found for this audience filter' });
  }

  const campaignId = 'camp-' + Date.now();
  const campaignRecord = {
    id: campaignId,
    name: campaignName || `Campaign ${new Date().toLocaleDateString()}`,
    template: templateName,
    targetTag: targetTag || 'all',
    total: eligibleRecipients.length,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    status: 'processing',
    createdAt: new Date().toISOString()
  };

  campaignsDb.unshift(campaignRecord);

  // Return immediate response with Campaign ID (Async queue worker begins)
  res.json({
    success: true,
    message: `Campaign initiated for ${eligibleRecipients.length} recipients`,
    campaignId,
    totalAudience: eligibleRecipients.length
  });

  // Asynchronous Execution with Throttling (Simulated or Real Meta API)
  const isMetaConfigured = process.env.WHATSAPP_ACCESS_TOKEN && !process.env.WHATSAPP_ACCESS_TOKEN.includes('your_');
  const delayBetweenMs = 1000 / (parseInt(process.env.MAX_MESSAGES_PER_SECOND) || 10);

  (async () => {
    for (const recipient of eligibleRecipients) {
      await new Promise(r => setTimeout(r, delayBetweenMs));

      if (isMetaConfigured) {
        // Send via Meta API
        const metaRes = await waService.sendTemplateMessage({
          to: recipient.phone,
          templateName: templateName || 'hello_world',
          languageCode: 'en_US',
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: recipient.name || 'Valued Partner' }
              ]
            }
          ]
        });

        if (metaRes.success) {
          campaignRecord.sent++;
          campaignRecord.delivered++;
        } else {
          campaignRecord.failed++;
        }
      } else {
        // High fidelity simulated execution
        campaignRecord.sent++;
        if (Math.random() > 0.05) {
          campaignRecord.delivered++;
          if (Math.random() > 0.3) campaignRecord.read++;
        } else {
          campaignRecord.failed++;
        }
      }
    }
    campaignRecord.status = 'completed';
    console.log(`🚀 Campaign ${campaignId} completed! Sent: ${campaignRecord.sent}, Delivered: ${campaignRecord.delivered}`);
  })();
});

// Get Campaigns List & Performance
app.get('/api/campaigns', (req, res) => {
  res.json({ success: true, campaigns: campaignsDb });
});

// Global Analytics Overview
app.get('/api/analytics', (req, res) => {
  const totalSent = campaignsDb.reduce((acc, c) => acc + (c.sent || 0), 0);
  const totalDelivered = campaignsDb.reduce((acc, c) => acc + (c.delivered || 0), 0);
  const totalRead = campaignsDb.reduce((acc, c) => acc + (c.read || 0), 0);
  const totalFailed = campaignsDb.reduce((acc, c) => acc + (c.failed || 0), 0);

  res.json({
    totalContacts: contactsDb.length,
    activeCampaigns: campaignsDb.filter(c => c.status === 'processing').length,
    totalSent,
    totalDelivered,
    totalRead,
    totalFailed,
    deliveryRate: totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) + '%' : '100%',
    readRate: totalDelivered > 0 ? ((totalRead / totalDelivered) * 100).toFixed(1) + '%' : '0%',
    suppressedCount: suppressionList.size
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ SHAKTIX WhatsApp Bulk Platform & CRM is LIVE!`);
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/api/webhook`);
  console.log(`====================================================`);
});
