/**
 * SHAKTIX ENTERPRISE CRM & WHATSAPP ENGINE MASTER CONTROLLER
 * Full 14-Module Architecture: Contacts, Customer 360° Drawer, 2-Way Inbox, Kanban, Orders, Tasks
 */

// ==============================================================
// INITIAL SEED STATE & LOCALSTORAGE HYDRATION
// ==============================================================
const DEFAULT_CONTACTS = [
  {
    id: 'c_1',
    name: 'Dr. Rajiv Sharma',
    phone: '919876543210',
    email: 'dr.sharma@apexdental.in',
    company: 'Apex Dental & Maxillofacial Care',
    city: 'Delhi NCR',
    stage: 'qualified',
    dealValue: 35000,
    source: 'website',
    assignedTo: 'Shubham (CSO)',
    tags: ['clinic', 'vip'],
    optIn: true,
    timeline: [
      { title: 'Customer Added to CRM', desc: 'Inquiry received via SHAKTIX Doctor Clinic Landing Page form', time: '10 Oct, 09:30 AM', type: 'contact_created' },
      { title: 'WhatsApp Outreach Sent', desc: 'Automated clinic_growth_pitch template delivered to WhatsApp', time: '10 Oct, 09:31 AM', type: 'whatsapp_sent' },
      { title: 'Lead Qualified', desc: 'Doctor responded on WhatsApp interested in 1-tap patient booking portal', time: '10 Oct, 02:15 PM', type: 'stage_changed' },
      { title: 'Demo Call Completed', desc: 'Showcased CarePoint Clinic interactive demo. Liked the doctor schedule feature.', time: '11 Oct, 10:00 AM', type: 'note_added' }
    ],
    notes: [
      { text: 'Doctor wants online booking integrated with his clinic assistant WhatsApp number. Agreed to ₹35k package.', author: 'Shubham (CSO)', time: '11 Oct, 10:05 AM' }
    ],
    orders: [
      { id: 'ORD-1001', service: 'Elite Clinic Web Platform + WhatsApp Booking', amount: 35000, paymentStatus: 'paid', date: '2026-10-10' }
    ]
  },
  {
    id: 'c_2',
    name: 'Vikram Malhotra',
    phone: '919811223344',
    email: 'vikram@ironfitgym.com',
    company: 'IronFit CrossFit & Fitness Studio',
    city: 'Mumbai',
    stage: 'contacted',
    dealValue: 28000,
    source: 'instagram',
    assignedTo: 'Pooja (Growth)',
    tags: ['gym'],
    optIn: true,
    timeline: [
      { title: 'Lead Created', desc: 'Imported from Gym Owner Directory CSV', time: '09 Oct, 04:00 PM', type: 'contact_created' },
      { title: 'Pitch Delivered', desc: 'Sent gym_member_offer WhatsApp template with pass booking offer', time: '09 Oct, 04:02 PM', type: 'whatsapp_sent' }
    ],
    notes: [
      { text: 'Owner was busy during morning call. Requested callback in evening at 6:30 PM.', author: 'Pooja (Growth)', time: '10 Oct, 11:30 AM' }
    ],
    orders: []
  },
  {
    id: 'c_3',
    name: 'Ananya Roy',
    phone: '919712345678',
    email: 'ananya@royhospitality.com',
    company: 'Roy Grand Dining & Banquet',
    city: 'Kolkata',
    stage: 'proposal_sent',
    dealValue: 45000,
    source: 'cold_outreach',
    assignedTo: 'Shubham (CSO)',
    tags: ['restaurant', 'vip'],
    optIn: true,
    timeline: [
      { title: 'Inquiry Captured', desc: 'Direct WhatsApp message regarding table reservation system', time: '08 Oct, 01:20 PM', type: 'contact_created' },
      { title: 'Formal Proposal Sent', desc: 'Sent ₹45,000 Luxury Restaurant Website + QR Digital Menu Proposal PDF', time: '10 Oct, 05:00 PM', type: 'stage_changed' }
    ],
    notes: [
      { text: 'Awaiting decision by partner meeting tomorrow. Follow up at 11 AM.', author: 'Shubham (CSO)', time: '10 Oct, 05:15 PM' }
    ],
    orders: []
  },
  {
    id: 'c_4',
    name: 'Sanjay Gupta',
    phone: '919988776655',
    email: 'director@guptaiit.ac.in',
    company: 'Gupta IIT-JEE & NEET Academy',
    city: 'Patna',
    stage: 'closed_won',
    dealValue: 50000,
    source: 'referral',
    assignedTo: 'Shubham (CSO)',
    tags: ['institute', 'vip'],
    optIn: true,
    timeline: [
      { title: 'Client Signed Contract', desc: 'Closed ₹50,000 Coaching Web Portal with student lead generation', time: '07 Oct, 11:00 AM', type: 'stage_changed' },
      { title: 'Advance Received', desc: '₹25,000 (50% Advance) credited via UPI', time: '07 Oct, 12:30 PM', type: 'order_placed' }
    ],
    notes: [
      { text: 'Phase 1 deployed. Client fully satisfied, final 50% milestone invoice scheduled.', author: 'Shubham (CSO)', time: '09 Oct, 02:00 PM' }
    ],
    orders: [
      { id: 'ORD-1002', service: 'Elite Educational Portal + Fee Collection', amount: 50000, paymentStatus: 'paid', date: '2026-10-07' }
    ]
  }
];

const DEFAULT_TASKS = [
  { id: 't_1', contactId: 'c_3', title: 'Follow-up with Ananya Roy regarding Restaurant Proposal', dueDate: '2026-10-11', priority: 'high', status: 'pending', assignedTo: 'Shubham (CSO)' },
  { id: 't_2', contactId: 'c_2', title: 'Call Vikram Malhotra (IronFit Gym) for Demo walkthrough', dueDate: '2026-10-11', priority: 'medium', status: 'pending', assignedTo: 'Pooja (Growth)' },
  { id: 't_3', contactId: 'c_1', title: 'Send Milestone 2 Review Link to Dr. Rajiv Sharma', dueDate: '2026-10-13', priority: 'medium', status: 'pending', assignedTo: 'Shubham (CSO)' }
];

const DEFAULT_ORDERS = [
  { id: 'ORD-1001', contactId: 'c_1', contactName: 'Dr. Rajiv Sharma', service: 'CarePoint Clinic Web Suite', amount: 35000, paymentStatus: 'paid', fulfillmentStatus: 'delivered', date: '2026-10-10' },
  { id: 'ORD-1002', contactId: 'c_4', contactName: 'Sanjay Gupta', service: 'Gupta IIT Education Platform', amount: 50000, paymentStatus: 'paid', fulfillmentStatus: 'in_progress', date: '2026-10-07' },
  { id: 'ORD-1003', contactId: 'c_3', contactName: 'Ananya Roy', service: 'Roy Banquet Digital Suite', amount: 45000, paymentStatus: 'pending', fulfillmentStatus: 'pending', date: '2026-10-10' }
];

const DEFAULT_CONVERSATIONS = [
  {
    contactId: 'c_1',
    phone: '919876543210',
    name: 'Dr. Rajiv Sharma',
    avatar: 'RS',
    unread: 0,
    isUnanswered: false,
    priority: 'high',
    messages: [
      { direction: 'outbound', text: 'Namaste Dr. Sharma ji! We reviewed your clinic\'s online presence. Would you like to see our 1-tap WhatsApp patient booking platform?', time: '10:00 AM' },
      { direction: 'inbound', text: 'Namaste! Yes, we get lots of calls while I am examining patients. Can this automate appointments directly?', time: '10:14 AM' },
      { direction: 'outbound', text: 'Yes doctor! Patients can view available slots and book in 10 seconds. Let me share the live demo link.', time: '10:18 AM' }
    ]
  },
  {
    contactId: 'c_2',
    phone: '919811223344',
    name: 'Vikram Malhotra',
    avatar: 'VM',
    unread: 1,
    isUnanswered: true,
    priority: 'medium',
    messages: [
      { direction: 'outbound', text: 'Hey Vikram! Transform your gym walk-ins this quarter with our high-converting fitness platform.', time: 'Yesterday' },
      { direction: 'inbound', text: 'What is the pricing for a gym website with membership plans?', time: '09:20 AM' }
    ]
  },
  {
    contactId: 'c_3',
    phone: '919712345678',
    name: 'Ananya Roy',
    avatar: 'AR',
    unread: 1,
    isUnanswered: true,
    priority: 'high',
    messages: [
      { direction: 'outbound', text: 'Hi Ananya, here is the proposal PDF for Roy Grand Dining web experience.', time: '10 Oct' },
      { direction: 'inbound', text: 'Received the proposal. Reviewing with my team today.', time: '10:30 AM' }
    ]
  },
  {
    contactId: 'c_4',
    phone: '919988776655',
    name: 'Sanjay Gupta',
    avatar: 'SG',
    unread: 0,
    isUnanswered: false,
    priority: 'medium',
    messages: [
      { direction: 'inbound', text: 'Advance of ₹25,000 sent via UPI. Please proceed with Phase 1.', time: '07 Oct' },
      { direction: 'outbound', text: 'Payment received with thanks! Our engineering team has started deployment.', time: '07 Oct' }
    ]
  }
];

// STATE STORE
const STATE = {
  activeTab: 'dashboard',
  contacts: JSON.parse(localStorage.getItem('shaktix_crm_contacts')) || DEFAULT_CONTACTS,
  tasks: JSON.parse(localStorage.getItem('shaktix_crm_tasks')) || DEFAULT_TASKS,
  orders: JSON.parse(localStorage.getItem('shaktix_crm_orders')) || DEFAULT_ORDERS,
  conversations: JSON.parse(localStorage.getItem('shaktix_crm_convos')) || DEFAULT_CONVERSATIONS,
  activeChatContactId: 'c_1',
  selectedContactId: null,
  
  // Filters
  contactsSearch: '',
  contactsTagFilter: 'all',
  contactsStageFilter: 'all',
  taskFilter: 'all',
  inboxFilter: 'all',
  
  // Staged CSV
  stagedCsv: [],
  throttleSpeed: 15
};

// WhatsApp Approved Templates Dictionary
const TEMPLATES = {
  clinic_growth_pitch: {
    name: 'clinic_growth_pitch',
    header: 'HEALTHCARE APPOINTMENT BOOST',
    body: (name, offer) => `Namaste <strong>${name}</strong> ji! 🙏<br><br>We reviewed your clinic's local Google presence and noticed patients are searching for appointments online, but don't have a direct 1-tap WhatsApp booking portal.<br><br>We guarantee <strong>${offer || '25+ New Patient Inquiries This Month'}</strong> with our custom healthcare web platform.<br><br>Would you like to see a 60-second live demo tailored for your clinic?`,
    buttons: [
      { text: 'Book 10-Min Demo', icon: 'fa-calendar-check' },
      { text: 'View Live Clinic Demo', icon: 'fa-globe' },
      { text: 'Reply STOP to Unsubscribe', icon: 'fa-ban', optOut: true }
    ]
  },
  gym_member_offer: {
    name: 'gym_member_offer',
    header: 'FITNESS CLUB INVITATION',
    body: (name, offer) => `Hey <strong>${name}</strong>! 💪<br><br>Supercharge your gym's walk-ins this quarter with automated pass bookings.<br><br>Value guarantee: <strong>${offer || '35+ New Walk-ins Guaranteed'}</strong>.<br><br>Let's schedule a 5-minute phone walkthrough?`,
    buttons: [
      { text: 'Claim VIP Gym Demo', icon: 'fa-dumbbell' },
      { text: 'Call Growth Team', icon: 'fa-phone' },
      { text: 'Reply STOP to Unsubscribe', icon: 'fa-ban', optOut: true }
    ]
  },
  festival_promo: {
    name: 'festival_promo',
    header: 'EXCLUSIVE 30% FESTIVE DISCOUNT',
    body: (name, offer) => `Namaste <strong>${name}</strong>! 🎉<br><br>Upgrade ${name}'s digital brand for the upcoming festive peak season.<br><br>Offer: <strong>${offer || 'Flat 30% Off + Free 1-Year Hosting'}</strong>.<br><br>Check our elite demo showcase below:`,
    buttons: [
      { text: 'Explore Live Demos', icon: 'fa-arrow-up-right-from-square' },
      { text: 'Chat on WhatsApp', icon: 'fa-brands fa-whatsapp' },
      { text: 'Reply STOP to Unsubscribe', icon: 'fa-ban', optOut: true }
    ]
  },
  payment_reminder: {
    name: 'payment_reminder',
    header: 'INVOICE & BILLING UPDATE',
    body: (name, offer) => `Dear <strong>${name}</strong>,<br><br>Greetings from SHAKTIX. Your milestone invoice for <strong>${offer || 'Phase 1 Deployment'}</strong> is ready.<br><br>Please tap below to review and pay securely via UPI / Netbanking.`,
    buttons: [
      { text: 'View & Pay Invoice', icon: 'fa-credit-card' },
      { text: 'Download Receipt', icon: 'fa-file-pdf' }
    ]
  },
  otp_auth: {
    name: 'otp_auth',
    header: 'SECURITY VERIFICATION',
    body: (name, offer) => `Hello <strong>${name}</strong>,<br><br>Your SHAKTIX Portal verification code is <strong>${offer || '849201'}</strong>. Valid for 10 minutes.`,
    buttons: [
      { text: 'Copy OTP Code', icon: 'fa-copy' }
    ]
  }
};

// ==============================================================
// INITIALIZATION
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
  setupSidebarNav();
  setupContactsHub();
  setupCustomerDrawer();
  setupInbox();
  setupKanbanPipeline();
  setupTasksModule();
  setupCampaignBuilder();
  setupModals();
  renderAll();
});

function renderAll() {
  saveState();
  updateDashboardKpis();
  renderOverviewTables();
  renderContactsTable();
  renderKanban();
  renderInboxThreads();
  renderActiveChat();
  renderTasks();
  renderOrders();
  renderTemplatesGrid();
  updateLivePhonePreview();
}

function saveState() {
  localStorage.setItem('shaktix_crm_contacts', JSON.stringify(STATE.contacts));
  localStorage.setItem('shaktix_crm_tasks', JSON.stringify(STATE.tasks));
  localStorage.setItem('shaktix_crm_orders', JSON.stringify(STATE.orders));
  localStorage.setItem('shaktix_crm_convos', JSON.stringify(STATE.conversations));
}

// ==============================================================
// 1. SIDEBAR NAVIGATION
// ==============================================================
function setupSidebarNav() {
  const navItems = document.querySelectorAll('.nav-item');
  const titleEl = document.getElementById('page-title');
  const subtitleEl = document.getElementById('page-subtitle');

  const tabMeta = {
    dashboard: { title: 'Overview Dashboard', sub: 'Real-time revenue, leads pipeline, WhatsApp conversations and pending follow-ups.' },
    contacts: { title: 'Contact & Customer Management', sub: 'Search, tag, import CSV leads, and inspect full customer 360° histories.' },
    leads: { title: 'Leads & Sales Pipeline (Kanban)', sub: 'Track deal stages from New Lead to Qualified to Closed Won.' },
    inbox: { title: 'WhatsApp 2-Way Inbox', sub: 'Live conversation threads, quick template replies, and internal team notes.' },
    campaigns: { title: 'Bulk WhatsApp Campaigns', sub: 'Compose personalized campaigns with anti-ban throttling and live phone simulation.' },
    scheduler: { title: 'Broadcast Scheduler', sub: 'Timezone-aware broadcast queues and scheduled promotional blasts.' },
    templates: { title: 'Meta Approved Templates', sub: 'Pre-approved WhatsApp Cloud API templates for marketing, utility and OTPs.' },
    automation: { title: 'CRM Automation Workflows', sub: 'Event-driven triggers: auto greetings, payment alerts, and STOP suppression.' },
    orders: { title: 'Client Orders & Invoicing', sub: 'Manage contracts, track milestone payments, and send WhatsApp payment receipts.' },
    tasks: { title: 'Tasks & Prospect Follow-ups', sub: 'Never miss a callback, meeting, or closing milestone with daily reminders.' },
    analytics: { title: 'Analytics & Performance Reports', sub: 'Lead conversion rates, message delivery trends, and average deal size.' },
    team: { title: 'Team Members & Permissions', sub: 'Manage sales agents, role-based access, and assigned lead capacities.' },
    integrations: { title: 'Integrations Hub', sub: 'Connect Meta WhatsApp Cloud API, PostgreSQL, and payment gateways.' },
    settings: { title: 'System & API Settings', sub: 'Meta WABA credentials, phone number ID, and webhook tokens.' }
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      navigateToTab(tab);
    });
  });

  window.navigateToTab = function(tab) {
    STATE.activeTab = tab;
    navItems.forEach(n => n.classList.remove('active'));
    const targetNav = document.querySelector(`.nav-item[data-tab="${tab}"]`);
    if (targetNav) targetNav.classList.add('active');

    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const pane = document.getElementById(`tab-${tab}`);
    if (pane) pane.classList.add('active');

    if (tabMeta[tab]) {
      titleEl.textContent = tabMeta[tab].title;
      subtitleEl.textContent = tabMeta[tab].sub;
    }
  };

  document.getElementById('btn-top-add-lead')?.addEventListener('click', () => {
    document.getElementById('modal-add-contact').classList.add('active');
  });

  document.getElementById('btn-top-new-campaign')?.addEventListener('click', () => {
    navigateToTab('campaigns');
  });
}

// ==============================================================
// 2. DASHBOARD OVERVIEW & KPIS
// ==============================================================
function updateDashboardKpis() {
  const totalContacts = STATE.contacts.length;
  const newLeads = STATE.contacts.filter(c => c.stage === 'new_lead').length;
  const totalRevenue = STATE.orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const tasksToday = STATE.tasks.filter(t => t.status === 'pending').length;
  const unansweredConvos = STATE.conversations.filter(c => c.isUnanswered).length;
  const pipelineValue = STATE.contacts
    .filter(c => c.stage !== 'closed_lost')
    .reduce((sum, c) => sum + (c.dealValue || 0), 0);

  // Update top metrics
  document.getElementById('kpi-total-customers').textContent = totalContacts;
  document.getElementById('kpi-new-leads-count').textContent = newLeads;
  document.getElementById('kpi-sales-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById('kpi-due-today').textContent = tasksToday;
  
  // Sidebar Badges
  document.getElementById('badge-total-contacts').textContent = totalContacts;
  document.getElementById('badge-pipeline-value').textContent = `₹${(pipelineValue / 100000).toFixed(1)}L`;
  document.getElementById('badge-unanswered').textContent = unansweredConvos;
  document.getElementById('badge-due-today').textContent = tasksToday;

  // Kanban bar metrics
  const kanbanValEl = document.getElementById('kanban-total-value');
  if (kanbanValEl) kanbanValEl.textContent = `₹${pipelineValue.toLocaleString('en-IN')}`;
  const kanbanDealsEl = document.getElementById('kanban-total-deals');
  if (kanbanDealsEl) kanbanDealsEl.textContent = `${totalContacts} Opportunities`;
}

function renderOverviewTables() {
  // 1. High intent leads table in dashboard
  const tbody = document.getElementById('overview-leads-table');
  if (!tbody) return;

  const topLeads = STATE.contacts.slice(0, 4);
  tbody.innerHTML = topLeads.map(c => `
    <tr class="clickable-row" onclick="openCustomerDrawer('${c.id}')">
      <td><strong>${escapeHtml(c.name)}</strong></td>
      <td>${escapeHtml(c.company || 'Direct Lead')}</td>
      <td class="text-gold font-mono"><strong>₹${(c.dealValue || 0).toLocaleString('en-IN')}</strong></td>
      <td><span class="badge-tag tag-${c.stage}">${c.stage.replace('_', ' ').toUpperCase()}</span></td>
      <td><span class="text-muted"><i class="fa-solid fa-calendar-check text-rose"></i> Next Follow-up</span></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); openCustomerDrawer('${c.id}')">
          <i class="fa-solid fa-eye"></i> View 360°
        </button>
      </td>
    </tr>
  `).join('');

  // 2. Quick task widget
  const taskList = document.getElementById('overview-tasks-list');
  if (!taskList) return;

  const pendingTasks = STATE.tasks.filter(t => t.status === 'pending').slice(0, 3);
  taskList.innerHTML = pendingTasks.map(t => `
    <div class="task-quick-item">
      <input type="checkbox" onchange="toggleTaskStatus('${t.id}')">
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700;">${escapeHtml(t.title)}</div>
        <div style="font-size:11px; color:#94a3b8;"><i class="fa-solid fa-calendar"></i> Due: ${t.dueDate} • ${t.assignedTo}</div>
      </div>
      <span class="badge-tag ${t.priority === 'high' ? 'badge-rose' : 'badge-gold'}">${t.priority.toUpperCase()}</span>
    </div>
  `).join('');
}

// ==============================================================
// 3. CONTACT & CUSTOMER MANAGEMENT
// ==============================================================
function setupContactsHub() {
  const searchInput = document.getElementById('contacts-search');
  const tagFilter = document.getElementById('contacts-tag-filter');
  const stageFilter = document.getElementById('contacts-stage-filter');

  searchInput?.addEventListener('input', (e) => {
    STATE.contactsSearch = e.target.value.toLowerCase();
    renderContactsTable();
  });

  tagFilter?.addEventListener('change', (e) => {
    STATE.contactsTagFilter = e.target.value;
    renderContactsTable();
  });

  stageFilter?.addEventListener('change', (e) => {
    STATE.contactsStageFilter = e.target.value;
    renderContactsTable();
  });

  // Export CSV Action
  document.getElementById('btn-export-contacts-csv')?.addEventListener('click', exportContactsCsv);

  // Open Add Contact Modal
  document.getElementById('btn-open-add-contact')?.addEventListener('click', () => {
    document.getElementById('modal-add-contact').classList.add('active');
  });

  // Open CSV Import Modal
  document.getElementById('btn-open-contacts-import')?.addEventListener('click', () => {
    document.getElementById('modal-import-csv').classList.add('active');
  });
}

function getFilteredContacts() {
  return STATE.contacts.filter(c => {
    const matchesTag = STATE.contactsTagFilter === 'all' || c.tags.includes(STATE.contactsTagFilter);
    const matchesStage = STATE.contactsStageFilter === 'all' || c.stage === STATE.contactsStageFilter;
    const matchesSearch = !STATE.contactsSearch ||
      c.name.toLowerCase().includes(STATE.contactsSearch) ||
      c.phone.includes(STATE.contactsSearch) ||
      (c.company && c.company.toLowerCase().includes(STATE.contactsSearch)) ||
      (c.city && c.city.toLowerCase().includes(STATE.contactsSearch));
    return matchesTag && matchesStage && matchesSearch;
  });
}

function renderContactsTable() {
  const tbody = document.getElementById('contacts-table-body');
  const countLabel = document.getElementById('contacts-count-label');
  if (!tbody) return;

  const filtered = getFilteredContacts();
  countLabel.textContent = filtered.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="padding:24px;">No contacts found matching search filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr class="clickable-row" onclick="openCustomerDrawer('${c.id}')">
      <td><strong>${escapeHtml(c.name)}</strong></td>
      <td class="font-mono text-emerald">+${escapeHtml(c.phone)}</td>
      <td>${escapeHtml(c.company || 'Individual')}</td>
      <td>${escapeHtml(c.city || 'India')}</td>
      <td>${c.tags.map(t => `<span class="badge-tag tag-${t}">${t}</span>`).join(' ')}</td>
      <td><span class="text-muted" style="font-size:11.5px;">${escapeHtml(c.assignedTo || 'Unassigned')}</span></td>
      <td><span class="badge-tag tag-${c.stage}">${c.stage.replace('_', ' ').toUpperCase()}</span></td>
      <td><span class="badge-emerald"><i class="fa-solid fa-check"></i> OPT-IN</span></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); openCustomerDrawer('${c.id}')" title="View 360° Profile">
          <i class="fa-solid fa-id-card"></i> Profile
        </button>
      </td>
    </tr>
  `).join('');
}

function exportContactsCsv() {
  const headers = ['Name', 'Phone', 'Email', 'Company', 'City', 'Stage', 'DealValue', 'Tags'];
  const rows = STATE.contacts.map(c => [
    `"${c.name}"`,
    `"${c.phone}"`,
    `"${c.email || ''}"`,
    `"${c.company || ''}"`,
    `"${c.city || ''}"`,
    `"${c.stage}"`,
    `"${c.dealValue || 0}"`,
    `"${c.tags.join(',')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `shaktix_crm_contacts_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Exported contacts CSV successfully!');
}

// ==============================================================
// 4. CUSTOMER 360° PROFILE DRAWER
// ==============================================================
function setupCustomerDrawer() {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('customer-drawer');
  const closeBtn = document.getElementById('btn-close-drawer');

  closeBtn?.addEventListener('click', closeCustomerDrawer);
  overlay?.addEventListener('click', closeCustomerDrawer);

  // Drawer Tabs Switcher
  const dTabs = document.querySelectorAll('.d-tab-btn');
  dTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-dtab');
      document.querySelectorAll('.d-tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(`dtab-${target}`)?.classList.add('active');
    });
  });

  // Add Internal Note form
  document.getElementById('d-form-add-note')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteText = document.getElementById('d-note-input').value.trim();
    if (!noteText || !STATE.selectedContactId) return;

    const contact = STATE.contacts.find(c => c.id === STATE.selectedContactId);
    if (contact) {
      if (!contact.notes) contact.notes = [];
      const newNote = {
        text: noteText,
        author: 'Shubham (CSO)',
        time: 'Just now'
      };
      contact.notes.unshift(newNote);

      // Append to timeline
      if (!contact.timeline) contact.timeline = [];
      contact.timeline.unshift({
        title: 'Internal Note Added',
        desc: noteText,
        time: 'Just now',
        type: 'note_added'
      });

      saveState();
      renderCustomerDrawer(contact);
      document.getElementById('d-note-input').value = '';
      showToast('Internal note saved to timeline!');
    }
  });

  // Drawer Action: Add Task
  document.getElementById('d-add-task-btn')?.addEventListener('click', () => {
    closeCustomerDrawer();
    document.getElementById('modal-add-task').classList.add('active');
  });
}

window.openCustomerDrawer = function(contactId) {
  const contact = STATE.contacts.find(c => c.id === contactId);
  if (!contact) return;

  STATE.selectedContactId = contactId;
  renderCustomerDrawer(contact);

  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('customer-drawer').classList.add('active');
};

function closeCustomerDrawer() {
  document.getElementById('drawer-overlay')?.classList.remove('active');
  document.getElementById('customer-drawer')?.classList.remove('active');
}

function renderCustomerDrawer(contact) {
  // Avatar & Header
  const initials = contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('d-avatar').textContent = initials;
  document.getElementById('d-name').textContent = contact.name;
  document.getElementById('d-company').textContent = `${contact.company || 'Individual Lead'} • ${contact.city || 'India'}`;

  // Quick strip
  document.getElementById('d-stage').textContent = contact.stage.replace('_', ' ').toUpperCase();
  document.getElementById('d-deal-value').textContent = `₹${(contact.dealValue || 0).toLocaleString('en-IN')}`;
  document.getElementById('d-assigned').textContent = contact.assignedTo || 'Shubham (CSO)';
  document.getElementById('d-source').textContent = (contact.source || 'Website').toUpperCase();

  // WhatsApp & Call Buttons
  const waBtn = document.getElementById('d-wa-action-btn');
  waBtn.href = `https://wa.me/${contact.phone}?text=Namaste%20${encodeURIComponent(contact.name)}%20ji,%20greetings%20from%20SHAKTIX!`;
  const callBtn = document.getElementById('d-call-action-btn');
  callBtn.href = `tel:+${contact.phone}`;

  // Timeline list
  const tlContainer = document.getElementById('d-timeline-list');
  const timeline = contact.timeline || [];
  tlContainer.innerHTML = timeline.map(event => `
    <div class="timeline-item">
      <div class="timeline-dot ${event.type === 'stage_changed' ? 'dot-gold' : (event.type === 'order_placed' ? 'dot-blue' : '')}"></div>
      <div class="timeline-card">
        <div class="tl-header">
          <div class="tl-title">${escapeHtml(event.title)}</div>
          <div class="tl-time">${escapeHtml(event.time)}</div>
        </div>
        <div class="tl-desc">${escapeHtml(event.desc)}</div>
      </div>
    </div>
  `).join('');

  // Notes list
  const notesContainer = document.getElementById('d-notes-list');
  const notes = contact.notes || [];
  document.getElementById('d-notes-count').textContent = notes.length;
  notesContainer.innerHTML = notes.map(n => `
    <div class="note-item">
      <div class="note-header">
        <span><strong>${escapeHtml(n.author)}</strong></span>
        <span>${escapeHtml(n.time)}</span>
      </div>
      <div class="note-text">${escapeHtml(n.text)}</div>
    </div>
  `).join('');

  // Orders list
  const ordersContainer = document.getElementById('d-orders-list');
  const orders = contact.orders || [];
  document.getElementById('d-orders-count').textContent = orders.length;
  if (orders.length === 0) {
    ordersContainer.innerHTML = `<p class="text-muted" style="font-size:12px;">No orders placed yet. Move lead to Closed Won to create contract.</p>`;
  } else {
    ordersContainer.innerHTML = orders.map(o => `
      <div class="card" style="margin-bottom:10px; padding:12px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <strong style="font-size:13px;">${o.id}: ${escapeHtml(o.service)}</strong>
          <span class="text-gold font-mono">₹${o.amount.toLocaleString('en-IN')}</span>
        </div>
        <div style="font-size:11px; color:#94a3b8;">Status: <span class="badge-emerald">${o.paymentStatus.toUpperCase()}</span> • ${o.date}</div>
      </div>
    `).join('');
  }
}

// ==============================================================
// 5. LEADS & SALES PIPELINE (KANBAN)
// ==============================================================
function setupKanbanPipeline() {
  document.getElementById('btn-kanban-add-deal')?.addEventListener('click', () => {
    document.getElementById('modal-add-contact').classList.add('active');
  });
}

function renderKanban() {
  const stages = ['new_lead', 'contacted', 'qualified', 'proposal_sent', 'closed_won'];

  stages.forEach(stage => {
    const stageContacts = STATE.contacts.filter(c => c.stage === stage);
    const sum = stageContacts.reduce((acc, c) => acc + (c.dealValue || 0), 0);

    const countEl = document.getElementById(`kanban-count-${stage}`);
    const sumEl = document.getElementById(`kanban-sum-${stage}`);
    const cardsEl = document.getElementById(`kanban-cards-${stage}`);

    if (countEl) countEl.textContent = stageContacts.length;
    if (sumEl) sumEl.textContent = `₹${sum.toLocaleString('en-IN')}`;

    if (cardsEl) {
      cardsEl.innerHTML = stageContacts.map(c => `
        <div class="kanban-card" onclick="openCustomerDrawer('${c.id}')">
          <div class="k-deal-value">₹${(c.dealValue || 0).toLocaleString('en-IN')}</div>
          <div class="k-name">${escapeHtml(c.name)}</div>
          <div class="k-company">${escapeHtml(c.company || 'Individual')}</div>
          <div class="k-footer">
            <span class="font-mono text-emerald">+${escapeHtml(c.phone)}</span>
            <span class="badge-tag tag-${c.tags[0] || 'general'}">${c.tags[0] || 'lead'}</span>
          </div>
        </div>
      `).join('');
    }
  });
}

// ==============================================================
// 6. WHATSAPP 2-WAY INBOX
// ==============================================================
function setupInbox() {
  const searchInput = document.getElementById('inbox-search');
  const filterTabs = document.querySelectorAll('.inbox-filter-tab');
  const chatForm = document.getElementById('chat-send-form');
  const quickReplySelect = document.getElementById('quick-reply-select');

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const threads = document.querySelectorAll('.thread-item');
    threads.forEach(t => {
      const name = t.querySelector('.t-name').textContent.toLowerCase();
      t.style.display = name.includes(q) ? 'flex' : 'none';
    });
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      STATE.inboxFilter = tab.getAttribute('data-filter');
      renderInboxThreads();
    });
  });

  quickReplySelect?.addEventListener('change', (e) => {
    const val = e.target.value;
    const input = document.getElementById('chat-input-text');
    if (!val || !input) return;

    const templates = {
      demo_invite: 'Namaste! Here is the live demo link tailored for your business: https://shaktix.com/demos/clinic. Take a 60-second look!',
      pricing_breakdown: 'Our complete turn-key package starts at ₹15,000 including custom mobile design, domain, and 1-year free hosting with 50% advance to start.',
      follow_up_nudge: 'Hi there! Just checking in to see if you had any questions on the proposal we shared yesterday.',
      payment_link: 'You can complete your milestone advance via UPI here: shaktix@upi. Once paid, our engineering sprint begins immediately.'
    };

    if (templates[val]) {
      input.value = templates[val];
      input.focus();
    }
  });

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input-text');
    const isNote = document.getElementById('toggle-internal-note').checked;
    const text = input.value.trim();
    if (!text) return;

    const convo = STATE.conversations.find(c => c.contactId === STATE.activeChatContactId);
    if (convo) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      convo.messages.push({
        direction: isNote ? 'internal-note' : 'outbound',
        text: text,
        time: now,
        isNote: isNote
      });

      if (!isNote) {
        convo.isUnanswered = false;
      }

      saveState();
      renderActiveChat();
      renderInboxThreads();
      updateDashboardKpis();
      input.value = '';

      // If internal note, reset toggle
      if (isNote) {
        document.getElementById('toggle-internal-note').checked = false;
        showToast('Internal note posted in conversation!');
      } else {
        showToast('WhatsApp message dispatched!');
      }
    }
  });

  document.getElementById('btn-chat-view-profile')?.addEventListener('click', () => {
    openCustomerDrawer(STATE.activeChatContactId);
  });
}

function renderInboxThreads() {
  const container = document.getElementById('inbox-threads-list');
  if (!container) return;

  let threads = [...STATE.conversations];
  if (STATE.inboxFilter === 'unanswered') {
    threads = threads.filter(t => t.isUnanswered);
  } else if (STATE.inboxFilter === 'priority') {
    threads = threads.filter(t => t.priority === 'high');
  }

  container.innerHTML = threads.map(t => {
    const lastMsg = t.messages[t.messages.length - 1];
    const isActive = t.contactId === STATE.activeChatContactId;
    return `
      <div class="thread-item ${isActive ? 'active' : ''}" onclick="selectChatConversation('${t.contactId}')">
        <div class="t-avatar">${t.avatar}</div>
        <div class="t-info">
          <div class="t-header">
            <span class="t-name">${escapeHtml(t.name)}</span>
            <span class="t-time">${lastMsg ? lastMsg.time : ''}</span>
          </div>
          <div class="t-snippet">${lastMsg ? escapeHtml(lastMsg.text) : 'Start conversation...'}</div>
        </div>
      </div>
    `;
  }).join('');
}

window.selectChatConversation = function(contactId) {
  STATE.activeChatContactId = contactId;
  renderInboxThreads();
  renderActiveChat();
};

function renderActiveChat() {
  const convo = STATE.conversations.find(c => c.contactId === STATE.activeChatContactId);
  if (!convo) return;

  document.getElementById('active-chat-avatar').textContent = convo.avatar;
  document.getElementById('active-chat-name').textContent = convo.name;
  document.getElementById('active-chat-phone').innerHTML = `+${convo.phone} • <span class="text-emerald">Online</span>`;

  const stream = document.getElementById('chat-messages-container');
  stream.innerHTML = convo.messages.map(m => {
    const isInternal = m.direction === 'internal-note' || m.isNote;
    const rowClass = isInternal ? 'internal-note' : (m.direction === 'outbound' ? 'outbound' : 'inbound');

    return `
      <div class="msg-row ${rowClass}">
        <div class="msg-bubble">
          ${isInternal ? '<strong style="color:#f59e0b;"><i class="fa-solid fa-lock"></i> INTERNAL NOTE: </strong>' : ''}
          ${escapeHtml(m.text)}
        </div>
        <div class="msg-meta">
          <span>${m.time}</span>
          ${m.direction === 'outbound' ? '<i class="fa-solid fa-check-double text-blue"></i>' : ''}
        </div>
      </div>
    `;
  }).join('');

  stream.scrollTop = stream.scrollHeight;
}

// ==============================================================
// 7. TASKS & FOLLOW-UPS
// ==============================================================
function setupTasksModule() {
  const filterBtns = document.querySelectorAll('[data-task-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.taskFilter = btn.getAttribute('data-task-filter');
      renderTasks();
    });
  });

  document.getElementById('btn-add-new-task')?.addEventListener('click', () => {
    document.getElementById('modal-add-task').classList.add('active');
  });

  document.getElementById('btn-quick-add-task')?.addEventListener('click', () => {
    document.getElementById('modal-add-task').classList.add('active');
  });
}

function renderTasks() {
  const container = document.getElementById('tasks-full-container');
  if (!container) return;

  let tasks = [...STATE.tasks];
  if (STATE.taskFilter === 'due_today') {
    tasks = tasks.filter(t => t.status === 'pending');
  } else if (STATE.taskFilter === 'completed') {
    tasks = tasks.filter(t => t.status === 'completed');
  }

  const allCount = STATE.tasks.length;
  const todayCount = STATE.tasks.filter(t => t.status === 'pending').length;
  document.getElementById('count-tasks-all').textContent = allCount;
  document.getElementById('count-tasks-today').textContent = todayCount;

  if (tasks.length === 0) {
    container.innerHTML = `<p class="text-muted" style="padding:16px;">No follow-ups matching this filter.</p>`;
    return;
  }

  container.innerHTML = tasks.map(t => `
    <div class="task-quick-item ${t.status === 'completed' ? 'completed' : ''}">
      <input type="checkbox" ${t.status === 'completed' ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')">
      <div style="flex:1;">
        <div style="font-size:13.5px; font-weight:700;">${escapeHtml(t.title)}</div>
        <div style="font-size:11.5px; color:#94a3b8;">
          <i class="fa-solid fa-calendar"></i> Due: ${t.dueDate} • Assigned: ${escapeHtml(t.assignedTo)}
        </div>
      </div>
      <span class="badge-tag ${t.priority === 'high' ? 'badge-rose' : 'badge-gold'}">${t.priority.toUpperCase()}</span>
      <button class="btn btn-sm btn-outline text-rose" onclick="deleteTask('${t.id}')"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join('');
}

window.toggleTaskStatus = function(taskId) {
  const task = STATE.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    saveState();
    renderTasks();
    renderOverviewTables();
    updateDashboardKpis();
    showToast(task.status === 'completed' ? 'Task marked as completed! 🎉' : 'Task restored to pending.');
  }
};

window.deleteTask = function(taskId) {
  STATE.tasks = STATE.tasks.filter(t => t.id !== taskId);
  saveState();
  renderTasks();
  renderOverviewTables();
  updateDashboardKpis();
  showToast('Follow-up task removed.');
};

// ==============================================================
// 8. ORDERS & INVOICES
// ==============================================================
function renderOrders() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;

  tbody.innerHTML = STATE.orders.map(o => `
    <tr>
      <td class="font-mono text-emerald"><strong>${o.id}</strong></td>
      <td><strong>${escapeHtml(o.contactName)}</strong></td>
      <td>${escapeHtml(o.service)}</td>
      <td class="font-mono text-gold"><strong>₹${o.amount.toLocaleString('en-IN')}</strong></td>
      <td><span class="${o.paymentStatus === 'paid' ? 'badge-emerald' : 'badge-gold'}">${o.paymentStatus.toUpperCase()}</span></td>
      <td><span class="badge-tag">${o.fulfillmentStatus.toUpperCase()}</span></td>
      <td>${o.date}</td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="sendWhatsAppInvoiceReceipt('${o.id}')">
          <i class="fa-brands fa-whatsapp text-emerald"></i> Send Receipt
        </button>
      </td>
    </tr>
  `).join('');
}

window.sendWhatsAppInvoiceReceipt = function(orderId) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (order) {
    showToast(`WhatsApp receipt for ${order.id} (₹${order.amount.toLocaleString('en-IN')}) dispatched!`);
  }
};

// ==============================================================
// 9. WHATSAPP CAMPAIGN BUILDER & SIMULATOR
// ==============================================================
function setupCampaignBuilder() {
  const templateSelect = document.getElementById('campaign-template-select');
  const customOfferInput = document.getElementById('var-custom-offer');
  const throttleSlider = document.getElementById('throttle-slider');
  const throttleBadge = document.getElementById('throttle-value-badge');
  const campaignForm = document.getElementById('campaign-form');

  templateSelect?.addEventListener('change', updateLivePhonePreview);
  customOfferInput?.addEventListener('input', updateLivePhonePreview);

  throttleSlider?.addEventListener('input', (e) => {
    STATE.throttleSpeed = parseInt(e.target.value);
    throttleBadge.textContent = `${STATE.throttleSpeed} msgs/sec ${STATE.throttleSpeed <= 20 ? '(Recommended)' : '(High Rate)'}`;
  });

  campaignForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    launchCampaign();
  });
}

function updateLivePhonePreview() {
  const templateKey = document.getElementById('campaign-template-select')?.value || 'clinic_growth_pitch';
  const customOffer = document.getElementById('var-custom-offer')?.value || '';
  const template = TEMPLATES[templateKey] || TEMPLATES.clinic_growth_pitch;

  const headerEl = document.getElementById('preview-header');
  const bodyEl = document.getElementById('preview-body');
  const buttonsEl = document.getElementById('preview-buttons');

  if (headerEl) headerEl.innerHTML = `<span class="badge-tag">${template.header}</span>`;
  if (bodyEl) bodyEl.innerHTML = template.body('Dr. Rajiv Sharma', customOffer);

  if (buttonsEl) {
    buttonsEl.innerHTML = template.buttons.map(b => `
      <button class="wa-action-btn ${b.optOut ? 'opt-out-btn' : ''}" type="button">
        <i class="fa-solid ${b.icon}"></i> ${b.text}
      </button>
    `).join('');
  }
}

function launchCampaign() {
  const name = document.getElementById('campaign-name-input').value.trim();
  const targetTag = document.getElementById('campaign-target-tag').value;

  const audience = STATE.contacts.filter(c => {
    if (!c.optIn) return false;
    return targetTag === 'all' || c.tags.includes(targetTag);
  });

  if (audience.length === 0) {
    alert('No eligible opted-in contacts found for this audience segment!');
    return;
  }

  const progressBox = document.getElementById('campaign-progress-box');
  const progressBar = document.getElementById('progress-bar-fill');
  const progressPercent = document.getElementById('progress-percent');
  const sentCountEl = document.getElementById('progress-sent-count');
  const deliveredCountEl = document.getElementById('progress-delivered-count');
  const failedCountEl = document.getElementById('progress-failed-count');
  const statusText = document.getElementById('progress-status-text');
  const startBtn = document.getElementById('btn-start-dispatch');

  progressBox.style.display = 'block';
  startBtn.disabled = true;
  startBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Batch...`;

  let sent = 0;
  let delivered = 0;
  let failed = 0;
  let index = 0;

  const intervalMs = Math.max(100, Math.floor(1000 / STATE.throttleSpeed));

  const interval = setInterval(() => {
    if (index >= audience.length) {
      clearInterval(interval);
      statusText.innerHTML = `✅ Campaign dispatched successfully!`;
      startBtn.disabled = false;
      startBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Launch WhatsApp Campaign Now`;
      showToast(`Campaign "${name}" delivered to ${delivered} recipients!`);
      return;
    }

    sent++;
    if (Math.random() > 0.05) delivered++; else failed++;

    index++;
    const pct = Math.round((index / audience.length) * 100);
    progressBar.style.width = `${pct}%`;
    progressPercent.textContent = `${pct}%`;
    sentCountEl.textContent = sent;
    deliveredCountEl.textContent = delivered;
    failedCountEl.textContent = failed;
  }, intervalMs);
}

function renderTemplatesGrid() {
  const grid = document.getElementById('templates-cards-grid');
  if (!grid) return;

  grid.innerHTML = Object.keys(TEMPLATES).map(key => {
    const t = TEMPLATES[key];
    return `
      <div class="template-card">
        <span class="badge-emerald" style="align-self:flex-start;">APPROVED</span>
        <h4>${t.name}</h4>
        <p class="template-snippet">${t.header}</p>
        <div style="font-size:11px; color:#94a3b8; display:flex; justify-content:space-between; margin-top:8px;">
          <span>${t.buttons.length} Buttons</span>
          <span class="text-emerald">Meta Verified</span>
        </div>
      </div>
    `;
  }).join('');
}

// ==============================================================
// 10. MODALS & FORMS CONTROLLER
// ==============================================================
function setupModals() {
  // Add Contact Modal
  const addModal = document.getElementById('modal-add-contact');
  document.getElementById('modal-close-contact')?.addEventListener('click', () => addModal.classList.remove('active'));
  document.getElementById('btn-cancel-contact')?.addEventListener('click', () => addModal.classList.remove('active'));

  document.getElementById('form-new-contact')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-contact-name').value.trim();
    let phone = document.getElementById('new-contact-phone').value.trim().replace(/\D/g, '');
    const email = document.getElementById('new-contact-email').value.trim();
    const company = document.getElementById('new-contact-business').value.trim();
    const city = document.getElementById('new-contact-city').value.trim();
    const dealValue = parseInt(document.getElementById('new-contact-deal').value) || 25000;
    const tag = document.getElementById('new-contact-tag').value;
    const stage = document.getElementById('new-contact-stage').value;
    const source = document.getElementById('new-contact-source').value;
    const agent = document.getElementById('new-contact-agent').value;

    if (phone.length === 10) phone = '91' + phone;

    const newContact = {
      id: 'c_' + Date.now(),
      name,
      phone,
      email,
      company,
      city,
      stage,
      dealValue,
      source,
      assignedTo: agent,
      tags: [tag],
      optIn: true,
      timeline: [
        { title: 'Contact Created in CRM', desc: `Captured through ${source}`, time: 'Just now', type: 'contact_created' }
      ],
      notes: [],
      orders: []
    };

    STATE.contacts.unshift(newContact);

    // Also create conversation in Inbox
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    STATE.conversations.unshift({
      contactId: newContact.id,
      phone: phone,
      name: name,
      avatar: initials,
      unread: 0,
      isUnanswered: false,
      priority: 'medium',
      messages: [
        { direction: 'outbound', text: `Namaste ${name} ji! Greetings from SHAKTIX Web Studio.`, time: 'Just now' }
      ]
    });

    saveState();
    renderAll();
    addModal.classList.remove('active');
    document.getElementById('form-new-contact').reset();

    // Sync to Supabase Cloud Database
    if (window.SHAKTIX_SUPABASE && typeof window.SHAKTIX_SUPABASE.saveLead === 'function') {
      window.SHAKTIX_SUPABASE.saveLead({
        name: name,
        phone: phone,
        category: tag || 'General',
        notes: `${company || 'Lead'} • Deal: Rs ${dealValue} • Stage: ${stage}`,
        source: `CRM (${source})`
      });
    }

    showToast(`Lead ${name} saved to CRM & Supabase Cloud!`);
  });

  // CSV Import Modal
  const importModal = document.getElementById('modal-import-csv');
  document.getElementById('modal-close-import')?.addEventListener('click', () => importModal.classList.remove('active'));
  document.getElementById('btn-cancel-import')?.addEventListener('click', () => importModal.classList.remove('active'));

  document.getElementById('btn-load-sample-csv')?.addEventListener('click', () => {
    const sampleLeads = [
      { name: 'Dr. Priya Desai', phone: '919820011223', business: 'Desai Skin Clinic', city: 'Pune', tag: 'clinic', deal: 30000 },
      { name: 'Karan Mehra', phone: '919830022334', business: 'CrossFit Pulse', city: 'Bangalore', tag: 'gym', deal: 25000 },
      { name: 'Chef Manish', phone: '919840033445', business: 'The Urban Bistro', city: 'Delhi', tag: 'restaurant', deal: 40000 },
      { name: 'Prof. Alok Varma', phone: '919850044556', business: 'Varma Physics Academy', city: 'Kota', tag: 'institute', deal: 50000 },
      { name: 'Rajesh Aggarwal', phone: '919860055667', business: 'Aggarwal Legal', city: 'Noida', tag: 'corporate', deal: 35000 }
    ];
    stageImportRecords(sampleLeads);
  });

  document.getElementById('btn-confirm-import')?.addEventListener('click', () => {
    if (STATE.stagedCsv.length === 0) return;
    STATE.stagedCsv.forEach(item => {
      let phone = item.phone.toString().replace(/\D/g, '');
      if (phone.length === 10) phone = '91' + phone;

      STATE.contacts.push({
        id: 'c_' + Math.random().toString(36).substr(2, 9),
        name: item.name || 'Valued Lead',
        phone: phone,
        company: item.business || '',
        city: item.city || '',
        stage: 'new_lead',
        dealValue: item.deal || 25000,
        source: 'csv_import',
        assignedTo: 'Shubham (CSO)',
        tags: [item.tag || 'imported'],
        optIn: true,
        timeline: [
          { title: 'Imported via CSV', desc: 'Batch imported into SHAKTIX CRM', time: 'Just now', type: 'contact_created' }
        ],
        notes: [],
        orders: []
      });
    });

    saveState();
    renderAll();
    importModal.classList.remove('active');
    showToast(`Successfully imported ${STATE.stagedCsv.length} verified leads!`);
    STATE.stagedCsv = [];
  });

  // Add Task Modal
  const taskModal = document.getElementById('modal-add-task');
  document.getElementById('modal-close-task')?.addEventListener('click', () => taskModal.classList.remove('active'));
  document.getElementById('btn-cancel-task')?.addEventListener('click', () => taskModal.classList.remove('active'));

  // Populate contact dropdown in task modal
  const taskContactSelect = document.getElementById('task-contact-select');
  if (taskContactSelect) {
    taskContactSelect.innerHTML = STATE.contacts.map(c => `<option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.company || c.phone)})</option>`).join('');
  }

  document.getElementById('form-new-task')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title-input').value.trim();
    const contactId = document.getElementById('task-contact-select').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority-select').value;
    const assignee = document.getElementById('task-assignee').value;

    const newTask = {
      id: 't_' + Date.now(),
      contactId: contactId,
      title: title,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority: priority,
      status: 'pending',
      assignedTo: assignee
    };

    STATE.tasks.unshift(newTask);
    saveState();
    renderTasks();
    renderOverviewTables();
    updateDashboardKpis();
    taskModal.classList.remove('active');
    document.getElementById('form-new-task').reset();
    showToast('Follow-up task scheduled!');
  });
}

function stageImportRecords(records) {
  STATE.stagedCsv = records;
  const container = document.getElementById('import-preview-container');
  const countEl = document.getElementById('parsed-count');
  const tbody = document.querySelector('#import-preview-table tbody');
  const confirmBtn = document.getElementById('btn-confirm-import');

  container.style.display = 'block';
  countEl.textContent = records.length;
  confirmBtn.disabled = false;

  tbody.innerHTML = records.map(r => `
    <tr>
      <td><strong>${escapeHtml(r.name)}</strong></td>
      <td class="font-mono text-emerald">+${escapeHtml(r.phone)}</td>
      <td>${escapeHtml(r.business)}</td>
      <td><span class="badge-tag tag-${r.tag}">${r.tag}</span></td>
    </tr>
  `).join('');
}

// ==============================================================
// UTILITIES
// ==============================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-check-circle text-emerald"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
