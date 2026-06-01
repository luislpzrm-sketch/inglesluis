const AI = (() => {

  // Direct API call — works from any hosting
  // Replace YOUR_KEY_HERE with your actual sk-ant-... key from console.anthropic.com
  const KEY = 'YOUR_KEY_HERE';
  const API = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-sonnet-4-20250514';

  async function call(system, messages, maxTokens = 900) {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API error ' + res.status);
    }
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error('No response from API');
    return text;
  }

  // ─── ROLEPLAY ─────────────────────────────────────────────────────────────
  function startRoleplay(scenario, container) {
    let history = [];
    const trackData = DATA.tracks.find(t => t.id === scenario.track);
    const color = trackData?.color || '#444441';

    container.innerHTML = `
      <div class="ex-topbar">
        <button class="ex-back" onclick="Nav.backFromModule()">← Back</button>
        <span class="ex-pill" style="background:${color}">${scenario.name}</span>
      </div>
      <div class="rp-chat" id="rp-chat">
        <div class="rp-bubble rp-ai">${esc(scenario.open)}</div>
      </div>
      <div class="rp-input-wrap">
        <div class="rp-feedback-toggle">
          <span style="font-size:11px;color:var(--ink3)">Feedback:</span>
          <button class="rp-fb-btn" id="fb-off" onclick="setFB('off')">Off</button>
          <button class="rp-fb-btn active" id="fb-normal" onclick="setFB('normal')">After reply</button>
          <button class="rp-fb-btn" id="fb-intensive" onclick="setFB('intensive')">Intensive</button>
        </div>
        <div class="rp-row">
          <input class="rp-input" id="rp-inp" placeholder="Reply in English…" autocomplete="off">
          <button class="rp-send" id="rp-send" onclick="sendMsg()">Send</button>
        </div>
        <button class="rp-end-btn" onclick="endRP()">End & get full feedback</button>
      </div>
    `;

    let fbMode = 'normal';
    document.getElementById('rp-inp').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    });

    window.setFB = (mode) => {
      fbMode = mode;
      ['off','normal','intensive'].forEach(m => {
        document.getElementById('fb-'+m)?.classList.toggle('active', m === mode);
      });
    };

    window.sendMsg = async () => {
      const inp = document.getElementById('rp-inp');
      const msg = inp.value.trim();
      if (!msg || inp.disabled) return;
      inp.value = ''; inp.disabled = true;
      document.getElementById('rp-send').disabled = true;

      const chat = document.getElementById('rp-chat');
      chat.innerHTML += `<div class="rp-bubble rp-user">${esc(msg)}</div>`;
      history.push({ role: 'user', content: msg });

      const loadId = 'load-' + Date.now();
      chat.innerHTML += `<div class="rp-bubble rp-ai" id="${loadId}">…</div>`;
      chat.scrollTop = chat.scrollHeight;

      try {
        const msgs = buildMsgs(history);
        const reply = await call(
          scenario.sys + '\n\nIMPORTANT: Keep responses to 2-3 sentences maximum. Stay in character.',
          msgs
        );
        const el = document.getElementById(loadId);
        if (el) el.textContent = reply;
        history.push({ role: 'assistant', content: reply });

        if (fbMode === 'intensive') {
          await showCorrection(msg, scenario, chat);
        }
      } catch(e) {
        const el = document.getElementById(loadId);
        if (el) el.innerHTML = `<span style="color:var(--accent)">⚠ ${e.message}</span>`;
      }

      inp.disabled = false;
      document.getElementById('rp-send').disabled = false;
      inp.focus();
      chat.scrollTop = chat.scrollHeight;
    };

    window.endRP = async () => {
      if (history.length < 2) { alert('Have a short conversation first!'); return; }
      const convo = [{ role: 'user', content: scenario.open }, ...history]
        .map((m, i) => (i % 2 === 0 ? 'Character: ' : 'Luis: ') + m.content).join('\n');

      container.innerHTML = `
        <div class="ex-topbar">
          <button class="ex-back" onclick="Nav.backFromModule()">← Back</button>
          <span class="ex-pill" style="background:var(--vet)">Feedback</span>
        </div>
        <div style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:6px">Your feedback</div>
        <div style="font-size:13px;color:var(--ink3);margin-bottom:16px">Analysing with AI…</div>
        <div class="ex-feedback show" id="rp-fb">Generating<span class="loading-dots"></span></div>
        <button class="ex-next show" style="margin-top:16px;display:block" onclick="Nav.backFromModule()">Back to modules →</button>
      `;

      try {
        const fb = await call(buildFeedbackPrompt(scenario.track), [{ role: 'user', content: `Conversation:\n\n${convo}` }], 700);
        const el = document.getElementById('rp-fb');
        if (el) el.innerHTML = fb.replace(/\n/g, '<br>');
      } catch(e) {
        const el = document.getElementById('rp-fb');
        if (el) el.innerHTML = `<span style="color:var(--accent)">⚠ ${e.message}</span>`;
      }
    };
  }

  async function showCorrection(msg, scenario, chat) {
    const corrId = 'corr-' + Date.now();
    chat.innerHTML += `<div class="rp-correction" id="${corrId}"><span class="loading-dots"></span></div>`;
    const trackHint = scenario.track === 'vet'
      ? 'Also check clinical protocol: is the approach correct for a UK vet?'
      : scenario.track === 'tech'
      ? 'Also check: is the register appropriate for UK tech workplace?'
      : '';
    const sys = `You are a British English coach. Analyse this single message from Luis (Spanish, B2, ex-Boston, vet+developer). Respond IN SPANISH in max 3 lines:
- If natural: "✓ Natural — sin correcciones."
- If improvable: "✏ Más natural: [corrected version]" + one SHORT explanation (max 12 words).
${trackHint}`;
    try {
      const reply = await call(sys, [{ role: 'user', content: `Context: ${scenario.name}\nMessage: "${msg}"` }], 150);
      const el = document.getElementById(corrId);
      if (el) el.innerHTML = reply.replace(/\n/g, '<br>');
    } catch(e) {
      document.getElementById(corrId)?.remove();
    }
  }

  // ─── WRITING FEEDBACK ────────────────────────────────────────────────────
  async function writingFeedback(text, prompt, trackId, fbEl) {
    if (!text.trim()) { fbEl.textContent = 'Escribe algo primero.'; fbEl.classList.add('show'); return; }
    fbEl.innerHTML = 'Analizando<span class="loading-dots"></span>';
    fbEl.classList.add('show');
    const trackExtra = trackId === 'vet'
      ? 'Also check: is the clinical register appropriate for a UK vet practice?'
      : trackId === 'tech'
      ? 'Also check: does this sound like a native UK developer?'
      : '';
    const sys = `You are a British English coach. Luis is Spanish, B2, lived in Boston (American habits), is a vet and developer moving to the UK. Analyse his writing. Respond IN SPANISH:
✓ Lo que suena natural (1-2 puntos)
✗ Lo que suena americano o traducido del español (con alternativa británica)
💡 Versión más natural en inglés británico: [full corrected version]
${trackExtra}
Max 150 words.`;
    try {
      const reply = await call(sys, [{ role: 'user', content: `Task: "${prompt}"\n\nLuis wrote: "${text}"` }], 500);
      fbEl.innerHTML = reply.replace(/\n/g, '<br>');
    } catch(e) {
      fbEl.innerHTML = `<span style="color:var(--accent)">⚠ ${e.message}</span>`;
    }
  }

  // ─── PROTOCOL CHECK ──────────────────────────────────────────────────────
  async function protocolCheck(text, scenario, fbEl) {
    if (!text.trim()) { fbEl.textContent = 'Escribe algo primero.'; fbEl.classList.add('show'); return; }
    fbEl.innerHTML = 'Analizando protocolo e inglés<span class="loading-dots"></span>';
    fbEl.classList.add('show');
    const sys = `You are a British veterinary clinical trainer AND English language coach. Analyse Luis's response to this clinical scenario. Respond IN SPANISH:
🏥 Protocolo clínico UK: Is the approach correct? What would a UK vet do differently?
✓ Inglés que suena natural
✗ Inglés que suena traducido o americano (with British alternatives)
💡 Frase clave que usarían los vets en UK
Max 200 words. Be honest and specific.`;
    try {
      const reply = await call(sys, [{ role: 'user', content: `Scenario: ${scenario}\n\nLuis: "${text}"` }], 600);
      fbEl.innerHTML = reply.replace(/\n/g, '<br>');
    } catch(e) {
      fbEl.innerHTML = `<span style="color:var(--accent)">⚠ ${e.message}</span>`;
    }
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────
  function buildMsgs(history) {
    return history.map((m, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: m.content }));
  }

  function buildFeedbackPrompt(track) {
    const base = `You are an expert British English coach for Spanish speakers. Luis is B2 certified, lived 8 months in Boston (American English habits), works as a clinical vet AND developer, wants to move to the UK. Analyse his conversation. Respond IN SPANISH:
✓ Lo que hiciste bien (2-3 puntos concretos con las frases reales que usó)
✗ Mejoras principales (2 puntos: frase incorrecta → alternativa británica natural)
💡 Expresión británica clave que podrías haber usado`;
    if (track === 'vet') return base + `\n⚕ Protocolo clínico UK: Was his clinical approach correct? Communication, terminology, consent — would a UK vet approve?`;
    if (track === 'tech') return base + `\n💻 Registro tech UK: Was the register appropriate? Any phrases too American or not natural for a UK dev team?`;
    return base + '\nMax 200 words total.';
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Expose call for protocol check in modules.js
  return { call, startRoleplay, writingFeedback, protocolCheck };
})();
