/**
 * SHAKTIX WEB — Master Interactive Engine & Animation Controller
 * Handles mouse spotlight tracking, FAQ accordion, calculator, demo modals,
 * portfolio filtering, lead capture sync, and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config: Leadership WhatsApp Line
  const CEO_WHATSAPP_NUMBER = '918298136441';

  /* -------------------------------------------------------------------------
   * 1. Mouse Ambient Spotlight Follower (Desktop only)
   * ------------------------------------------------------------------------- */
  const mouseSpotlight = document.getElementById('mouse-spotlight');
  if (mouseSpotlight && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseSpotlight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });
  }

  /* -------------------------------------------------------------------------
   * 2. Navbar Sticky & Mobile Menu Toggle
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
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', 'nav-menu');

    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-xmark', isOpen);
      }
    });

    // Close menu when clicking any nav link or mobile CTA
    document.querySelectorAll('.nav-link, .nav-menu-mobile-cta a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
   * 3. Number Counter Animation for Trust Metrics
   * ------------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  let countersTriggered = false;

  const startCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 1400;
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
  }, { threshold: 0.25 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }

  /* -------------------------------------------------------------------------
   * 4. Portfolio Category Filtering
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
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 240);
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
   * 5. Interactive Cost Estimator Calculator
   * ------------------------------------------------------------------------- */
  const typeBtns = document.querySelectorAll('#site-type-options .opt-btn');
  const featureChecks = document.querySelectorAll('.feature-check');
  const totalDisplay = document.getElementById('calculated-total');
  const claimEstimateBtn = document.getElementById('claim-estimate-btn');

  let baseCost = 6999;
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

    if (claimEstimateBtn) {
      const featureListText = selectedFeatures.length > 0 
        ? selectedFeatures.join(', ') 
        : 'Standard Inclusions';
      
      const message = `Namaste SHAKTIX Team! I used your Website Cost Estimator.\n\n` +
        `📦 Plan: ${selectedTypeName}\n` +
        `⚡ Features: ${featureListText}\n` +
        `💰 Estimated Investment: ₹${total.toLocaleString('en-IN')}\n\n` +
        `I would like to discuss and book this package for my business.`;

      claimEstimateBtn.onclick = (e) => {
        e.preventDefault();
        window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        showToast('Connecting with our team on WhatsApp... 🚀');
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

  // Run initial calculation
  calculateTotal();

  /* -------------------------------------------------------------------------
   * 6. Interactive FAQ Accordion
   * ------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* -------------------------------------------------------------------------
   * 7. Interactive Demo Preview Modal
   * ------------------------------------------------------------------------- */
  const demoModal = document.getElementById('demo-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge-type');
  const modalContent = document.getElementById('modal-content');
  const modalPriceTag = document.getElementById('modal-price-tag');
  const modalOrderBtn = document.getElementById('modal-order-btn');

  const demoData = {
    clinic: {
      title: 'CarePoint Multispeciality Clinic Demo',
      badge: 'DOCTOR / HEALTHCARE',
      price: 'Starting at ₹6,999 (Express) or ₹12,999 (Full)',
      url: 'demos/clinic/index.html',
      html: `
        <div class="demo-preview-card">
          <p style="color:#FF6B00; font-weight:700; margin-bottom:0.6rem;"><i class="fa-solid fa-stethoscope"></i> High-Converting Patient Acquisition Engine</p>
          <p style="font-size:0.92rem; color:#A1A1AA; line-height:1.6;">
            Clinics lose over 60% of potential patients because of slow websites and confusing phone booking. This template allows 1-click patient WhatsApp booking and doctor OPD schedule lookup.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 16px 0;">
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> 1-Click WhatsApp Booking</span>
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Doctor Profiles & OPD</span>
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Google Maps Directions</span>
          </div>
          <div style="background:#0d0d0d; border:1px solid #262626; border-radius:12px; padding:16px; margin-top:14px;">
            <p style="font-size:13px; font-weight:700; color:#fff; margin-bottom:10px;"><i class="fa-solid fa-calendar-check" style="color:#FF6B00;"></i> Test Patient Booking Simulator:</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
              <input type="text" id="sim-patient-name" placeholder="Patient Name" style="padding:8px 12px; background:#141414; border:1px solid #262626; border-radius:6px; color:#fff; font-size:13px;">
              <select id="sim-department" style="padding:8px 12px; background:#141414; border:1px solid #262626; border-radius:6px; color:#fff; font-size:13px;">
                <option value="General Physician">General Physician</option>
                <option value="Dentistry & Orthodontics">Dentistry & Orthodontics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
              </select>
            </div>
            <button id="sim-book-test" class="btn btn-sm btn-primary" style="width:100%; justify-content:center;">
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
      price: 'Starting at ₹6,999 (Express) or ₹12,999 (Full)',
      url: 'demos/gym/index.html',
      html: `
        <div class="demo-preview-card">
          <p style="color:#FF6B00; font-weight:700; margin-bottom:0.6rem;"><i class="fa-solid fa-dumbbell"></i> High-Energy Member Conversion Layout</p>
          <p style="font-size:0.92rem; color:#A1A1AA; line-height:1.6;">
            Turn everyday gym visitors into paid monthly and yearly members. Includes eye-catching membership tier matrix, trainer cards, and instant Free Trial Pass capture.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 16px 0;">
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Free Trial Pass Capture</span>
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Membership Tier Matrix</span>
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Transformation Stories</span>
          </div>
          <div style="background:#0d0d0d; border:1px solid #262626; border-radius:12px; padding:16px; margin-top:14px;">
            <p style="font-size:13px; font-weight:700; color:#fff; margin-bottom:10px;"><i class="fa-solid fa-bolt" style="color:#FF6B00;"></i> Live Free Pass Claim Simulator:</p>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
              <input type="tel" id="sim-gym-phone" placeholder="Enter Mobile for Trial Pass" style="flex:1; padding:8px 12px; background:#141414; border:1px solid #262626; border-radius:6px; color:#fff; font-size:13px;">
              <button id="sim-gym-test" class="btn btn-sm btn-primary">Claim Pass</button>
            </div>
            <p style="font-size:12px; color:#71717A;">Instant notification delivered to Gym Owner dashboard.</p>
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
          <p style="color:#FF6B00; font-weight:700; margin-bottom:0.6rem;"><i class="fa-solid fa-building"></i> Authority & Luxury Trust Architect</p>
          <p style="font-size:0.92rem; color:#A1A1AA; line-height:1.6;">
            High-ticket clients demand trust, speed, and clean corporate aesthetics. Built for Real Estate developers, Architects, CA firms, and Corporate Agencies.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 16px 0;">
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Property Showcase Grid</span>
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Download Brochure in 1-Click</span>
            <span style="background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); color:#FF8533; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Instant WhatsApp Routing</span>
          </div>
          <div style="background:#0d0d0d; border:1px solid #262626; border-radius:12px; padding:16px; margin-top:14px;">
            <p style="font-size:13px; font-weight:700; color:#fff; margin-bottom:10px;"><i class="fa-solid fa-file-pdf" style="color:#FF6B00;"></i> Brochure Download Trigger Test:</p>
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
    modalPriceTag.innerHTML = `${data.price} &bull; <a href="${data.url}" target="_blank" style="color:#FF8533; text-decoration:underline; font-size:0.9rem; margin-left:8px;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Full Demo</a>`;
    modalContent.innerHTML = data.html;
    modalOrderBtn.href = `https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(data.waText)}`;

    // Set simulator triggers
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
          showToast('📄 Property Brochure Download Simulation successful!');
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal.classList.contains('open')) {
      closeDemoModal();
    }
  });

  /* -------------------------------------------------------------------------
   * 8. Client Lead Capture Form
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

      const waMessage = `🚀 *NEW CLIENT INQUIRY FOR SHAKTIX WEB*\n\n` +
        `👤 *Client / Brand:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `🏢 *Industry:* ${industry}\n` +
        `📝 *Requirement Notes:* ${notes ? notes : 'Standard Website Consultation'}\n\n` +
        `Please share demo preview link and quotation!`;

      // Sync lead with Supabase & Local DB
      if (window.SHAKTIX_SUPABASE) {
        window.SHAKTIX_SUPABASE.saveLead({
          name: name,
          phone: phone,
          category: industry,
          notes: notes,
          source: 'Website Lead Form'
        });
      }

      showToast(`Thank you ${name}! Connecting with our team... 🚀`);

      setTimeout(() => {
        window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`, '_blank');
        leadForm.reset();
      }, 1000);
    });
  }

  /* -------------------------------------------------------------------------
   * 9. Toast Notification Utility
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
    }, 40);

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  /* -------------------------------------------------------------------------
   * 10. Secret CEO Shortcut (Ctrl + Shift + A opens Staff Portal)
   * ------------------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin/index.html';
    }
  });
});
