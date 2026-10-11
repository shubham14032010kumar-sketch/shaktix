# 🚀 SHAKTIX WhatsApp Bulk Sender & Custom CRM Platform

An enterprise-grade, high-converting WhatsApp Bulk Messaging Engine & Custom Lead CRM built specifically for **SHAKTIX Web Studio** to scale agency outreach and provide WhatsApp marketing automation to clients (Clinics, Gyms, Restaurants, Institutes, and Corporate brands).

---

## 🌟 Key Features

### 1. 👥 Custom CRM & Lead Pipeline
- **Lead Pipeline**: Kanban board with stages: `New Lead` ➔ `Contacted` ➔ `Proposal Sent` ➔ `Closed Won`.
- **Target Segmentation**: Filter prospects by niche (`clinic`, `gym`, `restaurant`, `institute`, `corporate`, `vip`).
- **CSV / Excel Bulk Importer**: Drag-and-drop parser with instant column mapping and validation.
- **Opt-in Compliance**: Enforced consent tracking with automatic suppression/blacklist upon incoming `STOP` keywords.

### 2. 📱 Interactive WhatsApp Campaign Engine
- **Pre-Approved Meta Templates**:
  - `clinic_growth_pitch` (Healthcare appointment boost)
  - `gym_member_offer` (Fitness membership pass lead generation)
  - `festival_promo` (High-conversion 30% discount offer)
  - `payment_reminder` (Automated invoice follow-up)
  - `otp_auth` (Instant 2FA verification)
- **Live WhatsApp Phone Simulator**: Real-time interactive preview showing exact recipient view, double-ticks, dynamic variables `{{1}}`, `{{2}}`, and action buttons.
- **Anti-Ban Throttling**: Adjustable pace slider (1 to 50 msgs/second) ensuring compliance with Meta Cloud API rate limits.

### 3. ⚙️ Official Meta Cloud API Backend
- **Node.js & Express Architecture**: Located in `/server/`.
- **Axios Meta Graph API v21.0 Client**: Real template dispatching and message tracking.
- **Webhook Listener**: Handshake verification (`GET /api/webhook`) and live status callback stream (`POST /api/webhook`).
- **PostgreSQL / SQLite Database Schema**: Production-ready schema in `/database/schema.sql`.

---

## 📂 Directory Structure

```text
whatsapp-bulk-sender/
├── index.html                 # Complete Dark-Mode CRM & Campaign Dashboard
├── style.css                  # Obsidian slate & emerald styling, phone simulator
├── app.js                     # Reactive client controller & state manager
├── database/
│   └── schema.sql             # PostgreSQL schema with multi-tenancy & webhooks
├── server/
│   ├── package.json           # Node.js backend dependencies
│   ├── .env.example           # Meta API keys & webhook secret template
│   ├── server.js              # Express API & throttled message dispatcher
│   ├── services/
│   │   └── whatsappCloudApi.js# Meta Graph API SDK client
│   └── routes/
│       └── webhook.js         # Meta verification & status webhook router
└── README.md                  # System operating manual
```

---

## ⚡ Quickstart

### Option A: Open the Interactive Dashboard Directly
Double-click or open `whatsapp-bulk-sender/index.html` in your web browser. 
It runs with built-in reactive local storage, preloaded leads, live phone simulation, and campaign dispatch engine.

### Option B: Run Full-Stack with Node.js Server
1. Navigate to the server folder:
   ```bash
   cd whatsapp-bulk-sender/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill your Meta credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the backend:
   ```bash
   npm start
   ```
5. Open `http://localhost:5000` in your browser.

---

## 🛡️ Anti-Ban & Meta Compliance Safeguards
1. **Always Use Approved Templates**: For cold outreach, never send freeform text. Only use WhatsApp Business pre-approved marketing templates.
2. **Opt-Out Mechanism**: Every marketing template includes an auto-opt-out button (`Reply STOP to Unsubscribe`).
3. **Throttled Queues**: System prevents bursts by pacing messages through controlled queues (recommended: 15 msgs/sec).
