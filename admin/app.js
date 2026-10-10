/**
 * SHAKTIX HQ — Executive Admin & AI Workforce Command Engine
 * Orchestrates multi-agent departments, CRM Cloud DB, Sales Machine, and Billing.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. DEPARTMENT NAVIGATION SYSTEM ---
  const navItems = document.querySelectorAll('.nav-item');
  const deptPanels = document.querySelectorAll('.dept-panel');
  const pageDeptTitle = document.getElementById('page-dept-title');
  const pageDeptSub = document.getElementById('page-dept-sub');
  const toast = document.getElementById('admin-toast');
  const toastText = document.getElementById('toast-text');

  const deptMeta = {
    'dept-overview': { title: 'Command Overview', sub: 'Real-time telemetry and autonomous AI workforce operations for SHAKTIX.' },
    'dept-sales': { title: 'Sales & Closer AI (Agent Vikram)', sub: 'High-ticket conversion pitches, objection counter-scripts, and WhatsApp routing.' },
    'dept-audit': { title: 'Lead Scout & Digital Audit (Agent Riya)', sub: '60-Second Trojan Horse gap audits for local businesses to drive 40%+ responses.' },
    'dept-crm': { title: 'CRM & Cloud Database Hub', sub: 'Synced with Supabase Cloud DB (wdgtapmrhzjseihivuoj) and offline local storage.' },
    'dept-delivery': { title: 'Dev & Delivery Department (Agent Aryan)', sub: '48-Hour rapid build milestones, demo template pipelines, and client handovers.' },
    'dept-finance': { title: 'Finance & Invoicing (Agent Pooja)', sub: 'Dynamic scope quotations, 50% milestone invoices, and AMC retainers.' }
  };

  function switchDepartment(targetId) {
    navItems.forEach(n => n.classList.remove('active'));
    deptPanels.forEach(p => p.classList.remove('active'));

    const activeNav = document.querySelector(`.nav-item[data-dept="${targetId}"]`);
    if (activeNav) activeNav.classList.add('active');

    const targetPanel = document.getElementById(targetId);
    if (targetPanel) targetPanel.classList.add('active');

    if (deptMeta[targetId]) {
      pageDeptTitle.textContent = deptMeta[targetId].title;
      pageDeptSub.textContent = deptMeta[targetId].sub;
    }
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-dept');
      switchDepartment(targetId);
    });
  });

  document.querySelectorAll('.switch-dept-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchDepartment(targetId);
    });
  });

  function showToast(msg) {
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
  }

  // --- 2. SALES CLOSER AI ENGINE ---
  const salesForm = document.getElementById('admin-pitch-form');
  const salesOutput = document.getElementById('sales-pitch-output');
  const btnCopySalesPitch = document.getElementById('btn-copy-sales-pitch');
  const btnSendSalesPitch = document.getElementById('btn-send-sales-pitch');

  const liveDemos = {
    clinic: 'https://shaktix-anandkumar41110-8790s-projects.vercel.app/demos/clinic/ (CarePoint Multispeciality Clinic)',
    gym: 'https://shaktix-anandkumar41110-8790s-projects.vercel.app/demos/gym/ (IronFit Elite Fitness Arena)',
    corporate: 'https://shaktix-anandkumar41110-8790s-projects.vercel.app/demos/corporate/ (Nexus Enterprise Studio)',
    restaurant: 'https://shaktix-anandkumar41110-8790s-projects.vercel.app/demos/corporate/ (Bella Vista Bistro & Cafe)',
    coaching: 'https://shaktix-anandkumar41110-8790s-projects.vercel.app/demos/corporate/ (Pinnacle Learning Hub)'
  };

  const gapDescriptions = {
    'no-website': 'Google Maps par aapka official dedicated website missing hai, jisse roz 10-15 potential clients bina call kiye competitors ke paas chale jaate hain.',
    'no-booking': 'Aapki current site par direct 1-Click WhatsApp appointment booking nahi hai (clients ko number dial karna padta hai jisse 40% log drop ho jaate hain).',
    'slow-outdated': 'Aapki purani website mobile par bohot slow load hoti hai aur design phone screens par responsive nahi hai.',
    'justdial': 'Aap sirf JustDial/IndiaMart par dependent hain jahan ek hi enquiry 5 competitors ke sath share ho jaati hai.'
  };

  if (salesForm) {
    salesForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const biz = document.getElementById('sales-biz-name').value.trim();
      const owner = document.getElementById('sales-owner-name').value.trim();
      const phone = document.getElementById('sales-phone').value.trim().replace(/[^0-9]/g, '');
      const niche = document.getElementById('sales-niche').value;
      const city = document.getElementById('sales-city').value.trim() || 'aapke shehar';
      const gapKey = document.getElementById('sales-gap').value;

      const greeting = owner ? `Namaste ${owner} ji! 🙏` : `Namaste ${biz} Team! 🙏`;
      const demo = liveDemos[niche] || liveDemos.corporate;
      const gapText = gapDescriptions[gapKey];

      const pitch = 
`Namaste ${greeting}

Main Shubham Kumar, Founder at *SHAKTIX Web Studio*.

Maine Google par notice kiya ki ${city} me aapka brand *${biz}* kaafi popular hai aur ratings shaandar hain! ⭐

Lekin ek important digital gap notice kiya:
⚠️ *${gapText}*

Humari team ne aapke business ke liye ek ultra-fast live demo template design kiya hai:
👉 *Live Demo:* ${demo}

⚡ *Key Advantages:*
• 1-Click Direct WhatsApp Booking (Zero waiting time).
• Google Maps 1-Click navigation & contact setup.
• Ultra-fast mobile speed (<1s load time).
• 1 Year Free Managed Cloud Hosting & Security included.

Hum ise *48 ghante* me aapke brand ke naam aur photos ke sath live ready kar sakte hain.

*Risk Reversal:* 50% advance to start, balance 50% payment sirf tab jab aap 100% satisfied hon.

Kya main aaj shaam 2 minute ka quick call ya preview share kar sakta hoon? 🙏

— *SHAKTIX Web Studio*
WhatsApp / Call: +91 8298136441`;

      salesOutput.value = pitch;

      const targetPhone = phone || '918298136441';
      btnSendSalesPitch.href = `https://wa.me/${targetPhone}?text=${encodeURIComponent(pitch)}`;

      // Automatically register lead in CRM
      if (window.SHAKTIX_SUPABASE) {
        window.SHAKTIX_SUPABASE.saveLead({
          name: biz,
          phone: targetPhone,
          category: niche,
          notes: `Pitch generated via CSO Worker (${gapKey})`,
          source: 'Admin Sales AI'
        });
        loadCrmLeads();
      }

      showToast('✨ High-Ticket Pitch Synthesized & Lead Saved!');
    });
  }

  btnCopySalesPitch.addEventListener('click', () => {
    if (!salesOutput.value) return showToast('⚠️ Generate a pitch first!');
    navigator.clipboard.writeText(salesOutput.value).then(() => {
      showToast('📋 Pitch copied to clipboard!');
    });
  });

  // --- 3. PSYCHOLOGICAL OBJECTION CRUSHER ---
  const objectionScripts = {
    price: `"Sir, bilkul samajh sakta hoon! Par ek calculation dekhiye:
Agar is website se pure saal me sirf 2 se 3 naye high-paying clients bhi aa gaye, toh aapka poora cost pehle mahine me recover ho jayega.
Baaki 11 mahine ka pura munafa aapka bonus hai. Aur hum 50% advance lete hain — baaki 50% tabhi jab aap kaam se 100% satisfied hon."`,
    instagram: `"Sir, Instagram unke liye hai jo already aapko follow karte hain.
Lekin jo vyakti Google par 'Best Clinic / Best Gym / Best Service in ${document.getElementById('sales-city')?.value || 'area'}' search karta hai, wo turant khareedne ke mood me hota hai.
Google searchers 4x zyada serious aur paying hote hain. Website aapko wo high-intent customers deti hai!"`,
    later: `"Bilkul sir, no problem! Bas ek update:
Hum har area me sirf ek hi business ko hamara 'Showcase Partner' banate hain jisko ₹2,500 ki Google Map SEO bilkul FREE milti hai.
Kya main aapka discount slot kal shaam tak hold rakhu?"`,
    relative: `"Bohot badhiya sir! Par ek cheez dhyaan rakhiyega:
Website sirf dekhne ke liye nahi, balki grahak laane ke liye hoti hai. Relative basic code bana sakta hai, par professional copywriting, 1-second mobile speed, aur 1 saal ka dedicated maintenance support sirf agency provide karti hai."`,
    trust: `"Aapka darr bilkul sahi hai sir, market me log gayab ho jaate hain.
Isiliye SHAKTIX ka policy clear hai:
1. Hum pehle sirf nominal 50% advance lete hain aur official invoice dete hain.
2. 48 ghante me live preview link share karte hain.
3. Jab tak aap '100% OK' nahi bol dete, tab tak final payment nahi karni hoti. Zero risk!"`
  };

  const objTabs = document.querySelectorAll('.obj-tab-btn');
  const rebuttalText = document.getElementById('rebuttal-text-content');
  const btnCopyRebuttal = document.getElementById('btn-copy-rebuttal');

  function renderRebuttal(key) {
    if (objectionScripts[key]) {
      rebuttalText.textContent = objectionScripts[key];
    }
  }
  renderRebuttal('price');

  objTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      objTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-rebuttal');
      renderRebuttal(key);
    });
  });

  btnCopyRebuttal.addEventListener('click', () => {
    navigator.clipboard.writeText(rebuttalText.textContent).then(() => {
      showToast('🛡️ Rebuttal counter-script copied!');
    });
  });

  // --- 4. LEAD SCOUT & 2-MIN AUDIT GENERATOR ---
  const btnGenerateAudit = document.getElementById('btn-generate-audit');
  const auditOutput = document.getElementById('audit-output');
  const btnCopyAudit = document.getElementById('btn-copy-audit');

  if (btnGenerateAudit) {
    btnGenerateAudit.addEventListener('click', () => {
      const biz = document.getElementById('audit-biz-name').value.trim() || 'Aapka Business';
      const rating = document.getElementById('audit-rating').value.trim() || '4.5+ Rating';

      const flaws = [];
      if (document.getElementById('audit-f1')?.checked) flaws.push('⚠️ Mobile users ko direct 1-click WhatsApp booking button nahi mil raha.');
      if (document.getElementById('audit-f2')?.checked) flaws.push('⚠️ Google Maps profile par official website portfolio missing hai.');
      if (document.getElementById('audit-f3')?.checked) flaws.push('⚠️ Existing page mobile par load hone me 4+ second leta hai.');
      if (document.getElementById('audit-f4')?.checked) flaws.push('⚠️ JustDial/portals par listed hone ki wajah se leads competitors ko jaa rahi hain.');

      const auditMsg = 
`Namaste Sir! 🙏

Maine Google Maps par aapka business *${biz}* check kiya.
Aapki Google rating (${rating}) bohot shaandar hai! 🌟

Humne aapke brand ke liye ek 60-second digital presence check kiya aur ye points notice kiye:
${flaws.map(f => '• ' + f).join('\n')}

💡 *Solution Preview:*
Humne doctors/fitness/business owners ke liye ek ready live demo banaya hai jo in saari problems ko solve karta hai:
👉 https://shaktix-anandkumar41110-8790s-projects.vercel.app/demos/clinic/

Aap dekh lijiye, pasand aaye toh hum 48 hours me aapke naam se ready kar denge.

— *Team SHAKTIX Web Studio*
WhatsApp: +91 8298136441`;

      auditOutput.value = auditMsg;
      showToast('🔍 60-Second Mini-Audit Generated!');
    });
  }

  if (btnCopyAudit) {
    btnCopyAudit.addEventListener('click', () => {
      if (!auditOutput.value) return showToast('⚠️ Generate an audit first!');
      navigator.clipboard.writeText(auditOutput.value).then(() => {
        showToast('📋 Audit report copied!');
      });
    });
  }

  // --- 5. CRM & SUPABASE CLOUD SYNC ---
  const crmTableBody = document.getElementById('crm-table-body');
  const sidebarLeadCount = document.getElementById('sidebar-lead-count');
  const kpiTotalLeads = document.getElementById('kpi-total-leads');
  const countAll = document.getElementById('count-all');
  const countPitched = document.getElementById('count-pitched');
  const countInterested = document.getElementById('count-interested');
  const countClosed = document.getElementById('count-closed');
  const btnExportLeads = document.getElementById('btn-export-leads');
  const btnAddLeadModal = document.getElementById('btn-add-lead-modal');

  let leadsMasterList = [];

  async function loadCrmLeads() {
    let leads = [];

    // 1. Fetch from Supabase Cloud if configured
    if (window.SHAKTIX_SUPABASE && window.SHAKTIX_SUPABASE.getUrl()) {
      try {
        const url = `${window.SHAKTIX_SUPABASE.getUrl()}/rest/v1/leads?select=*&order=created_at.desc`;
        const res = await fetch(url, {
          headers: {
            'apikey': window.SHAKTIX_SUPABASE.key,
            'Authorization': `Bearer ${window.SHAKTIX_SUPABASE.key}`
          }
        });
        if (res.ok) {
          leads = await res.json();
          document.getElementById('supabase-status-dot')?.classList.add('online');
        }
      } catch (e) {
        console.warn('Supabase fetch notice:', e);
      }
    }

    // 2. Fallback / Merge with Local Storage
    const local = JSON.parse(localStorage.getItem('shaktix_leads') || '[]');
    if (leads.length === 0) {
      leads = local;
    }

    // Default sample leads if completely empty
    if (leads.length === 0) {
      leads = [
        { name: 'Apex Dental Care', category: 'clinic', phone: '919876543210', source: 'Google Maps Audit', status: 'Pitch Sent' },
        { name: 'IronPulse Gym & CrossFit', category: 'gym', phone: '919812345678', source: 'Instagram Outreach', status: 'Interested' },
        { name: 'Nexora Realty Consultants', category: 'corporate', phone: '919899887766', source: 'Website Form', status: 'Closed' }
      ];
      localStorage.setItem('shaktix_leads', JSON.stringify(leads));
    }

    leadsMasterList = leads;
    renderCrmTable(leads);
  }

  function renderCrmTable(list) {
    if (!crmTableBody) return;

    if (list.length === 0) {
      crmTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:30px;">No leads found in this pipeline filter.</td></tr>`;
      return;
    }

    crmTableBody.innerHTML = list.map((l, i) => {
      const status = l.status || 'Pitch Sent';
      const statusClass = status === 'Closed' ? 'status-active' : 'worker-pill';

      return `
        <tr>
          <td style="font-weight:700; color:#fff;">${l.name || 'Anonymous'}</td>
          <td style="text-transform:capitalize; color:var(--cyan);">${l.category || l.industry || 'General'}</td>
          <td style="font-family:var(--font-mono); color:#e2e8f0;">${l.phone || 'N/A'}</td>
          <td><span class="text-xs text-muted">${l.source || 'Website'}</span></td>
          <td><span class="status-pill ${statusClass}">${status}</span></td>
          <td>
            <a href="https://wa.me/${l.phone ? l.phone.replace(/[^0-9]/g, '') : '918298136441'}" target="_blank" class="btn btn-sm btn-outline" style="padding:4px 8px; font-size:0.75rem;">
              <i class="fa-brands fa-whatsapp text-emerald"></i> Chat
            </a>
          </td>
        </tr>
      `;
    }).join('');

    // Update Counts
    const total = leadsMasterList.length;
    if (sidebarLeadCount) sidebarLeadCount.textContent = total;
    if (kpiTotalLeads) kpiTotalLeads.textContent = `${total} Leads`;
    if (countAll) countAll.textContent = total;

    const pitched = leadsMasterList.filter(l => (l.status || 'Pitch Sent') === 'Pitch Sent').length;
    const interested = leadsMasterList.filter(l => l.status === 'Interested').length;
    const closed = leadsMasterList.filter(l => l.status === 'Closed').length;

    if (countPitched) countPitched.textContent = pitched;
    if (countInterested) countInterested.textContent = interested;
    if (countClosed) countClosed.textContent = closed;
  }

  // Filter Buttons
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderCrmTable(leadsMasterList);
      } else {
        const filtered = leadsMasterList.filter(l => (l.status || 'Pitch Sent') === filter);
        renderCrmTable(filtered);
      }
    });
  });

  // Export CSV
  if (btnExportLeads) {
    btnExportLeads.addEventListener('click', () => {
      if (leadsMasterList.length === 0) return showToast('No leads to export.');
      let csv = 'Name,Category,Phone,Source,Status\n';
      leadsMasterList.forEach(l => {
        csv += `"${l.name}","${l.category || ''}","${l.phone || ''}","${l.source || ''}","${l.status || 'Pitch Sent'}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shaktix_leads_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      showToast('📥 Leads exported to CSV successfully!');
    });
  }

  // Add Lead Modal Trigger
  if (btnAddLeadModal) {
    btnAddLeadModal.addEventListener('click', () => {
      const name = prompt('Client / Business Name:');
      if (!name) return;
      const phone = prompt('WhatsApp Number (with country code):', '91');
      const category = prompt('Category (clinic, gym, corporate, restaurant):', 'clinic');

      if (window.SHAKTIX_SUPABASE) {
        window.SHAKTIX_SUPABASE.saveLead({
          name: name,
          phone: phone,
          category: category,
          notes: 'Added via Admin Terminal',
          source: 'Manual Add'
        });
        loadCrmLeads();
        showToast('✅ Lead saved to Cloud Database!');
      }
    });
  }

  // Refresh All Button
  const btnRefreshAll = document.getElementById('btn-refresh-all');
  if (btnRefreshAll) {
    btnRefreshAll.addEventListener('click', () => {
      loadCrmLeads();
      showToast('🔄 Syncing with Supabase Cloud DB...');
    });
  }

  // --- 6. FINANCE & INVOICING ENGINE ---
  const invoiceClientName = document.getElementById('inv-client-name');
  const invoiceTotalPrice = document.getElementById('inv-total-price');
  const invoiceAdvPrice = document.getElementById('inv-adv-price');
  const invoiceBalPrice = document.getElementById('inv-bal-price');
  const invoiceOutput = document.getElementById('invoice-output');
  const btnCopyInvoice = document.getElementById('btn-copy-invoice');

  const invoiceItems = [
    { id: 'inv-item-web', name: 'Ultra-Fast Responsive Business Website', price: 4999 },
    { id: 'inv-item-wa', name: '1-Click Direct WhatsApp Booking Engine', price: 1500 },
    { id: 'inv-item-host', name: '1 Year Managed Cloud Hosting & Free SSL Security', price: 2000 },
    { id: 'inv-item-seo', name: 'Google Maps Profile & Search Console SEO Suite', price: 2500 },
    { id: 'inv-item-domain', name: 'Custom Domain (.com / .in) 1-Year Registration', price: 1000 },
    { id: 'inv-item-amc', name: 'Annual Maintenance Contract (AMC) Support', price: 3000 }
  ];

  function renderInvoice() {
    let total = 0;
    const selected = [];

    invoiceItems.forEach(item => {
      const cb = document.getElementById(item.id);
      if (cb && cb.checked) {
        total += item.price;
        selected.push(`✓ ${item.name} — ₹${item.price.toLocaleString('en-IN')}`);
      }
    });

    const advance = Math.round(total / 2);
    const balance = total - advance;

    if (invoiceTotalPrice) invoiceTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (invoiceAdvPrice) invoiceAdvPrice.textContent = `₹${advance.toLocaleString('en-IN')}`;
    if (invoiceBalPrice) invoiceBalPrice.textContent = `₹${balance.toLocaleString('en-IN')}`;

    const client = invoiceClientName?.value.trim() || 'Valued Client';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const proposalBody = 
`📄 *SHAKTIX OFFICIAL PROPOSAL & QUOTATION*
----------------------------------------
*Client / Brand:* ${client}
*Date:* ${dateStr}
*Delivery Timeline:* 48 to 72 Hours

*PROJECT DELIVERABLES:*
${selected.join('\n')}

----------------------------------------
💰 *TOTAL INVESTMENT:* ₹${total.toLocaleString('en-IN')} (One-Time)
💳 *PAYMENT MILESTONES:*
• *50% Advance Booking Deposit:* ₹${advance.toLocaleString('en-IN')} (Initiates UI & server setup)
• *50% Final Payment on Live Approval:* ₹${balance.toLocaleString('en-IN')} (Only after 100% satisfaction)

🏦 *PAYMENT METHODS:*
• UPI / PhonePe / GPay: 8298136441@upi
• Account Transfer: Available upon request

🛡️ *SHAKTIX GUARANTEE:*
• 99.9% Cloud Uptime Guarantee
• 100% Satisfaction or full revision
• Zero hidden server charges for 1 Year

Toh kya hum aaj se project initiation start karein sir? 🙏

— *Shubham Kumar*
Founder & CEO, SHAKTIX Web Studio
Direct Contact: +91 8298136441`;

    if (invoiceOutput) invoiceOutput.value = proposalBody;
  }

  invoiceItems.forEach(item => {
    const cb = document.getElementById(item.id);
    if (cb) cb.addEventListener('change', renderInvoice);
  });
  if (invoiceClientName) invoiceClientName.addEventListener('input', renderInvoice);

  if (btnCopyInvoice) {
    btnCopyInvoice.addEventListener('click', () => {
      if (!invoiceOutput.value) return showToast('⚠️ Generate a proposal first!');
      navigator.clipboard.writeText(invoiceOutput.value).then(() => {
        showToast('📋 Official Proposal copied to clipboard!');
      });
    });
  }

  // Initial Runs
  loadCrmLeads();
  renderInvoice();
});
