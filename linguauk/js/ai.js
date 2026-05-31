const AI = (() => {

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-sonnet-4-20250514';

  async function call(system, messages, maxTokens = 800) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages })
    });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    return data.content?.[0]?.text || '';
  }

  // ─── ROLEPLAY ────────────────────────────────────────────────────────────
  function startRoleplay(id, c) {
    const scenario = DATA.roleplayScenarios.find(s => s.id === id);
    if (!scenario) return;
    let history = [];

    c.innerHTML = `
      <div class="ex-topbar">
        <button class="ex-back" onclick="Modules.renderRoleplayPicker(document.getElementById('module-content'))">← Scenarios</button>
        <span class="ex-track-pill" style="background:${scenario.color}">${scenario.name}</span>
      </div>
      <div class="ai-chat" id="ai-chat">
        <div class="ai-bubble ai">${scenario.opening}</div>
      </div>
      <div class="ai-input-row">
        <input class="ai-text-input" id="ai-inp" placeholder="Reply in English…" autocomplete="off">
        <button class="ai-send-btn" onclick="sendMsg()">Send</button>
      </div>
      <button style="width:100%;margin-top:10px;padding:11px;border:0.5px solid var(--border);border-radius:var(--r);font-size:13px;color:var(--ink3);background:var(--cream);cursor:pointer;font-family:'DM Sans',sans-serif" onclick="endRP()">
        End conversation & get feedback
      </button>
    `;

    const inp = document.getElementById('ai-inp');
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });

    async function sendMsg() {
      const msg = inp.value.trim();
      if (!msg) return;
      inp.value = '';
      const chat = document.getElementById('ai-chat');
      if (!chat) return;
      chat.innerHTML += `<div class="ai-bubble user">${escHtml(msg)}</div>`;
      const loadId = 'load-' + Date.now();
      chat.innerHTML += `<div class="ai-bubble ai" id="${loadId}">Thinking<span class="loading-dots"></span></div>`;
      chat.scrollTop = chat.scrollHeight;
      history.push({ role: 'user', content: msg });
      try {
        const msgs = history.map((m, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: m.content }));
        const reply = await call(scenario.system + ' Keep responses to 2-3 sentences maximum.', msgs);
        const el = document.getElementById(loadId);
        if (el) el.textContent = reply;
        history.push({ role: 'assistant', content: reply });
      } catch (e) {
        const el = document.getElementById(loadId);
        if (el) el.textContent = 'Connection error. Please try again.';
      }
      chat.scrollTop = chat.scrollHeight;
    }

    async function endRP() {
      const convo = [{ role: 'user', content: scenario.opening }, ...history]
        .map((m, i) => (i % 2 === 0 ? 'Character: ' : 'You: ') + m.content).join('\n');
      c.innerHTML = `
        <div class="ex-topbar">
          <button class="ex-back" onclick="Modules.renderRoleplayPicker(document.getElementById('module-content'))">← Scenarios</button>
          <span class="ex-track-pill" style="background:var(--vet)">Feedback</span>
        </div>
        <div style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:6px">Your feedback</div>
        <div style="font-size:13px;color:var(--ink3);margin-bottom:16px">Analysing your conversation with AI…</div>
        <div class="ex-feedback show" id="rp-fb">Generating personalised feedback<span class="loading-dots"></span></div>
        <button class="ex-next show" style="margin-top:16px" onclick="Modules.renderRoleplayPicker(document.getElementById('module-content'))">Try another scenario →</button>
      `;
      const fbSystem = `You are an expert British English language coach specialising in helping Spanish speakers sound natural in UK professional contexts. Analyse the conversation below and give feedback IN SPANISH. Structure it as:

✓ Lo que hiciste bien (3 puntos concretos)
✗ Áreas de mejora (2 puntos con la forma correcta)
💡 Expresión británica que podrías haber usado

Be encouraging but specific. Max 200 words total.`;
      try {
        const fb = await call(fbSystem, [{ role: 'user', content: 'My roleplay conversation:\n\n' + convo }], 600);
        const el = document.getElementById('rp-fb');
        if (el) el.innerHTML = fb.replace(/\n/g, '<br>');
      } catch (e) {
        const el = document.getElementById('rp-fb');
        if (el) el.textContent = 'Could not load feedback. Check your connection.';
      }
    }

    window.sendMsg = sendMsg;
    window.endRP = endRP;
  }

  // ─── WRITING FEEDBACK ────────────────────────────────────────────────────
  async function submitWriting(text, prompt, fbEl) {
    if (!text) { fbEl.textContent = 'Please write something first.'; fbEl.classList.add('show'); return; }
    fbEl.innerHTML = 'Analysing your writing<span class="loading-dots"></span>';
    fbEl.classList.add('show');
    const system = `You are a British English language coach. The student is Spanish, B1-B2 level, with an American English background (lived in Boston 8 months). Their name is Luis. They work as a clinical vet and are a developer.

Analyse their writing for the given task. Respond IN SPANISH with:
✓ Qué suena natural y correcto (1-2 puntos)
✗ Qué suena americano o traducido del español (específico, con la forma británica correcta)
💡 Versión más natural en inglés británico (escribe la frase completa corregida)

Be specific, brief, and encouraging. Max 150 words.`;
    try {
      const reply = await call(system, [{ role: 'user', content: `Task: "${prompt}"\n\nMy writing: "${text}"` }], 500);
      fbEl.innerHTML = reply.replace(/\n/g, '<br>');
    } catch (e) {
      fbEl.textContent = 'Connection error. Please check your internet connection.';
    }
  }

  // ─── UTILS ───────────────────────────────────────────────────────────────
  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { startRoleplay, submitWriting };
})();
