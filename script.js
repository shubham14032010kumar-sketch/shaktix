/**
 * SHAKTIX Digital Studio — Interactive Engine & Client Conversion System
 * Handles calculator logic, interactive demo previews, lead dispatch to WhatsApp, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config: CEO WhatsApp number
  const CEO_WHATSAPP_NUMBER = '918298136441';

  /* -------------------------------------------------------------------------
   * 1. Navbar Sticky & Mobile Menu Toggle
   * ------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
   * 2. Counter Animation for Trust Metrics
   * ------------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  let countersTriggered = false;

  const startCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 1500;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
          clearInterval(timer);
        } else {
          counter.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersTriggered) {
        countersTriggered = true;
        startCounters();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }

  /* -------------------------------------------------------------------------
   * 3. Portfolio Category Filtering
   * ------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
   * 4. Interactive Cost Estimator Calculator
   * ------------------------------------------------------------------------- */
  const typeBtns = document.querySelectorAll('#site-type-options .opt-btn');
  const featureChecks = document.querySelectorAll('.feature-check');
  const totalDisplay = document.getElementById('calculated-total');
  const claimEstimateBtn = document.getElementById('claim-estimate-btn');

  let baseCost = 5999;
  let selectedTypeName = '1-Page Express';

  const calculateTotal = () => {
    let total = baseCost;
    const selectedFeatures = [];

    featureChecks.forEach(check => {
      if (check.checked) {
        total += parseInt(check.value, 10);
        selectedFeatures.push(check.getAttribute('data-name'));
      }
    });

    if (totalDisplay) {
      totalDisplay.textContent = total.toLocaleString('en-IN');
    }

    // Update WhatsApp link on estimate button
    if (claimEstimateBtn) {
      const featureListText = selectedFeatures.length > 0 
        ? selectedFeatures.join(', ') 
        : 'Standard inclusions';
      
      const message = `Namaste SHAKTIX Team! I used your Website Cost Estimator.\n\n` +
        `📦 Plan: ${selectedTypeName}\n` +
        `⚡ Features: ${featureListText}\n` +
        `💰 Estimated Investment: ₹${total.toLocaleString('en-IN')}\n\n` +
        `I would like to discuss and book this package for my business.`;

      claimEstimateBtn.onclick = (e) => {
        e.preventDefault();
        window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        showToast('Redirecting to WhatsApp to lock your quote! 🚀');
      };
    }
  };

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      baseCost = parseInt(btn.getAttribute('data-cost'), 10);
      selectedTypeName = btn.getAttribute('data-val');
      calculateTotal();
    });
  });

  featureChecks.forEach(check => {
    check.addEventListener('change', calculateTotal);
  });

  // Initial calculation run
  calculateTotal();

  /* -------------------------------------------------------------------------
   * 5. Interactive Demo Preview Modal
   * ------------------------------------------------------------------------- */
  const demoModal = document.getElementById('demo-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge-type');
  const modalContent = document.getElementById('modal-content');
  const modalPriceTag = document.getElementById('modal-price-tag');
  const modalOrderBtn = document.getElementById('modal-order-btn');

  // Rich Demo Content Templates
  const demoData = {
    clinic: {
      title: 'CarePoint Multispeciality Clinic Demo',
      badge: 'DOCTOR / HEALTHCARE',
      price: 'Starting at ₹6,999 (Express) or ₹12,999 (Full)',
      url: 'demos/clinic/index.html',
      html: `
        <div class="demo-preview-card">
          <p style="color:#00d2ff; font-weight:700; margin-bottom:0.5rem;"><i class="fa-solid fa-stethoscope"></i> High-Converting Patient Acquisition Engine</p>
          <p style="font-size:0.92rem; color:#94a3b8;">
            Clinics lose over 60% of potential patients because of slow websites and difficult appointment systems. This template is designed for single-click appointment bookings directly on WhatsApp.
          </p>
          
          <div class="demo-feature-pills">
            <span><i class="fa-solid fa-check"></i> WhatsApp Direct Booking</span>
            <span><i class="fa-solid fa-check"></i> Doctor Profiles & OPD Timings</span>
            <span><i class="fa-solid fa-check"></i> Google Maps 1-Click Directions</span>
            <span><i class="fa-solid fa-check"></i> Patient Testimonial Sliders</span>
            <span><i class="fa-solid fa-check"></i> Free SSL & Medical Compliance</span>
          </div>

          <div class="demo-simulator">
            <div class="simulator-header">
              <i class="fa-solid fa-calendar-check"></i> Try Patient Booking Simulator:
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; margin-bottom:0.8rem;">
              <input type="text" id="sim-patient-name" placeholder="Patient Name" style="padding:0.6rem; background:#101726; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff;">
              <select id="sim-department" style="padding:0.6rem; background:#101726; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff;">
                <option value="General Physician">General Physician</option>
                <option value="Dentistry & Oral">Dentistry & Orthodontics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology & Skin">Dermatology & Skin</option>
              </select>
            </div>
            <button id="sim-book-test" class="btn btn-sm btn-glass" style="width:100%; justify-content:center;">
              <i class="fa-brands fa-whatsapp"></i> Test Patient WhatsApp Alert
            </button>
          </div>
        </div>
      `,
      waText: 'Hello SHAKTIX, I am interested in building a Clinic/Doctor website like CarePoint Clinic.'
    },
    gym: {
      title: 'IronPulse Elite Fitness Studio Demo',
      badge: 'GYM & CROSSFIT',
      price: 'Starting at ₹7,999 (Express) or ₹14,999 (Full)',
      url: 'demos/gym/index.html',
      html: `
        <div class="demo-preview-card">
          <p style="color:#ff5722; font-weight:700; margin-bottom:0.5rem;"><i class="fa-solid fa-dumbbell"></i> High-Energy Member Conversion Layout</p>
          <p style="font-size:0.92rem; color:#94a3b8;">
            Turn everyday gym-goers into paid monthly and yearly members. Includes eye-catching pricing tables, trainer bio cards, and instant Free Day-Pass lead generation.
          </p>

          <div class="demo-feature-pills">
            <span><i class="fa-solid fa-check"></i> Free 1-Day Trial Pass Form</span>
            <span><i class="fa-solid fa-check"></i> Membership Tier Matrix (Monthly / Quarterly / Annual)</span>
            <span><i class="fa-solid fa-check"></i> Instagram Feed Integration</span>
            <span><i class="fa-solid fa-check"></i> Transformation Stories Showcase</span>
            <span><i class="fa-solid fa-check"></i> Fast Video Background Header</span>
          </div>

          <div class="demo-simulator">
            <div class="simulator-header">
              <i class="fa-solid fa-bolt"></i> Live Free Pass Claim Simulator:
            </div>
            <div style="display:flex; gap:0.8rem; margin-bottom:0.8rem;">
              <input type="tel" id="sim-gym-phone" placeholder="Enter Mobile for Trial Pass" style="flex:1; padding:0.6rem; background:#101726; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff;">
              <button id="sim-gym-test" class="btn btn-sm btn-primary">Claim Pass</button>
            </div>
            <p style="font-size:0.75rem; color:#64748b;">Instant SMS/WhatsApp notification delivered to the Gym Owner dashboard.</p>
          </div>
        </div>
      `,
      waText: 'Hello SHAKTIX, I want a gym/fitness website like the IronPulse Demo.'
    },
    corporate: {
      title: 'Aura Prime Realty & Consultants Demo',
      badge: 'REAL ESTATE / CORPORATE',
      price: 'Starting at ₹12,999 (Complete Multi-Page)',
      url: 'demos/corporate/index.html',
      html: `
        <div class="demo-preview-card">
          <p style="color:#a855f7; font-weight:700; margin-bottom:0.5rem;"><i class="fa-solid fa-building"></i> Authority & Luxury Trust Architect</p>
          <p style="font-size:0.92rem; color:#94a3b8;">
            High-ticket clients demand trust, speed, and clean corporate aesthetics. Built for Real Estate developers, Architects, CA firms, and Corporate Agencies.
          </p>

          <div class="demo-feature-pills">
            <span><i class="fa-solid fa-check"></i> Property & Portfolio Showcase Grid</span>
            <span><i class="fa-solid fa-check"></i> Download Brochure in 1-Click</span>
            <span><i class="fa-solid fa-check"></i> Virtual Video Tour Player</span>
            <span><i class="fa-solid fa-check"></i> Lead Capture with WhatsApp notification</span>
            <span><i class="fa-solid fa-check"></i> Corporate Domain & Custom Business Mail</span>
          </div>

          <div class="demo-simulator">
            <div class="simulator-header">
              <i class="fa-solid fa-file-pdf"></i> Brochure Download Trigger Test:
            </div>
            <button id="sim-corp-test" class="btn btn-sm btn-outline" style="width:100%; justify-content:center;">
              <i class="fa-solid fa-download"></i> Simulate Instant Property Brochure Download
            </button>
          </div>
        </div>
      `,
      waText: 'Hello SHAKTIX, I need a corporate/real estate website like Aura Prime Realty.'
    }
  };

  const openDemoModal = (demoKey) => {
    const data = demoData[demoKey];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalPriceTag.innerHTML = `${data.price} &bull; <a href="${data.url}" target="_blank" style="color:#00d2ff; text-decoration:underline; font-size:0.9rem; margin-left:8px;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Full Demo Page</a>`;
    modalContent.innerHTML = data.html;

    modalOrderBtn.href = `https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(data.waText)}`;

    // Setup simulator triggers inside modal
    if (demoKey === 'clinic') {
      const simBtn = document.getElementById('sim-book-test');
      if (simBtn) {
        simBtn.onclick = () => {
          const patient = document.getElementById('sim-patient-name')?.value || 'Demo Patient';
          const dept = document.getElementById('sim-department')?.value || 'General Consultation';
          const msg = `Namaste Doctor! New appointment requested by ${patient} for ${dept}.`;
          window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
          showToast('Simulator triggered! WhatsApp alert ready.');
        };
      }
    } else if (demoKey === 'gym') {
      const simGymBtn = document.getElementById('sim-gym-test');
      if (simGymBtn) {
        simGymBtn.onclick = () => {
          const phone = document.getElementById('sim-gym-phone')?.value || '9876543210';
          const msg = `IronPulse Alert: New Free Trial Pass claimed for phone: ${phone}. Contact immediately!`;
          window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
          showToast('Trial Pass alert sent via WhatsApp simulator!');
        };
      }
    } else if (demoKey === 'corporate') {
      const simCorpBtn = document.getElementById('sim-corp-test');
      if (simCorpBtn) {
        simCorpBtn.onclick = () => {
          showToast('📄 Brochure Download Simulation successful!');
        };
      }
    }

    demoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDemoModal = () => {
    demoModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.preview-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const demoKey = trigger.getAttribute('data-demo');
      openDemoModal(demoKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDemoModal);
  }

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeDemoModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal.classList.contains('open')) {
      closeDemoModal();
    }
  });

  /* -------------------------------------------------------------------------
   * 6. Client Lead Capture Form
   * ------------------------------------------------------------------------- */
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const industry = document.getElementById('client-business-type').value;
      const notes = document.getElementById('client-notes').value.trim();

      if (!name || !phone || !industry) {
        alert('Please fill out all required fields.');
        return;
      }

      const waMessage = `🚀 *NEW CLIENT INQUIRY FOR SHAKTIX*\n\n` +
        `👤 *Client / Brand Name:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `🏢 *Industry:* ${industry}\n` +
        `📝 *Requirement Notes:* ${notes ? notes : 'Standard Website Consultation'}\n\n` +
        `Please send me demo samples and quotation!`;

      // Sync lead with Supabase & Local DB
      if (window.SHAKTIX_SUPABASE) {
        window.SHAKTIX_SUPABASE.saveLead({
          name: name,
          phone: phone,
          industry: industry,
          notes: notes,
          source: 'Website Lead Form'
        });
      }

      showToast(`Thank you ${name}! Connecting with our leadership team... 🚀`);

      setTimeout(() => {
        window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`, '_blank');
        leadForm.reset();
      }, 1000);
    });
  }

  /* -------------------------------------------------------------------------
   * 7. Toast Notification Utility
   * ------------------------------------------------------------------------- */
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <i class="fa-solid fa-circle-check toast-icon"></i>
        <span class="toast-text">${message}</span>
      `;
      document.body.appendChild(toast);
    } else {
      toast.querySelector('.toast-text').textContent = message;
    }

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  /* -------------------------------------------------------------------------
   * 8. Floating Instant WhatsApp Button
   * ------------------------------------------------------------------------- */
  const floatingWaBtn = document.createElement('a');
  floatingWaBtn.href = `https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello SHAKTIX, I want a quick quote for my website.')}`;
  floatingWaBtn.target = '_blank';
  floatingWaBtn.className = 'floating-wa-btn';
  floatingWaBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  floatingWaBtn.innerHTML = `
    <i class="fa-brands fa-whatsapp"></i>
    <span class="floating-tooltip">Chat with CEO</span>
  `;
  document.body.appendChild(floatingWaBtn);

  // Add styles for the floating button
  const floatingStyle = document.createElement('style');
  floatingStyle.textContent = `
    .floating-wa-btn {
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 58px;
      height: 58px;
      background: #25d366;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.45);
      z-index: 999;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .floating-wa-btn:hover {
      transform: scale(1.1) translateY(-4px);
      box-shadow: 0 12px 35px rgba(37, 211, 102, 0.65);
    }
    .floating-tooltip {
      position: absolute;
      right: 70px;
      background: #0d121e;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 600;
      white-space: nowrap;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .floating-wa-btn:hover .floating-tooltip {
      opacity: 1;
    }
    @media (max-width: 768px) {
      .floating-wa-btn {
        bottom: 20px;
        right: 20px;
        width: 52px;
        height: 52px;
        font-size: 26px;
      }
    }
  `;
  document.head.appendChild(floatingStyle);
});
