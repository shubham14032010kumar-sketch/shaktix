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
   * 4.5 Global Currency Switcher (INR / USD)
   * ------------------------------------------------------------------------- */
  let currentCurrency = localStorage.getItem('shaktix_currency') || 'INR';

  const usdRates = {
    '6999': 99,
    '12999': 179,
    '21999': 299,
    '1500': 20,
    '2500': 35,
    '2000': 30,
    '3000': 45
  };

  function updateCurrencyUI(curr) {
    currentCurrency = curr;
    localStorage.setItem('shaktix_currency', curr);

    document.querySelectorAll('.curr-btn').forEach(btn => {
      if (btn.dataset.curr === curr) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.currency').forEach(el => {
      el.textContent = curr === 'USD' ? '$' : '₹';
    });

    document.querySelectorAll('.pricing-card .amount').forEach(el => {
      const inrVal = el.getAttribute('data-inr');
      const usdVal = el.getAttribute('data-usd');
      if (curr === 'USD' && usdVal) {
        el.textContent = usdVal;
      } else if (inrVal) {
        el.textContent = inrVal;
      }
    });

    document.querySelectorAll('.plan-cta-btn').forEach(btn => {
      const baseText = btn.getAttribute('data-base-text');
      const card = btn.closest('.pricing-card');
      const amountEl = card ? card.querySelector('.amount') : null;
      const amount = amountEl ? amountEl.textContent : '';
      const currSymbol = curr === 'USD' ? '$' : 'Rs ';
      if (baseText) {
        btn.href = `https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(baseText + ' (' + currSymbol + amount + ').')}`;
      }
    });

    calculateTotal();
  }

  document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateCurrencyUI(btn.dataset.curr);
    });
  });

  // Initialize selected currency on page load
  updateCurrencyUI(currentCurrency);

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

    const isUSD = currentCurrency === 'USD';
    let displayTotal = total;
    let currSymbol = '₹';

    if (isUSD) {
      currSymbol = '$';
      let baseUSD = usdRates[baseCost.toString()] || Math.round(baseCost / 75);
      let addUSD = 0;
      featureChecks.forEach(check => {
        if (check.checked) {
          addUSD += usdRates[check.value] || Math.round(parseInt(check.value, 10) / 75);
        }
      });
      displayTotal = baseUSD + addUSD;
    }

    if (totalDisplay) {
      totalDisplay.textContent = displayTotal.toLocaleString(isUSD ? 'en-US' : 'en-IN');
    }

    const summaryCurrency = document.querySelector('.summary-price .currency');
    if (summaryCurrency) {
      summaryCurrency.textContent = currSymbol;
    }

    if (claimEstimateBtn) {
      const featureListText = selectedFeatures.length > 0 
        ? selectedFeatures.join(', ') 
        : 'Standard Inclusions';
      
      const message = `Namaste SHAKTIX Team! I used your Website Cost Estimator.\n\n` +
        `📦 Plan: ${selectedTypeName}\n` +
        `⚡ Features: ${featureListText}\n` +
        `💰 Estimated Investment: ${currSymbol}${displayTotal.toLocaleString(isUSD ? 'en-US' : 'en-IN')}\n\n` +
        `I would like to discuss and book this package for my business.`;

      claimEstimateBtn.onclick = (e) => {
        e.preventDefault();
        window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        showToast('Connecting with our team on WhatsApp... 🚀');
      };

      const pdfBtn = document.getElementById('download-calc-pdf');
      if (pdfBtn) {
        pdfBtn.onclick = (e) => {
          e.preventDefault();
          const clientName = document.getElementById('calc-client-name')?.value.trim() || 'Valued Client';
          const advance = Math.round(total * 0.5);
          const balance = total - advance;
          const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          const refNo = 'STX-Q-' + Math.floor(1000 + Math.random() * 9000);
          
          const printWin = window.open('', '_blank', 'width=850,height=950');
          if (!printWin) {
            showToast('Please allow popups to download official PDF quote.');
            return;
          }
          printWin.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Official Quotation - ${clientName} | SHAKTIX Web Studio</title>
              <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; max-width: 780px; margin: 0 auto; }
                .header { display: flex; justify-content: space-between; border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 25px; }
                .brand { font-size: 28px; font-weight: 900; letter-spacing: 1px; }
                .brand span { color: #f59e0b; }
                .meta { text-align: right; font-size: 13px; color: #475569; }
                .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 25px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                th { background: #0f172a; color: #fff; text-align: left; padding: 12px; font-size: 13px; }
                td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
                .totals { width: 300px; margin-left: auto; background: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 10px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                .grand { font-size: 18px; font-weight: 800; color: #b45309; border-top: 1px solid #fcd34d; padding-top: 8px; margin-top: 8px; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
                @media print { body { padding: 10px; } }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="brand">SHAKTI<span>X</span> STUDIO</div>
                  <div style="font-size:12px; color:#64748b;">High-Performance Web Architecture &amp; AI Automation</div>
                  <div style="font-size:12px; color:#64748b;">Founder: Shubham Kumar | +91 8825208568</div>
                </div>
                <div class="meta">
                  <div style="font-weight:800; color:#f59e0b; font-size:16px;">OFFICIAL QUOTATION</div>
                  <div>Quote ID: <strong>${refNo}</strong></div>
                  <div>Date: <strong>${dateStr}</strong></div>
                  <div>Validity: <strong>7 Days</strong></div>
                </div>
              </div>
              <div class="box">
                <div style="font-size:11px; color:#64748b; text-transform:uppercase; font-weight:700;">Prepared Exclusively For:</div>
                <div style="font-size:18px; font-weight:800; margin-top:4px;">${clientName}</div>
                <div style="font-size:13px; color:#334155; margin-top:4px;">Estimated Delivery: <strong>48 to 72 Hours Guaranteed SLA</strong></div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Scope of Work / Package</th>
                    <th style="text-align:right;">Investment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>${selectedTypeName} Package</strong><br>
                      <span style="font-size:12px; color:#475569;">100% Mobile Responsive Design, 1-Yr Free Cloud NVMe Hosting, SSL &amp; Support</span>
                    </td>
                    <td style="text-align:right; font-weight:700;">₹${baseCost.toLocaleString('en-IN')}</td>
                  </tr>
                  ${selectedFeatures.length > 0 ? `
                  <tr>
                    <td>
                      <strong>Power Features &amp; Add-ons Selected:</strong><br>
                      <span style="font-size:12px; color:#475569;">${selectedFeatures.join(' • ')}</span>
                    </td>
                    <td style="text-align:right; font-weight:700;">₹${(total - baseCost).toLocaleString('en-IN')}</td>
                  </tr>` : ''}
                </tbody>
              </table>
              <div class="totals">
                <div class="row"><span>Package Base:</span><span>₹${baseCost.toLocaleString('en-IN')}</span></div>
                <div class="row"><span>Add-ons:</span><span>₹${(total - baseCost).toLocaleString('en-IN')}</span></div>
                <div class="row grand"><span>Total Investment:</span><span>₹${total.toLocaleString('en-IN')}</span></div>
                <div class="row" style="margin-top:10px; font-weight:700;"><span>50% Advance to Start:</span><span>₹${advance.toLocaleString('en-IN')}</span></div>
                <div class="row"><span>50% On Final Delivery:</span><span>₹${balance.toLocaleString('en-IN')}</span></div>
              </div>
              <div class="footer">
                <div>
                  <strong>Instant UPI Payment Option:</strong><br>
                  UPI ID: shubham14032010kumar-1@okaxis<br>
                  Portal: https://shaktix-studio.vercel.app
                </div>
                <div style="text-align:right;">
                  <strong>SHUBHAM KUMAR</strong><br>
                  Founder &amp; Tech Lead<br>
                  <em>Digitally Verified Quote</em>
                </div>
              </div>
              <script>setTimeout(() => { window.print(); }, 400);</script>
            </body>
            </html>
          `);
          printWin.document.close();
          showToast('Official PDF Quote ready to download! 📄');
        };
      }
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
    },
    ecommerce: {
      title: 'Aura Luxe Next-Gen Store Demo',
      badge: 'E-COMMERCE & RETAIL',
      price: 'Starting at ₹21,999 (Complete Store)',
      url: 'demos/ecommerce/index.html',
      html: `
        <div class="demo-preview-card">
          <p style="color:#6366F1; font-weight:700; margin-bottom:0.6rem;"><i class="fa-solid fa-bag-shopping"></i> High-Conversion D2C Storefront</p>
          <p style="font-size:0.92rem; color:#A1A1AA; line-height:1.6;">
            Convert social media traffic into instant revenue. Features responsive slide-out cart drawer, dynamic discount coupons (SHAKTIX20), UPI QR checkout, and WhatsApp order routing.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 16px 0;">
            <span style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); color:#818CF8; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> Slide Cart Drawer</span>
            <span style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); color:#818CF8; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> UPI QR Direct Payment</span>
            <span style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); color:#818CF8; font-size:12px; padding:4px 10px; border-radius:20px;"><i class="fa-solid fa-check"></i> 1-Click WhatsApp Checkout</span>
          </div>
        </div>
      `,
      waText: 'Hello SHAKTIX, I need an e-commerce website with UPI and WhatsApp checkout like Aura Luxe.'
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
   * 8. Interactive 3-Step Onboarding Wizard & Lead Handler
   * ------------------------------------------------------------------------- */
  window.nextWizardStep = function(step) {
    if (step === 2) {
      const activeNicheBtn = document.querySelector('.niche-btn.active');
      if (activeNicheBtn) {
        const nicheInput = document.getElementById('client-business-type');
        if (nicheInput) nicheInput.value = activeNicheBtn.dataset.niche;
      }
    }

    document.querySelectorAll('.wizard-step').forEach(el => el.style.display = 'none');
    const targetStep = document.getElementById(`wizard-step-${step}`);
    if (targetStep) targetStep.style.display = 'block';

    document.querySelectorAll('.step-indicator-item').forEach(ind => {
      const s = parseInt(ind.dataset.step);
      if (s <= step) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
  };

  // Niche button selection
  const nicheBtns = document.querySelectorAll('.niche-btn');
  nicheBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      nicheBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const hiddenInput = document.getElementById('client-business-type');
      if (hiddenInput) hiddenInput.value = btn.dataset.niche;
    });
  });

  // Feature cards check styling
  const featureCards = document.querySelectorAll('.feature-check-card');
  featureCards.forEach(card => {
    const input = card.querySelector('input[type="checkbox"]');
    if (input) {
      input.addEventListener('change', () => {
        if (input.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      });
    }
  });

  // Step button bindings
  const btnToStep2 = document.getElementById('wizard-to-step-2');
  if (btnToStep2) btnToStep2.addEventListener('click', () => window.nextWizardStep(2));
  
  const btnBackToStep1 = document.getElementById('wizard-back-to-step-1');
  if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => window.nextWizardStep(1));

  const btnToStep3 = document.getElementById('wizard-to-step-3');
  if (btnToStep3) btnToStep3.addEventListener('click', () => window.nextWizardStep(3));

  const btnBackToStep2 = document.getElementById('wizard-back-to-step-2');
  if (btnBackToStep2) btnBackToStep2.addEventListener('click', () => window.nextWizardStep(2));

  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const industryInput = document.getElementById('client-business-type');
      const industry = industryInput ? industryInput.value : 'Custom Business';
      const notes = document.getElementById('client-notes').value.trim();

      const selectedFeatures = Array.from(document.querySelectorAll('input[name="wizard-feature"]:checked'))
        .map(el => el.value)
        .join(', ');

      if (!name || !phone) {
        alert('Please fill out your name and WhatsApp number.');
        return;
      }

      const waMessage = `🚀 *NEW CLIENT ONBOARDING INQUIRY (SHAKTIX)*\n\n` +
        `👤 *Client / Brand:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `🏢 *Industry / Niche:* ${industry}\n` +
        `⚡ *Chosen Modules:* ${selectedFeatures || 'Standard Express Pack'}\n` +
        `📝 *Client Notes:* ${notes ? notes : '48-Hour Rapid SLA Kickoff'}\n\n` +
        `Please confirm project slot and lock delivery time!`;

      // Sync lead with Supabase & Local DB
      if (window.SHAKTIX_SUPABASE) {
        window.SHAKTIX_SUPABASE.saveLead({
          name: name,
          phone: phone,
          category: industry,
          notes: `Features: ${selectedFeatures} | Notes: ${notes}`,
          source: 'Interactive Onboarding Wizard'
        });
      }

      showToast(`Thank you ${name}! Connecting with our team... 🚀`);

      setTimeout(() => {
        window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`, '_blank');
        leadForm.reset();
        window.nextWizardStep(1);
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

  /* -------------------------------------------------------------------------
   * 11. Dynamic Social Proof Live Activity Toast
   * ------------------------------------------------------------------------- */
  function initSocialProofLiveToasts() {
    const liveActivities = [
      { name: "Dr. Rajesh Sharma (Patna)", action: "locked a 48H Clinic Portal", time: "2 min ago", icon: "fa-stethoscope" },
      { name: "FitPulse Gym (Ranchi)", action: "received their live demo link", time: "5 min ago", icon: "fa-dumbbell" },
      { name: "Apex Realty Group (Delhi)", action: "downloaded official PDF quotation", time: "9 min ago", icon: "fa-file-invoice" },
      { name: "Krishna Sweets & Bakery", action: "launched online WhatsApp store", time: "14 min ago", icon: "fa-cart-shopping" },
      { name: "Advocate Verma (Lucknow)", action: "booked Express Web Consultation", time: "21 min ago", icon: "fa-scale-balanced" },
      { name: "GreenLeaf Organics", action: "activated 1-Year Free NVMe Hosting", time: "28 min ago", icon: "fa-bolt" }
    ];

    let currentIdx = 0;
    const toastEl = document.createElement('div');
    toastEl.className = 'social-proof-toast';
    document.body.appendChild(toastEl);

    function triggerSocialProof() {
      const act = liveActivities[currentIdx];
      currentIdx = (currentIdx + 1) % liveActivities.length;

      toastEl.innerHTML = `
        <div class="sp-avatar"><i class="fa-solid ${act.icon}"></i></div>
        <div class="sp-content">
          <div class="sp-title"><strong>${act.name}</strong> ${act.action}</div>
          <div class="sp-time"><i class="fa-solid fa-circle-check"></i> ${act.time} &bull; Verified</div>
        </div>
      `;

      toastEl.classList.add('show');

      setTimeout(() => {
        toastEl.classList.remove('show');
      }, 5500);
    }

    setTimeout(triggerSocialProof, 3500);
    setInterval(triggerSocialProof, 24000);
  }

  initSocialProofLiveToasts();
});
