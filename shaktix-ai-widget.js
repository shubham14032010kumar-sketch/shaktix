/**
 * SHAKTIX Smart Gemini AI & Voice Engine (Module 1 & 2)
 * Powered by Google Gemini 3.8 / 3.5 Flash LLM with Conversational Memory.
 */

(function () {
  // Conversational Memory History
  const chatMemory = [];

  // Helper: Secure HTML Escaping for XSS prevention
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Helper: Markdown to Safe HTML parser
  function parseMarkdown(text) {
    if (!text) return '';
    // First escape HTML entities to prevent malicious script injection
    const safe = escapeHTML(text);
    return safe
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(0,240,255,0.15); color:#00f0ff; padding:2px 5px; border-radius:4px; font-size:12px;">$1</code>')
      .replace(/\n\s*[-*]\s+(.*)/g, '<li style="margin-left: 18px; margin-bottom: 4px;">$1</li>')
      .replace(/\n/g, '<br>');
  }

  // 1. DOM INJECTION
  function injectWidgetDOM() {
    if (document.getElementById('shaktix-ai-dock')) return;

    // A. Floating Dock (Bottom Right)
    const dock = document.createElement('div');
    dock.id = 'shaktix-ai-dock';
    dock.className = 'shaktix-floating-dock';
    dock.innerHTML = `
      <button class="shaktix-dock-btn voice-btn" id="shaktix-voice-btn" title="Speak with AI Assistant" aria-label="Speak with AI Assistant">
        <span class="btn-icon"><i class="fa-solid fa-microphone-lines" aria-hidden="true"></i></span>
        <span>Voice AI Demo</span>
      </button>
      <button class="shaktix-dock-btn chat-btn" id="shaktix-chat-btn" title="Chat with ShaktiX AI" aria-label="Chat with ShaktiX AI Assistant">
        <span class="btn-icon"><i class="fa-solid fa-robot" aria-hidden="true"></i></span>
        <span>Ask AI Assistant</span>
        <span class="pulse-badge"></span>
      </button>
    `;
    document.body.appendChild(dock);

    // B. Chat Modal Window
    const chatModal = document.createElement('div');
    chatModal.id = 'shaktix-chat-modal';
    chatModal.className = 'shaktix-ai-modal';
    chatModal.setAttribute('aria-hidden', 'true');
    chatModal.setAttribute('role', 'dialog');
    chatModal.innerHTML = `
      <div class="ai-modal-header">
        <div class="ai-header-left">
          <div class="ai-avatar"><i class="fa-solid fa-bolt" aria-hidden="true"></i></div>
          <div class="ai-meta">
            <div class="ai-meta-name" style="font-size:15px; font-weight:700; color:#0F172A; display:flex; align-items:center; gap:6px;">Vikram AI <span style="font-size: 11px; background: rgba(79,70,229,0.12); color: #4F46E5; padding: 2px 6px; border-radius: 4px; font-weight:700;"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Gemini Realtime</span></div>
            <span class="ai-status-text"><span class="pulse-badge" aria-hidden="true"></span> High-Speed AI Consultant</span>
          </div>
        </div>
        <div class="ai-header-actions" style="display:flex; align-items:center; gap:8px;">
          <button id="ai-quote-trigger" title="Request Official Quote" aria-label="Request Official Quote" style="background:#EEF2FF; color:#4F46E5; border:1px solid #C7D2FE; border-radius:12px; font-size:11px; font-weight:700; padding:4px 8px; cursor:pointer;">
            <i class="fa-solid fa-file-invoice" aria-hidden="true"></i> Get Quote
          </button>
          <button id="ai-chat-close" aria-label="Close Chat Window" title="Close Chat Window"><span class="visually-hidden">Close Chat Window</span><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="ai-modal-body" id="ai-chat-messages">
        <div class="ai-msg bot">
          <div class="ai-msg-bubble">
            Namaste! 🙏 Main <strong>Vikram</strong> hoon — SHAKTIX ka AI Consultant.<br><br>
            Aapko clinic, gym, store ya kisi brand ke liye website ya digital marketing me kya help chahiye?
          </div>
          <div class="ai-chips">
            <span class="ai-chip" data-action="demo-clinic">🏥 Clinic Demo</span>
            <span class="ai-chip" data-action="demo-gym">💪 Gym Demo</span>
            <span class="ai-chip" data-query="48-Hour delivery guarantee aur hosting terms kya hain?">⚡ 48-Hour SLA</span>
            <span class="ai-chip" data-action="wa-ceo">📲 Talk to CEO</span>
          </div>
        </div>
      </div>
      <div class="ai-modal-footer">
        <button class="ai-voice-input-btn" id="ai-mic-input-btn" title="Speak to type" aria-label="Speech to text input"><i class="fa-solid fa-microphone" aria-hidden="true"></i></button>
        <input type="text" class="ai-chat-input" id="ai-chat-input" aria-label="Type message for AI Consultant" placeholder="Type naturally in Hindi, Hinglish or English..." />
        <button class="ai-send-btn" id="ai-chat-send" title="Send message" aria-label="Send message to AI Assistant"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button>
      </div>
    `;
    document.body.appendChild(chatModal);

    // C. Voice Demo Modal Window
    const voiceModal = document.createElement('div');
    voiceModal.id = 'shaktix-voice-modal';
    voiceModal.className = 'shaktix-voice-modal';
    voiceModal.setAttribute('aria-hidden', 'true');
    voiceModal.setAttribute('role', 'dialog');
    voiceModal.innerHTML = `
      <div class="voice-orb" id="voice-orb"><i class="fa-solid fa-waveform-lines" aria-hidden="true"></i></div>
      <div class="voice-title">SHAKTIX Voice AI</div>
      <div class="voice-subtitle">Realtime Interactive Speech Engine</div>
      <div class="voice-transcript-box" id="voice-transcript">Click "Start Speaking" and talk to Vikram...</div>
      <div class="voice-controls">
        <button class="btn btn-primary" id="voice-toggle-btn" aria-label="Toggle voice input" style="border-radius: 50px; padding: 10px 24px;">
          <i class="fa-solid fa-microphone" aria-hidden="true"></i> Start Speaking
        </button>
        <button class="voice-hangup-btn" id="voice-close-btn" title="End call" aria-label="End voice call"><span class="visually-hidden">End voice call</span><i class="fa-solid fa-phone-slash" aria-hidden="true"></i></button>
      </div>
    `;
    document.body.appendChild(voiceModal);

    bindWidgetEvents();
  }

  // 2. BIND WIDGET EVENTS
  function bindWidgetEvents() {
    const chatBtn = document.getElementById('shaktix-chat-btn');
    const voiceBtn = document.getElementById('shaktix-voice-btn');
    const chatModal = document.getElementById('shaktix-chat-modal');
    const voiceModal = document.getElementById('shaktix-voice-modal');
    const chatClose = document.getElementById('ai-chat-close');
    const voiceClose = document.getElementById('voice-close-btn');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');
    const messagesBox = document.getElementById('ai-chat-messages');
    const micInputBtn = document.getElementById('ai-mic-input-btn');
    const quoteTriggerBtn = document.getElementById('ai-quote-trigger');

    // Open/Close Chat
    chatBtn.addEventListener('click', () => {
      chatModal.classList.toggle('active');
      const isActive = chatModal.classList.contains('active');
      chatModal.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      if (isActive) chatInput.focus();
    });
    chatClose.addEventListener('click', () => {
      chatModal.classList.remove('active');
      chatModal.setAttribute('aria-hidden', 'true');
    });

    // Open/Close Voice
    voiceBtn.addEventListener('click', () => {
      voiceModal.classList.add('active');
      voiceModal.setAttribute('aria-hidden', 'false');
    });
    voiceClose.addEventListener('click', () => {
      voiceModal.classList.remove('active');
      voiceModal.setAttribute('aria-hidden', 'true');
      stopVoiceEngine();
    });

    // Request Quote Card Trigger
    if (quoteTriggerBtn) {
      quoteTriggerBtn.addEventListener('click', () => {
        showLeadCaptureCard();
      });
    }

    // Send Message with Gemini Realtime Streaming
    async function handleSend() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage(text, 'user');
      chatMemory.push({ role: 'user', text: text });
      chatInput.value = '';

      // Glowing fast thinking indicator
      const typingElem = document.createElement('div');
      typingElem.className = 'ai-msg bot';
      typingElem.id = 'ai-typing-temp';
      typingElem.innerHTML = `<div class="ai-msg-bubble"><i class="fa-solid fa-bolt-lightning" style="color:#00f0ff; margin-right:6px;"></i> Vikram is thinking...</div>`;
      messagesBox.appendChild(typingElem);
      messagesBox.scrollTop = messagesBox.scrollHeight;

      // 1. Fetch Real Gemini LLM Response via /api/chat
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: chatMemory })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            const temp = document.getElementById('ai-typing-temp');
            if (temp) temp.remove();

            chatMemory.push({ role: 'model', text: data.reply });
            appendGeminiStreamingMessage(data.reply, (msgElem) => {
              attachSmartChips(msgElem, text, data.reply);
            });
            return;
          }
        }
      } catch (err) {
        console.warn('API fetch error, using smart fallback:', err.message);
      }

      // 2. Intelligent Resilient Fallback (Also streamed smoothly)
      setTimeout(() => {
        const temp = document.getElementById('ai-typing-temp');
        if (temp) temp.remove();

        const fallback = "Main Vikram hoon, SHAKTIX Web Studio se! Hum clinics, gyms aur local businesses ke liye 48-Hour delivery aur 1-Year Free NVMe Hosting ke sath high-converting websites build karte hain. Aapko kis type ki website explore karni hai?";
        chatMemory.push({ role: 'model', text: fallback });
        appendGeminiStreamingMessage(fallback, (msgElem) => {
          attachSmartChips(msgElem, text, fallback);
        });
      }, 250);
    }

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    // Quick Chips & Actions Click Listener
    messagesBox.addEventListener('click', (e) => {
      const chip = e.target.closest('.ai-chip');
      if (!chip) return;

      const action = chip.getAttribute('data-action');
      const query = chip.getAttribute('data-query');

      if (action) {
        if (action === 'demo-clinic') {
          const trigger = document.querySelector('.preview-trigger[data-demo="clinic"]');
          if (trigger) {
            chatModal.classList.remove('active');
            trigger.click();
          } else {
            window.open('demos/clinic/index.html', '_blank');
          }
        } else if (action === 'demo-gym') {
          const trigger = document.querySelector('.preview-trigger[data-demo="gym"]');
          if (trigger) {
            chatModal.classList.remove('active');
            trigger.click();
          } else {
            window.open('demos/gym/index.html', '_blank');
          }
        } else if (action === 'demo-corporate') {
          const trigger = document.querySelector('.preview-trigger[data-demo="corporate"]');
          if (trigger) {
            chatModal.classList.remove('active');
            trigger.click();
          } else {
            window.open('demos/corporate/index.html', '_blank');
          }
        } else if (action === 'wa-ceo') {
          const waMsg = encodeURIComponent('Namaste Shubham! I was talking with Vikram AI on SHAKTIX website and want to discuss my website project.');
          window.open(`https://wa.me/918298136441?text=${waMsg}`, '_blank');
        } else if (action === 'calc') {
          chatModal.classList.remove('active');
          const calcSec = document.getElementById('calculator');
          if (calcSec) calcSec.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (query) {
        chatInput.value = query;
        handleSend();
      }
    });

    // Voice recognition typing inside chat input
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.lang = 'hi-IN';

      recognizer.onstart = () => micInputBtn.classList.add('recording');
      recognizer.onend = () => micInputBtn.classList.remove('recording');
      recognizer.onresult = (evt) => {
        const spoken = evt.results[0][0].transcript;
        chatInput.value = spoken;
        handleSend();
      };

      micInputBtn.addEventListener('click', () => {
        try { recognizer.start(); } catch (err) { recognizer.stop(); }
      });
    }

    // Voice Demo Modal Engine
    initVoiceEngine();
  }

  // 3. GEMINI STREAMING TYPEWRITER EFFECT
  function appendGeminiStreamingMessage(rawMarkdown, onComplete) {
    const box = document.getElementById('ai-chat-messages');
    const msgElem = document.createElement('div');
    msgElem.className = 'ai-msg bot';

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';

    const contentSpan = document.createElement('span');
    contentSpan.className = 'gemini-stream-content';

    const cursor = document.createElement('span');
    cursor.className = 'gemini-stream-cursor';
    cursor.textContent = '▋';

    bubble.appendChild(contentSpan);
    bubble.appendChild(cursor);
    msgElem.appendChild(bubble);
    box.appendChild(msgElem);
    box.scrollTop = box.scrollHeight;

    // Stream word-by-word with 18ms interval for fluid Gemini typing
    const words = rawMarkdown.split(' ');
    let currentIdx = 0;
    let accumulated = '';

    const streamTimer = setInterval(() => {
      if (currentIdx < words.length) {
        accumulated += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
        contentSpan.innerHTML = parseMarkdown(accumulated);
        currentIdx++;
        box.scrollTop = box.scrollHeight;
      } else {
        clearInterval(streamTimer);
        cursor.remove();
        if (typeof onComplete === 'function') {
          onComplete(msgElem);
          box.scrollTop = box.scrollHeight;
        }
      }
    }, 18);
  }

  // 4. ATTACH SMART CONTEXTUAL CHIPS & 1-TAP WHATSAPP CARD
  function attachSmartChips(msgElem, userQuery, botReply) {
    const lower = (userQuery + ' ' + botReply).toLowerCase();
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'ai-chips';

    const chips = [];
    if (lower.includes('clinic') || lower.includes('doctor') || lower.includes('patient') || lower.includes('hospital')) {
      chips.push({ text: '🏥 View Clinic Live Demo', action: 'demo-clinic' });
      chips.push({ text: '💰 Clinic Packages & Cost', query: 'Clinic website ke packages aur pricing kya hain?' });
      chips.push({ text: '📲 Talk to CEO Shubham', action: 'wa-ceo' });
    } else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('trainer') || lower.includes('crossfit')) {
      chips.push({ text: '💪 View Gym Live Demo', action: 'demo-gym' });
      chips.push({ text: '💰 Gym Pricing & Plans', query: 'Gym website package aur pricing details batao' });
      chips.push({ text: '📲 Talk to CEO Shubham', action: 'wa-ceo' });
    } else if (lower.includes('corporate') || lower.includes('realty') || lower.includes('company') || lower.includes('b2b')) {
      chips.push({ text: '🏢 View Corporate Demo', action: 'demo-corporate' });
      chips.push({ text: '⚡ 48-Hour Delivery SLA', query: '48 ghante me delivery kaise hoti hai?' });
      chips.push({ text: '📲 Talk to CEO Shubham', action: 'wa-ceo' });
    } else {
      chips.push({ text: '🏥 Clinic Demo', action: 'demo-clinic' });
      chips.push({ text: '💪 Gym Demo', action: 'demo-gym' });
      chips.push({ text: '🧮 Estimate Cost', action: 'calc' });
      chips.push({ text: '📲 Direct WhatsApp', action: 'wa-ceo' });
    }

    chips.forEach(c => {
      const chip = document.createElement('span');
      chip.className = 'ai-chip';
      chip.textContent = c.text;
      if (c.query) chip.setAttribute('data-query', c.query);
      if (c.action) chip.setAttribute('data-action', c.action);
      chipsContainer.appendChild(chip);
    });

    msgElem.appendChild(chipsContainer);

    // Direct WhatsApp Closing Card if purchase / price intent
    if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('budget') || lower.includes('book') || lower.includes('number') || lower.includes('advance')) {
      const waCard = document.createElement('div');
      waCard.className = 'ai-wa-card';
      waCard.innerHTML = `
        <div class="ai-wa-card-header">
          <i class="fa-brands fa-whatsapp color-wa"></i>
          <span>Lock Your 48-Hour Slot with CEO Shubham:</span>
        </div>
        <a href="https://wa.me/918298136441?text=${encodeURIComponent('Namaste Shubham! I want to discuss website requirements and pricing for my brand.')}" target="_blank" class="ai-wa-btn">
          <i class="fa-brands fa-whatsapp"></i> Chat Direct on WhatsApp (+91 8298136441)
        </a>
      `;
      msgElem.appendChild(waCard);
    }
  }

  // 5. APPEND CHAT MESSAGE (User & Bot Messages)
  function appendMessage(content, sender) {
    const box = document.getElementById('ai-chat-messages');
    const msgElem = document.createElement('div');
    msgElem.className = `ai-msg ${sender}`;
    const safeContent = sender === 'user' ? escapeHTML(content) : parseMarkdown(content);
    msgElem.innerHTML = `<div class="ai-msg-bubble">${safeContent}</div>`;
    box.appendChild(msgElem);
    box.scrollTop = box.scrollHeight;
  }

  // 4. CLEAN LEAD CAPTURE CARD (Only shown on request / pricing intent)
  function showLeadCaptureCard() {
    const box = document.getElementById('ai-chat-messages');
    if (box.querySelector('.ai-lead-card:not(.submitted)')) return; // Avoid duplicate card

    const leadCard = document.createElement('div');
    leadCard.className = 'ai-lead-card';
    leadCard.innerHTML = `
      <div style="font-weight: 700; font-size: 12.5px; color: #00f0ff; display:flex; align-items:center; gap:6px;">
        <i class="fa-solid fa-bolt"></i> Get Free 60-Sec Preview & Quote
      </div>
      <input type="text" id="lead-name-input" aria-label="Aapka Name" placeholder="Aapka Name..." />
      <input type="tel" id="lead-phone-input" aria-label="WhatsApp Number" placeholder="WhatsApp Number (e.g. 9876543210)..." />
      <select id="lead-biz-input" aria-label="Select Business Type">
        <option value="Clinic">Clinic / Doctor Portal (From ₹6,999)</option>
        <option value="Gym">Gym / Fitness Portal (From ₹6,999)</option>
        <option value="Corporate">Corporate / B2B Website (From ₹12,999)</option>
        <option value="Store">E-Commerce / Store (From ₹21,999)</option>
        <option value="Other">Other Business</option>
      </select>
      <button class="submit-lead-btn" id="lead-submit-btn" aria-label="Send Free Demo Link on WhatsApp">Send My Free Demo Link</button>
    `;
    box.appendChild(leadCard);
    box.scrollTop = box.scrollHeight;

    leadCard.querySelector('#lead-submit-btn').addEventListener('click', () => {
      const name = leadCard.querySelector('#lead-name-input').value.trim();
      const phone = leadCard.querySelector('#lead-phone-input').value.trim();
      const biz = leadCard.querySelector('#lead-biz-input').value;

      if (!phone) {
        alert('Kripya apna WhatsApp number enter karein!');
        return;
      }

      leadCard.classList.add('submitted');

      // Save to Supabase Cloud & LocalStorage
      if (window.SHAKTIX_SUPABASE) {
        window.SHAKTIX_SUPABASE.saveLead({
          name: name || 'Website Visitor',
          phone: phone,
          category: biz,
          source: 'Gemini_Chatbot_Vikram',
          notes: 'Lead requested proposal from live Gemini chat'
        });
      }

      leadCard.innerHTML = `
        <div style="color: #10b981; font-size: 13px; font-weight: 700;">
          <i class="fa-solid fa-circle-check"></i> Shukriya ${name || ''}! Enquiry save ho gayi hai.
        </div>
        <p style="font-size: 11.5px; color: #94a3b8; margin: 4px 0 0;">Founder Shubham Kumar aapko WhatsApp par instant preview share karenge.</p>
      `;
    });
  }

  // 5. VOICE ENGINE (Module 2)
  let voiceRecognizer = null;
  let isSpeaking = false;

  function initVoiceEngine() {
    const toggleBtn = document.getElementById('voice-toggle-btn');
    const transcriptBox = document.getElementById('voice-transcript');
    const orb = document.getElementById('voice-orb');

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      transcriptBox.textContent = 'Speech recognition not supported in this browser. Please use Chrome or Edge.';
      toggleBtn.disabled = true;
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognizer = new SpeechRecognition();
    voiceRecognizer.continuous = true;
    voiceRecognizer.lang = 'hi-IN';

    voiceRecognizer.onstart = () => {
      orb.classList.add('listening');
      toggleBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Speaking';
      transcriptBox.textContent = 'Listening... Speak about your business or requirements!';
    };

    voiceRecognizer.onresult = async (evt) => {
      const current = evt.resultIndex;
      const transcript = evt.results[current][0].transcript;
      transcriptBox.innerHTML = `<strong>You said:</strong> "${transcript}"`;

      // Call Gemini for voice reply
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: transcript, history: chatMemory })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            const cleanText = data.reply.replace(/<[^>]*>?/gm, '').replace(/[*_#]/g, '');
            speakReply(cleanText);
            return;
          }
        }
      } catch (err) {}

      speakReply("Namaste! SHAKTIX me aapka swagat hai. Hum 48-Hour rapid delivery ke sath high-converting websites banate hain.");
    };

    voiceRecognizer.onerror = (e) => {
      console.warn('Speech error:', e.error);
    };

    toggleBtn.addEventListener('click', () => {
      if (isSpeaking) {
        stopVoiceEngine();
      } else {
        voiceRecognizer.start();
        isSpeaking = true;
      }
    });
  }

  function speakReply(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const transcriptBox = document.getElementById('voice-transcript');
    transcriptBox.innerHTML += `<br><br><span style="color: #00f0ff;"><strong>Vikram AI:</strong> Speaking response...</span>`;

    window.speechSynthesis.speak(utterance);
  }

  function stopVoiceEngine() {
    if (voiceRecognizer) {
      try { voiceRecognizer.stop(); } catch (e) {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    const orb = document.getElementById('voice-orb');
    const toggleBtn = document.getElementById('voice-toggle-btn');
    if (orb) orb.classList.remove('listening');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Start Speaking';
    isSpeaking = false;
  }

  // Auto-boot after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWidgetDOM);
  } else {
    injectWidgetDOM();
  }
})();
