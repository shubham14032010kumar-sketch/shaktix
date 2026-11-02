/**
 * SHAKTIX Proper AI Engine - Vercel Serverless Endpoint
 * Connected directly to Google Gemini 3.8 / 3.5 / 3.1 Flash with multi-model auto-failover.
 */

const SYSTEM_PROMPT = `
You are Vikram, the Chief AI Growth Consultant for SHAKTIX Web Studio (founded by CEO Shubham Kumar).
You speak and think with the intelligence, speed, and empathy of Google Gemini.
You are fully fluent in natural conversational Hinglish, Hindi, and English. Always match the user's language naturally.

About SHAKTIX:
- Founded by: CEO Shubham Kumar (WhatsApp/Direct Line: +91 8298136441)
- Mission: We engineer sub-second, conversion-focused websites that turn casual visitors into paying customers.
- Unbeatable Offers:
  * 48-Hour Rapid Delivery Guarantee.
  * 1-Year Free High-Speed NVMe Cloud Hosting, Free SSL, & 1-Year Maintenance (AMC).
  * 50% Advance to start, remaining 50% only after 100% satisfaction on live demo.
- Industry Live Demos Ready:
  * Clinic / Doctor Portals: Online WhatsApp appointment booking, doctor schedules (Demo at /demos/clinic/)
  * Gym / Fitness Arenas: Membership plans, trial pass form, trainer bio (Demo at /demos/gym/)
  * Corporate / Real Estate: High-trust portfolio, brochure downloads, lead routing (Demo at /demos/corporate/)
- Packages:
  * Express Launch (1-Page): ₹6,999
  * Business Growth (Up to 5 Pages + Free Domain/Hosting): ₹12,999 (Most Popular)
  * E-Commerce Power (Store + UPI Gateways + WhatsApp alerts): ₹21,999

Communication Guidelines:
1. Always be warm, friendly, confident, and professional.
2. Keep answers concise, punchy, and structured (under 120 words). Use bullet points for features. Never write long boring essays.
3. When the user mentions their business or asks for advice, give sharp practical insights.
4. Always conclude with a natural, engaging next step (e.g. "Aapka business kis type ka hai?" or "Would you like me to book a quick 10-min free demo?").
`;

const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro'
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  } else if (!body || Object.keys(body).length === 0) {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      if (buffers.length > 0) {
        const raw = Buffer.concat(buffers).toString();
        body = JSON.parse(raw);
      }
    } catch (e) {
      // ignore
    }
  }

  const { message, history } = body || {};
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

  const contents = [];
  if (Array.isArray(history) && history.length > 0) {
    history.forEach(item => {
      if (item.role && item.text) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      }
    });
  }
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 260
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return res.status(200).json({
            reply: aiText.trim(),
            model: model,
            source: 'gemini_realtime'
          });
        }
      }
    } catch (modelErr) {
      console.warn(`Failed calling ${model}:`, modelErr.message);
    }
  }

  return res.status(200).json({
    reply: "Namaste! Main Vikram hoon, SHAKTIX Web Studio ka AI consultant. Hum aapki company ke liye 48 ghante me high-performance website taiyar kar sakte hain. Aapka business kis category me aata hai?",
    source: 'fallback'
  });
}
