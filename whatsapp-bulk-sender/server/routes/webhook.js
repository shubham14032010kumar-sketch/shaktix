/**
 * SHAKTIX WhatsApp Webhook Router
 * Handles Meta Webhook Verification and Real-Time Status / Inbound Messages
 */

const express = require('express');
const router = express.Router();
const { generateWhatsAppAIReply } = require('../services/geminiAiService');
const WhatsAppCloudApiService = require('../services/whatsappCloudApi');
const waService = new WhatsAppCloudApiService();

// Memory store for recent events (can be swapped with DB / Redis)
const webhookEventsLog = [];
const suppressionList = new Set(); // Stores phone numbers of opted-out users

/**
 * 1. Meta Webhook Verification Handshake (GET /api/webhook)
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WEBHOOK_VERIFY_TOKEN || 'shaktix_secure_verify_token_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('✅ Meta Webhook successfully verified!');
      return res.status(200).send(challenge);
    } else {
      console.warn('❌ Webhook token mismatch. Verification rejected.');
      return res.sendStatus(403);
    }
  }
  res.sendStatus(400);
});

/**
 * 2. Inbound Events Receiver (POST /api/webhook)
 */
router.post('/', (req, res) => {
  const body = req.body;

  // Verify it's a WhatsApp webhook
  if (body.object === 'whatsapp_business_account') {
    if (body.entry && body.entry.length > 0) {
      body.entry.forEach(entry => {
        const changes = entry.changes || [];
        changes.forEach(change => {
          const value = change.value;

          // A. Delivery & Read Status Updates
          if (value.statuses && value.statuses.length > 0) {
            value.statuses.forEach(statusEvent => {
              const eventRecord = {
                type: 'status_update',
                messageId: statusEvent.id,
                recipientId: statusEvent.recipient_id,
                status: statusEvent.status, // 'sent', 'delivered', 'read', 'failed'
                timestamp: new Date(parseInt(statusEvent.timestamp) * 1000).toISOString(),
                errors: statusEvent.errors || null
              };

              webhookEventsLog.unshift(eventRecord);
              if (webhookEventsLog.length > 500) webhookEventsLog.pop(); // Keep last 500

              console.log(`📡 [Webhook] Message ${statusEvent.id} -> ${statusEvent.status} (${statusEvent.recipient_id})`);
            });
          }

          // B. Inbound Customer Replies & Opt-Out Processing
          if (value.messages && value.messages.length > 0) {
            value.messages.forEach(async incomingMsg => {
              const fromPhone = incomingMsg.from;
              const rawText = incomingMsg.text?.body || '';
              const textBody = rawText.trim().toLowerCase();

              // Auto-Opt Out Detection (Compliance requirement)
              const optOutKeywords = ['stop', 'unsubscribe', 'donotmessage', 'cancel', 'no'];
              if (optOutKeywords.includes(textBody)) {
                suppressionList.add(fromPhone);
                console.log(`🛑 User ${fromPhone} requested Opt-Out. Added to Suppression List.`);
              }

              const msgRecord = {
                type: 'inbound_message',
                from: fromPhone,
                text: rawText || '[Media/Button Response]',
                timestamp: new Date().toISOString()
              };

              webhookEventsLog.unshift(msgRecord);

              // 🚀 AUTONOMOUS GEMINI AI REPLY DISPATCHER
              if (!suppressionList.has(fromPhone) && rawText) {
                try {
                  const aiReply = await generateWhatsAppAIReply(rawText, fromPhone);
                  console.log(`🤖 [Gemini AI Reply to ${fromPhone}]: ${aiReply}`);

                  // If Meta credentials are live, dispatch via WhatsApp Cloud API
                  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
                    await waService.sendTextMessage({ to: fromPhone, body: aiReply });
                  }

                  webhookEventsLog.unshift({
                    type: 'outbound_ai_reply',
                    to: fromPhone,
                    text: aiReply,
                    timestamp: new Date().toISOString()
                  });
                } catch (aiErr) {
                  console.error('Error generating/sending AI WhatsApp reply:', aiErr.message);
                }
              }
            });
          }
        });
      });
    }

    // Always respond 200 OK fast to Meta within 3 seconds
    return res.status(200).send('EVENT_RECEIVED');
  }

  res.sendStatus(404);
});

/**
 * Helper endpoint to inspect recent webhook status events
 */
router.get('/logs', (req, res) => {
  res.json({
    totalEvents: webhookEventsLog.length,
    suppressionCount: suppressionList.size,
    suppressedNumbers: Array.from(suppressionList),
    recentLogs: webhookEventsLog.slice(0, 50)
  });
});

module.exports = {
  router,
  webhookEventsLog,
  suppressionList
};
