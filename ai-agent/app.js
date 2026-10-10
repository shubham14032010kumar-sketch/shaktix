/**
 * SHAKTIX AI Sales Desk — Core Engine
 * Powered by Antigravity AI CSO Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const toast = document.getElementById('app-toast');
  const toastMsg = document.getElementById('toast-msg');

  // --- 1. TAB SWITCHING SYSTEM ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });

  // Toast Trigger Helper
  function showToast(message = 'Copied to clipboard!') {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --- 2. PITCH GENERATOR ENGINE ---
  const pitchForm = document.getElementById('pitch-form');
  const pitchOutput = document.getElementById('pitch-output');
  const btnCopyPitch = document.getElementById('btn-copy-pitch');
  const btnSendWhatsApp = document.getElementById('btn-send-whatsapp');
  const pitchInsightsList = document.getElementById('pitch-insights-list');

  const demoLinks = {
    clinic: 'https://shaktix.com/demos/clinic (CarePoint Multispeciality Clinic)',
    gym: 'https://shaktix.com/demos/gym (IronFit Elite Fitness Arena)',
    corporate: 'https://shaktix.com/demos/corporate (Nexus Enterprise Studio)',
    restaurant: 'https://shaktix.com/demos/restaurant (Bella Vista Bistro & Cafe)',
    coaching: 'https://shaktix.com/demos/corporate (Pinnacle Learning Hub)',
    salon: 'https://shaktix.com/demos/clinic (Glow & Grace Luxury Spa)',
    realestate: 'https://shaktix.com/demos/corporate (Skyline Estates)',
    ecommerce: 'https://shaktix.com/demos/corporate (UrbanStore Direct)'
  };

  const gapDescriptions = {
    'no-website': {
      hinglish: 'Google Maps par aapka official dedicated website missing hai, jisse roz 10-15 high-intent clients bina contact kiye competitors ke paas chale jaate hain.',
      hindi: 'Google Maps par aapki official website uplabdh nahi hai, jisse bohot se naye grahak seedha sampark nahi kar pate.',
      english: 'your Google Maps profile lacks a dedicated modern website, leading to significant drop-offs in direct inquiries.'
    },
    'no-booking': {
      hinglish: 'Aapki current site par direct 1-Click WhatsApp appointment booking nahi hai. Customers ko number copy-paste karna padta hai jisse 40% leads drop ho jaati hain.',
      hindi: 'Aapki website par 1-Click direct WhatsApp appointment suvidha nahi hai, jisse grahako ko asuvidha hoti hai.',
      english: 'your current site has no 1-click WhatsApp instant booking, forcing visitors to manually dial numbers.'
    },
    'slow-outdated': {
      hinglish: 'Aapki website mobile par load hone me 5+ seconds leti hai aur layout mobile screen par cut ho raha hai.',
      hindi: 'Aapki purani website mobile devices par dheemi load hoti hai.',
      english: 'your existing site takes over 4 seconds to load on mobile and lacks a modern responsive UX.'
    },
    'only-justdial': {
      hinglish: 'Aap sirf JustDial/IndiaMart par dependent hain jahan ek hi lead 5 competitors ko bech di jaati hai.',
      hindi: 'JustDial/third-party portals par dependent hone se har lead competitors ke paas bhi chali jaati hai.',
      english: 'relying on third-party portals splits your inquiries with multiple competitors.'
    },
    'only-instagram': {
      hinglish: 'Aap sirf Instagram par active hain, lekin jo log Google par "Best near me" search karte hain wo direct website dekhte hain.',
      hindi: 'Instagram ke alawa Google search par aane wale 70% naye grahak direct website khojte hain.',
      english: 'social media covers followers, but 70% of high-intent local buyers search on Google directly.'
    }
  };

  function generatePitchMessage(data) {
    const { business, owner, phone, niche, tone, gap, location } = data;
    const greetingName = owner ? `${owner} ji` : `${business} Team`;
    const demo = demoLinks[niche] || demoLinks.corporate;
    const gapText = gapDescriptions[gap][tone] || gapDescriptions[gap]['hinglish'];
    const locSnippet = location ? ` me aapka ${business}` : ` ${business}`;

    let message = '';

    if (tone === 'hinglish') {
      message = 
`Namaste ${greetingName}! 🙏

Main Shubham, Founder at *SHAKTIX Web Studio*.

Maine Google par notice kiya ki${locSnippet} kaafi popular hai aur ratings bohot achhi hain! 🌟

Lekin ek critical digital gap notice kiya:
⚠️ *${gapText}*

Humne aapke business ke liye ek ultra-fast live demo template design kiya hai:
👉 *Live Demo:* ${demo}

⚡ *Key Highlights:*
• 1-Click Direct WhatsApp Booking (Zero waiting time).
• Google Maps & Directions 1-Click access.
• Ultra-fast mobile speed (loads in <1 sec).
• 1 Year Free Cloud Hosting & Security included.

Agar aapko ye design pasand aaye, toh hum *48 hours* me aapke naam aur details ke sath ready kar sakte hain.

Kya main aaj shaam 2 minute ka quick call ya details share kar sakta hoon? 🙏

— *SHAKTIX Web Studio*
WhatsApp: +91 8298136441`;
    } else if (tone === 'hindi') {
      message = 
`सादर नमस्ते ${greetingName}! 🙏

Main Shubham, Founder at *SHAKTIX Web Studio*.

Maine dekha ki${locSnippet} ki Google par pratishtha bohot achhi hai.

Lekin humne notice kiya ki:
⚠️ *${gapText}*

Humne aapke business ke liye ek ultra-modern digital website demo design kiya hai:
👉 *Live Demo Link:* ${demo}

🌟 *Is Website Ki Khas Baatein:*
• Grahak bina kisi deri ke 1-Click WhatsApp se appointment book kar sakte hain.
• Google Maps location aur sabhi services ka clear showcase.
• 1 Saal ki muft Cloud Hosting aur maintenance sahayata.

Agar aapko ye template pasand aata hai, toh hum ise 48 ghante me live kar sakte hain.

Kya main aapse is vishay par 2 minute baat kar sakta hoon? 🙏

— *SHAKTIX Web Studio*`;
    } else {
      // English
      message = 
`Hello ${owner || business} Team! 👋

I'm Shubham, Founder at *SHAKTIX Web Studio*.

I recently came across ${business}${location ? ' in ' + location : ''} and was impressed by your stellar customer reputation!

While reviewing your digital footprint, I noticed an immediate growth opportunity:
⚠️ *${gapText}*

To show how you can capture 3x more direct client inquiries, we crafted a live demonstration:
👉 *Live Preview:* ${demo}

Key Advantages:
✓ 1-Click Instant WhatsApp Inquiry & Appointment Booking.
✓ Blazing fast mobile performance (<1.2s load time).
✓ 1-Year Managed Cloud Hosting & Free SSL Security.

We can customize and launch this tailored to ${business} within 48 hours.

Would you be open to a 2-minute quick walkthrough today?

Warm regards,
*SHAKTIX Web Studio*
Direct WhatsApp: +91 8298136441`;
    }

    return message;
  }

  // Handle Form Submit
  pitchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      business: document.getElementById('prospect-business').value.trim(),
      owner: document.getElementById('prospect-owner').value.trim(),
      phone: document.getElementById('prospect-phone').value.trim().replace(/[^0-9]/g, ''),
      niche: document.getElementById('prospect-niche').value,
      tone: document.getElementById('pitch-tone').value,
      gap: document.getElementById('digital-gap').value,
      location: document.getElementById('city-location').value.trim()
    };

    const message = generatePitchMessage(formData);
    pitchOutput.textContent = message;

    // Update WhatsApp Direct Link
    const cleanPhone = formData.phone || '918298136441';
    const encodedMsg = encodeURIComponent(message);
    btnSendWhatsApp.href = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    // Update Insights
    pitchInsightsList.innerHTML = `
      <li><strong>Target Niche:</strong> ${formData.niche.toUpperCase()} Template applied.</li>
      <li><strong>Hook Used:</strong> Reputation validation + Gap recognition.</li>
      <li><strong>Direct WhatsApp:</strong> Configured for ${cleanPhone}.</li>
      <li><strong>Conversion Angle:</strong> Low friction 48-hr launch + Free Hosting.</li>
    `;

    // Also update Follow-up Tab pre-fills
    updateFollowUpPlaceholders(formData);

    showToast('✨ AI Pitch Generated Successfully!');
  });

  // Copy Pitch
  btnCopyPitch.addEventListener('click', () => {
    const text = pitchOutput.textContent;
    if (!text || text.includes('Fill out the prospect details')) {
      showToast('⚠️ Please generate a pitch first!');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Pitch copied to clipboard!');
    });
  });

  // --- 3. OBJECTION CRUSHER ENGINE ---
  const objectionData = {
    expensive: {
      psychTitle: "Uncertainty of Return on Investment (ROI)",
      psychDesc: "The client isn't really broke; they just haven't seen how the website will physically bring them back their money. Reframe the cost into daily micro-investments or single-client value.",
      script: `"Sir, totally understand! Lekin ek baar calculate kijiye:

Agar is website se pure saal me sirf 2 se 3 naye clients ya patients bhi aa gaye, toh aapka poora ₹8,000-₹10,000 ka cost pehle hi mahine recover ho jayega.

Baaki agle 11 mahine ka saara revenue aapka pure profit hai. Aur hum aapko 50% advance ke baad hi start karte hain — baaki 50% tabhi dena hai jab aap fully satisfied hon."`
    },
    instagram: {
      psychTitle: "Illusion of Social Media Audience Ownership",
      psychDesc: "They think Instagram followers equal paying customers. Reframe by highlighting high-intent Google searchers vs passive scrollers.",
      script: `"Sir, Instagram un logo ke liye achha hai jo already aapke fans hain ya scroll kar rahe hain.

Lekin jo vyakti Google par search karta hai: 'Best Doctor / Best Gym / Best Cafe near me' — wo vyakti turant khareedne ke mood me hota hai.

Agar Google searcher ko aapki professional website nahi milti jahan 1-click WhatsApp booking ho, toh wo competitor ke paas chala jata hai. Website aapko wo 70% Google traffic deti hai jo Instagram kabhi nahi de sakta."`
    },
    later: {
      psychTitle: "Low Priority / Procrastination Trap",
      psychDesc: "They want to delay because there's no perceived urgency. Create geographic scarcity and exclusive launch incentives.",
      script: `"Bilkul sir, no problem! Bas ek chhota update dena tha:

Hum har area me kisi ek hi business ko hamara 'Showcase Partner' banate hain jisko hum ₹2,500 ki Google Map SEO aur Speed Optimization bilkul FREE dete hain.

Agar aap chahein toh main aapke area ka showcase discount slot kal shaam tak hold rakh sakta hoon. Kya main kal 4 baje quick call karoon?"`
    },
    relative: {
      psychTitle: "Cheap Alternative Trap (Amateur vs Revenue-Generating)",
      psychDesc: "A student or cousin can write code, but they don't understand sales copywriting, mobile speed optimization, or ongoing support.",
      script: `"Bohot badhiya sir! Par ek cheez dhyaan me rakhiyega:

Website sirf dekhne ke liye nahi, balki grahak laane ke liye hoti hai. Relative ya student shayad basic page bana de, par agar site 4 second slow hui, Google pe rank nahi hui, ya WhatsApp lead capture fail hua, toh aapka business loss hoga.

Hum professionals hain — 48 hours me delivery, guaranteed 99.9% uptime aur 1 saal ka dedicated maintenance support dete hain."`
    },
    nowebsite: {
      psychTitle: "Status Quo Bias (We've always done it this way)",
      psychDesc: "They survive on word-of-mouth and don't realize how much new generation business they are invisibly losing.",
      script: `"Sir, aapka brand offline bohot strong hai, isme koi shaq nahi!

Lekin aaj kal 20 se 40 saal ka har naya customer pehle phone par Google reviews aur photo/menu/charges check karta hai. Agar digital presence solid na ho, toh naye customers bina aapko bataye dusri jagah chale jaate hain.

Website aapke purane grahako ke liye nahi, balki un 100 naye customers ke liye hai jo aapke area me naye shift huye hain."`
    },
    trust: {
      psychTitle: "Fear of Online Scams & Incompetence",
      psychDesc: "They've been burned by freelancers who took money and disappeared. Reassure them with formal contracts and progressive milestones.",
      script: `"Aapka darr bilkul sahi hai sir, market me kaafi freelancers gayab ho jaate hain.

Isiliye SHAKTIX ka policy bohot transparent hai:
1. Hum pehle sirf nominal 50% advance lete hain aur GST/formal invoice provide karte hain.
2. 48 ghante ke andar hum aapke business ka live preview link bhejte hain.
3. Jab tak aap 100% bol nahi dete ki 'Haan, website perfect hai', tab tak aapko final 50% payment nahi karni hoti. Zero risk to you."`
    }
  };

  const objButtons = document.querySelectorAll('.obj-btn');
  const objPsychTitle = document.getElementById('obj-psych-title');
  const objPsychDesc = document.getElementById('obj-psych-desc');
  const objScriptBody = document.getElementById('obj-script-body');
  const btnCopyObj = document.getElementById('btn-copy-obj');

  function renderObjection(key) {
    const data = objectionData[key];
    if (!data) return;

    objPsychTitle.textContent = data.psychTitle;
    objPsychDesc.textContent = data.psychDesc;
    objScriptBody.textContent = data.script;
  }

  // Initialize first objection
  renderObjection('expensive');

  objButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      objButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const objKey = btn.getAttribute('data-obj');
      renderObjection(objKey);
    });
  });

  btnCopyObj.addEventListener('click', () => {
    const text = objScriptBody.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast('🛡️ Counter-script copied!');
    });
  });

  // --- 4. FOLLOW-UP CADENCE HELPERS ---
  function updateFollowUpPlaceholders(data) {
    const name = data.owner || data.business || '[Client Name]';
    const biz = data.business || '[Business Name]';
    const nicheText = data.niche || 'Clinic/Gym';

    const s1 = document.getElementById('fu-step-1');
    if (s1) {
      s1.textContent = `"Namaste ${name} ji! 🙏 Bas check karna tha ki kya aapko kal bheja gaya ${nicheText} demo link dekhne ka time mila? Agar koi bhi question ho design ya 1-click WhatsApp booking feature ke baare me, toh main live share kar sakta hoon."`;
    }

    const s2 = document.getElementById('fu-step-2');
    if (s2) {
      s2.textContent = `"Hey ${name}! 👋 Quick update: Humne is demo me ek special feature add kiya hai — jab bhi koi customer 'Book Now' par click karega, unka phone seedha aapke WhatsApp par pre-typed enquiry bhej dega. Isse inquiries 3x badh jaati hain. Kya main aapke liye iska 2-minute live demo share karoon?"`;
    }

    const s3 = document.getElementById('fu-step-3');
    if (s3) {
      s3.textContent = `"Namaste ${name} ji! 🙏 Hum is mahine aapke area me sirf 2 selected businesses ko hamare 'Growth Partner Program' me onboard kar rahe hain, jisme ₹2,500 ki Google Map SEO & Speed Optimization bilkul FREE included hai. Kya hum aaj sham 10 min ka quick call plan kar sakte hain?"`;
    }

    const s4 = document.getElementById('fu-step-4');
    if (s4) {
      s4.textContent = `"Namaste ${name} ji! 🙏 Lagta hai ki abhi aapke business ke liye new website top priority nahi hai, totally understand! Main aage se messages bhej kar aapka time waste nahi karunga. Agar future me kabhi bhi Google par leads badhani ho, toh mera number save rakh sakte hain. Wishing ${biz} huge success! 🚀"`;
    }
  }

  // Copy buttons on follow-up timeline
  document.querySelectorAll('.copy-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const el = document.getElementById(targetId);
      if (el) {
        navigator.clipboard.writeText(el.textContent).then(() => {
          showToast('📋 Follow-up message copied!');
        });
      }
    });
  });

  // --- 5. INSTANT PROPOSAL BUILDER ---
  const checkboxes = [
    { id: 'pkg-landing', name: 'Ultra-Fast Responsive Business Website', price: 4999 },
    { id: 'pkg-whatsapp', name: '1-Click Direct WhatsApp Booking Engine', price: 1500 },
    { id: 'pkg-hosting', name: '1 Year Managed Cloud Hosting & Free SSL Security', price: 2000 },
    { id: 'pkg-seo', name: 'Google Maps Profile & Search Console SEO Setup', price: 2500 },
    { id: 'pkg-customdomain', name: 'Custom Domain (.com / .in) 1-Year Registration', price: 1000 },
    { id: 'pkg-maintenance', name: 'Annual Maintenance & Content Changes Support', price: 3000 }
  ];

  const totalPriceDisplay = document.getElementById('total-price-display');
  const proposalOutputText = document.getElementById('proposal-output-text');
  const btnCopyProposal = document.getElementById('btn-copy-proposal');

  function calculateAndRenderProposal() {
    let total = 0;
    const selectedFeatures = [];

    checkboxes.forEach(item => {
      const checkboxEl = document.getElementById(item.id);
      if (checkboxEl && checkboxEl.checked) {
        total += item.price;
        selectedFeatures.push(`✓ ${item.name} (₹${item.price.toLocaleString('en-IN')})`);
      }
    });

    totalPriceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;

    const bizName = document.getElementById('prospect-business').value.trim() || 'Aapke Business';
    const advanceAmount = Math.round(total / 2);
    const balanceAmount = total - advanceAmount;

    const proposalBody = 
`📄 *SHAKTIX OFFICIAL PROPOSAL & QUOTATION*
----------------------------------------
*Client:* ${bizName}
*Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
*Delivery Timeline:* 48 to 72 Hours

*DELIVERABLES & SCOPE:*
${selectedFeatures.join('\n')}

----------------------------------------
💰 *TOTAL INVESTMENT:* ₹${total.toLocaleString('en-IN')} (One-Time)
💳 *PAYMENT MILESTONES:*
• 50% Advance (To initiate design & server setup): ₹${advanceAmount.toLocaleString('en-IN')}
• 50% Remaining (Only after full satisfaction & live approval): ₹${balanceAmount.toLocaleString('en-IN')}

🛡️ *SHAKTIX GUARANTEE:*
• 99.9% Uptime Guarantee
• Zero hidden server charges for 1 Full Year
• 100% Satisfaction or full revision guarantee

Toh kya hum aaj se work start karein sir? 🙏

— *Team SHAKTIX Web Studio*
Phone/WhatsApp: +91 8298136441`;

    proposalOutputText.textContent = proposalBody;
  }

  checkboxes.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      el.addEventListener('change', calculateAndRenderProposal);
    }
  });

  btnCopyProposal.addEventListener('click', () => {
    navigator.clipboard.writeText(proposalOutputText.textContent).then(() => {
      showToast('📋 Proposal quotation copied!');
    });
  });

  // Initial render of proposal
  calculateAndRenderProposal();
});
