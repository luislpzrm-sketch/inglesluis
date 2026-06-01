const AI = (() => {
  // Calls proxy on Vercel, or direct API when running inside claude.ai
  async function call(system, messages, maxTokens = 900) {
    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages
    };

    // Try proxy first (standalone deployment), fall back to direct (claude.ai)
    const endpoints = ['/api/claude', 'https://api.anthropic.com/v1/messages'];
    for (const endpoint of endpoints) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
        if (!res.ok) continue;
        const data = await res.json();
        const text = data.content?.[0]?.text;
        if (text) return text;
      } catch (e) { continue; }
    }
    throw new Error('No connection available');
  }

  // ─── ROLEPLAY ─────────────────────────────────────────────────────────────
  function startRoleplay(scenario, container, feedbackLevel = 'normal') {
    let history = []; // [{role, content, correction}]
    let turnCount = 0;

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
          <button class="rp-fb-btn ${feedbackLevel==='off'?'active':''}" onclick="AI.setFeedback('off')">Off</button>
          <button class="rp-fb-btn ${feedbackLevel==='normal'?'active':''}" onclick="AI.setFeedback('normal')">After reply</button>
          <button class="rp-fb-btn ${feedbackLevel==='intensive'?'active':''}" onclick="AI.setFeedback('intensive')">Intensive</button>
        </div>
        <div class="rp-row">
          <input class="rp-input" id="rp-inp" placeholder="Reply in English…" autocomplete="off">
          <button class="rp-send" id="rp-send" onclick="AI.sendRp()">Send</button>
        </div>
        <button class="rp-end-btn" onclick="AI.endRp()">End & get full feedback</button>
      </div>
    `;

    document.getElementById('rp-inp').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); AI.sendRp(); }
    });

    let currentFeedback = feedbackLevel;

    AI.setFeedback = (level) => {
      currentFeedback = level;
      document.querySelectorAll('.rp-fb-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`.rp-fb-btn:nth-child(${level==='off'?1:level==='normal'?2:3})`).classList.add('active');
    };

    AI.sendRp = async () => {
      const inp = document.getElementById('rp-inp');
      const msg = inp.value.trim();
      if (!msg || inp.disabled) return;
      inp.value = ''; inp.disabled = true;
      document.getElementById('rp-send').disabled = true;

      const chat = document.getElementById('rp-chat');
      chat.innerHTML += `<div class="rp-bubble rp-user">${esc(msg)}</div>`;
      history.push({ role: 'user', content: msg });
      turnCount++;

      // AI character response
      const loadId = 'rp-load-' + Date.now();
      chat.innerHTML += `<div class="rp-bubble rp-ai rp-loading" id="${loadId}">…</div>`;
      chat.scrollTop = chat.scrollHeight;

      try {
        const msgs = history.map(h => ({ role: h.role, content: h.content }));
        const reply = await call(scenario.sys + '\n\nIMPORTANT: Keep responses to 2-3 sentences maximum. Stay in character.', msgs);
        const el = document.getElementById(loadId);
        if (el) { el.textContent = reply; el.classList.remove('rp-loading'); }
        history.push({ role: 'assistant', content: reply });

        // Inline correction if intensive mode
        if (currentFeedback === 'intensive') {
          await showInlineCorrection(msg, scenario, chat);
        }

      } catch (e) {
        const el = document.getElementById(loadId);
        if (el) { el.textContent = '⚠ Connection error — check your internet.'; el.classList.remove('rp-loading'); }
      }

      inp.disabled = false;
      document.getElementById('rp-send').disabled = false;
      inp.focus();
      chat.scrollTop = chat.scrollHeight;
    };

    AI.endRp = async () => {
      if (history.length < 2) { alert('Have a short conversation first!'); return; }
      const convo = [{ role: 'user', content: scenario.open }, ...history]
        .map((m, i) => (i % 2 === 0 ? 'Character: ' : 'Luis: ') + m.content).join('\n');

      container.innerHTML = `
        <div class="ex-topbar">
          <button class="ex-back" onclick="Nav.backFromModule()">← Back</button>
          <span class="ex-pill" style="background:var(--vet)">Feedback</span>
        </div>
        <div style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:6px">Your conversation feedback</div>
        <div style="font-size:13px;color:var(--ink3);margin-bottom:16px">Analysing your English with AI…</div>
        <div class="ex-feedback show" id="rp-final-fb">Generating feedback<span class="loading-dots"></span></div>
        <button class="ex-next show" style="margin-top:16px;display:block" onclick="Nav.backFromModule()">Back to modules →</button>
      `;

      const sysPrompt = buildFeedbackPrompt(scenario.track);
      try {
        const fb = await call(sysPrompt, [{ role: 'user', content: `Conversation:\n\n${convo}` }], 700);
        const el = document.getElementById('rp-final-fb');
        if (el) el.innerHTML = fb.replace(/\n/g, '<br>');
      } catch (e) {
        const el = document.getElementById('rp-final-fb');
        if (el) el.textContent = 'Could not load feedback. Check your connection.';
      }
    };
  }

  async function showInlineCorrection(userMsg, scenario, chat) {
    const corrId = 'corr-' + Date.now();
    chat.innerHTML += `<div class="rp-correction" id="${corrId}"><span class="loading-dots"></span></div>`;

    const trackHint = scenario.track === 'vet'
      ? 'Also check clinical protocol: is the approach, terminology and communication style correct for a UK vet?'
      : scenario.track === 'tech'
      ? 'Also check: is the register appropriate for UK tech workplace communication?'
      : '';

    const sys = `You are a British English coach. Analyse this single message from Luis (Spanish, B2, ex-Boston, vet+developer). In ONE brief block:
- If natural: just say "✓ Natural — no corrections needed."
- If improvable: show "✏ More natural: [corrected version]" then one SHORT explanation (max 15 words) of the main issue.
- ${trackHint}
Respond in Spanish. Max 3 lines total. Be direct.`;

    try {
      const reply = await call(sys, [{ role: 'user', content: `Context: ${scenario.name}\nMy message: "${userMsg}"` }], 200);
      const el = document.getElementById(corrId);
      if (el) el.innerHTML = reply.replace(/\n/g, '<br>');
    } catch (e) {
      const el = document.getElementById(corrId);
      if (el) el.remove();
    }
  }

  function buildFeedbackPrompt(track) {
    const base = `You are an expert British English coach for Spanish speakers. Luis is B2 certified, lived 8 months in Boston (American English habits), works as a clinical vet AND developer, wants to move to the UK. Analyse his conversation. Respond IN SPANISH with these sections:

✓ Lo que hiciste bien (2-3 puntos concretos, with the actual phrases he used)
✗ Mejoras principales (2 puntos, show the wrong phrase → the natural British alternative)
💡 Expresión británica clave que podrías haber usado (1 specific phrase with context)`;

    if (track === 'vet') return base + `\n\n⚕ Protocolo clínico UK (important extra section): Was his clinical approach correct? Communication style, terminology, consent language — would a UK vet approve? Be specific.`;
    if (track === 'tech') return base + `\n\n💻 Registro profesional tech UK: Was the register appropriate for UK tech workplace? Any phrases that sound too formal, too American, or not like a native developer?`;
    return base + '\n\nMax 200 words total. Be encouraging but honest.';
  }

  // ─── WRITING FEEDBACK ────────────────────────────────────────────────────
  async function writingFeedback(text, prompt, trackId, fbEl) {
    if (!text.trim()) { fbEl.textContent = 'Write something first.'; fbEl.classList.add('show'); return; }
    fbEl.innerHTML = 'Analysing<span class="loading-dots"></span>';
    fbEl.classList.add('show');

    const trackExtra = trackId === 'vet'
      ? 'Also check: is the clinical/professional register appropriate for a UK vet practice?'
      : trackId === 'tech'
      ? 'Also check: does this sound like a native UK developer? Would it fit in a real UK tech team?'
      : '';

    const sys = `You are a British English coach. Luis is Spanish, B2, lived in Boston (American habits), is a vet and developer moving to the UK. Analyse his writing. Respond IN SPANISH:

✓ Lo que suena natural (1-2 puntos)
✗ Lo que suena americano o traducido del español (específico, show phrase → British alternative)  
💡 Versión más natural en inglés británico: [write the full corrected version]
${trackExtra}
Max 150 words. Be specific and direct.`;

    try {
      const reply = await call(sys, [{ role: 'user', content: `Task: "${prompt}"\n\nLuis wrote: "${text}"` }], 500);
      fbEl.innerHTML = reply.replace(/\n/g, '<br>');
    } catch (e) {
      fbEl.textContent = '⚠ Connection error. Check your internet and try again.';
    }
  }

  // ─── AI GRAMMAR GENERATION ───────────────────────────────────────────────
  async function generateGrammarQ(trackId, errorPatterns, loadingEl) {
    loadingEl.innerHTML = 'Generating a question for you<span class="loading-dots"></span>';

    const sys = `You are a British English teacher. Generate ONE grammar/vocabulary multiple-choice question for Luis: Spanish, B2, ex-Boston (American habits), vet + developer, moving to UK.

Track: ${trackId}. Focus on errors Spanish speakers make, or UK vs US differences.
${errorPatterns.length ? `His known weak areas: ${errorPatterns.join(', ')}` : ''}

Respond ONLY in this exact JSON format (no markdown, no explanation):
{"type":"Grammar type in 3-5 words","q":"The question","opts":["option A","option B","option C","option D"],"c":0,"f":"Explanation in English, max 40 words"}

The "c" field is the index (0-3) of the correct answer.`;

    try {
      const reply = await call(sys, [{ role: 'user', content: 'Generate one question.' }], 300);
      const clean = reply.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      return null;
    }
  }

  function esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { startRoleplay, writingFeedback, generateGrammarQ, setFeedback: ()=>{}, sendRp: ()=>{}, endRp: ()=>{} };
})();
