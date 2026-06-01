const Modules = (() => {

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB'; u.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const brit = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en-GB'));
    if (brit) u.voice = brit;
    window.speechSynthesis.speak(u);
  }

  // ─── VOCAB ────────────────────────────────────────────────────────────────
  function renderVocab(trackId, c) {
    const cards = DATA.vocab[trackId] || [];
    const track = DATA.tracks.find(t => t.id === trackId);
    let idx = 0, flipped = false;

    function show() {
      if (idx >= cards.length) {
        c.innerHTML = doneScreen('All vocabulary done today!', 'Cards will return based on your ratings');
        return;
      }
      flipped = false;
      const v = cards[idx];
      c.innerHTML = `
        ${topbar(track.name + ' · Vocabulary', track.color)}
        <div style="font-size:12px;color:var(--ink3);margin-bottom:14px">${idx+1} / ${cards.length} · Tap card to reveal</div>
        <div class="vocab-card" onclick="flipV()" id="vc">
          <div class="vocab-word">${v.word}</div>
          <div class="vocab-ph">${v.ph}</div>
          <div class="vocab-hint" id="vh">Tap to reveal</div>
          <div class="vocab-back" id="vb">
            <div class="vocab-sep"></div>
            <div class="vocab-def">${v.def}</div>
            <div class="vocab-ex">${v.ex}</div>
            ${v.us ? `<div class="vocab-us"><i class="ti ti-arrows-exchange" aria-hidden="true"></i> US: ${v.us}</div>` : ''}
          </div>
        </div>
        <div class="vocab-rating" id="vr" style="display:none">
          <button class="vbtn hard" onclick="rate()">Hard</button>
          <button class="vbtn ok" onclick="rate()">OK</button>
          <button class="vbtn easy" onclick="rate()">Easy</button>
        </div>
        <button class="ex-next show" id="vsb" onclick="speak('${v.word.replace(/'/g,"\\'")}')">
          <i class="ti ti-volume" style="font-size:15px;margin-right:6px" aria-hidden="true"></i>Hear British pronunciation
        </button>
        <div style="height:16px"></div>
      `;
      window.flipV = () => {
        if (flipped) return; flipped = true;
        document.getElementById('vh').style.display = 'none';
        document.getElementById('vb').classList.add('show');
        document.getElementById('vr').style.display = 'flex';
        document.getElementById('vsb').classList.add('show');
      };
      window.rate = () => { idx++; show(); };
    }
    show();
  }

  // ─── GRAMMAR ──────────────────────────────────────────────────────────────
  function renderGrammar(trackId, c) {
    const qs = DATA.grammar[trackId] || [];
    const track = DATA.tracks.find(t => t.id === trackId);
    let idx = 0, answered = false;
    let aiLoading = false;

    function show() {
      if (idx >= qs.length) {
        c.innerHTML = doneScreen('Grammar session done!', qs.length + ' exercises completed');
        return;
      }
      answered = false;
      const q = qs[idx];
      render(q);
    }

    function render(q) {
      c.innerHTML = `
        ${topbar(track.name + ' · Grammar', track.color)}
        <div class="ex-progress"><div class="ex-progress-fill" style="width:${idx/qs.length*100}%"></div></div>
        <div class="ex-type">${q.type}</div>
        <div class="ex-question">${q.q}</div>
        <div class="ex-options">
          ${q.opts.map((o,i)=>`<button class="ex-option" onclick="pickG(${i})">${o}</button>`).join('')}
        </div>
        <div class="ex-feedback" id="fb"><div class="ex-fb-label">Why</div><div id="fb-text">${q.f||''}</div></div>
        <button class="ex-next" id="nxt" onclick="nextG()">Next →</button>
        <div style="font-size:11px;color:var(--ink3);text-align:right;margin-top:8px">${idx+1} / ${qs.length}</div>
      `;
      window.pickG = (i) => {
        if (answered) return; answered = true;
        document.querySelectorAll('.ex-option').forEach((b,bi) => {
          b.classList.add('disabled');
          if (bi === q.c) b.classList.add('correct');
          else if (bi === i && i !== q.c) b.classList.add('wrong');
        });
        document.getElementById('fb').classList.add('show');
        document.getElementById('nxt').classList.add('show');
      };
      window.nextG = () => { idx++; show(); };
    }
    show();
  }

  // ─── SPEAKING ─────────────────────────────────────────────────────────────
  function renderSpeak(trackId, c) {
    const phrases = DATA.speaking[trackId] || [];
    const track = DATA.tracks.find(t => t.id === trackId);
    let idx = 0, recog = null, isRec = false;

    function show() {
      if (idx >= phrases.length) {
        c.innerHTML = doneScreen('Speaking session complete!', 'Great practice');
        return;
      }
      const p = phrases[idx];
      c.innerHTML = `
        ${topbar(track.name + ' · Speaking', track.color)}
        <div class="ex-progress"><div class="ex-progress-fill" style="width:${idx/phrases.length*100}%"></div></div>
        <div class="speak-card">
          <div class="ex-type">Listen → Repeat → Record</div>
          <div class="speak-phrase">"${p.phrase}"</div>
          <div class="speak-tip"><i class="ti ti-bulb" style="font-size:13px;margin-right:4px" aria-hidden="true"></i>${p.tip}</div>
        </div>
        <button class="speak-btn speak-listen" onclick="speak('${p.phrase.replace(/'/g,"\\'")}')">
          <i class="ti ti-player-play" aria-hidden="true"></i> Listen (British)
        </button>
        <button class="speak-btn speak-rec" id="rec" onclick="toggleRec('${p.phrase.replace(/'/g,"\\'")}')">
          <i class="ti ti-microphone" aria-hidden="true"></i> <span id="rl">Record your voice</span>
        </button>
        <div class="speak-result" id="sr"></div>
        <div style="height:16px"></div>
        <button class="ex-next show" onclick="nextP()">Next phrase →</button>
        <div style="font-size:11px;color:var(--ink3);text-align:right;margin-top:8px">${idx+1} / ${phrases.length}</div>
      `;

      window.nextP = () => { idx++; show(); };
      window.toggleRec = (target) => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          showResult('Speech recognition not available. Use Safari on iPhone or Chrome on desktop.', false);
          return;
        }
        if (isRec) { recog?.stop(); return; }
        isRec = true;
        document.getElementById('rec').classList.add('recording');
        document.getElementById('rl').textContent = 'Recording… tap to stop';
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recog = new SR(); recog.lang = 'en-GB'; recog.continuous = false;
        recog.onresult = (e) => {
          const said = e.results[0][0].transcript.toLowerCase().trim();
          const tgt = target.toLowerCase();
          const words = tgt.split(' ');
          let matched = 0;
          words.forEach(w => { if (said.includes(w.replace(/[^a-z]/g,''))) matched++; });
          const pct = Math.round(matched / words.length * 100);
          const sr = document.getElementById('sr');
          sr.innerHTML = `<div style="margin-bottom:6px"><strong>You said:</strong> "${said}"</div><div style="margin-bottom:6px"><strong>Target:</strong> "${target}"</div><div style="font-weight:500;color:${pct>=70?'var(--vet-mid)':'var(--accent)'}">${pct>=80?'Excellent!':pct>=60?'Good — try again for a closer match.':'Keep practising — focus on individual words.'} (${pct}%)</div>`;
          sr.classList.add('show');
        };
        recog.onend = () => {
          isRec = false;
          const r = document.getElementById('rec');
          if (r) { r.classList.remove('recording'); document.getElementById('rl').textContent = 'Record your voice'; }
        };
        recog.start();
      };
    }
    show();
  }

  // ─── US → UK ──────────────────────────────────────────────────────────────
  function renderUSUK(c) {
    const pairs = DATA.usuk;
    let idx = 0;

    function show() {
      if (idx >= pairs.length) {
        c.innerHTML = doneScreen('All pairs done!', 'These will come back in vocabulary sessions');
        return;
      }
      const p = pairs[idx];
      c.innerHTML = `
        ${topbar('US → UK English', '#D85A30')}
        <div style="font-size:12px;color:var(--ink3);margin-bottom:16px">You learnt English in Boston — these are words to unlearn.</div>
        <div class="usuk-us">
          <div class="usuk-flag-label">🇺🇸 American English</div>
          <div class="usuk-word">${p.us}</div>
          <div class="usuk-ctx">${p.ctx}</div>
        </div>
        <div class="usuk-arrow"><i class="ti ti-arrow-down" aria-hidden="true"></i></div>
        <div class="usuk-uk" id="uk-card" onclick="revealUK()">
          <span style="font-size:13px;color:var(--ink3)">Tap to reveal British English</span>
        </div>
        <div style="height:16px"></div>
        <button class="ex-next show" onclick="nextU()">Next →</button>
        <div style="font-size:11px;color:var(--ink3);text-align:right;margin-top:8px">${idx+1} / ${pairs.length}</div>
      `;
      window.revealUK = () => {
        const card = document.getElementById('uk-card');
        card.innerHTML = `<div class="usuk-flag-label">🇬🇧 British English</div><div class="usuk-word" style="color:var(--vet)">${p.uk}</div>`;
        card.style.cursor = 'default';
        speak(p.uk.split('(')[0].trim());
      };
      window.nextU = () => { idx++; show(); };
    }
    show();
  }

  // ─── WRITING ──────────────────────────────────────────────────────────────
  function renderWriting(trackId, c) {
    const track = DATA.tracks.find(t => t.id === trackId);
    const prompts = {
      everyday: [
        { label: 'Message to UK landlord', p: 'Write a short message to your UK landlord reporting that the boiler has stopped working.' },
        { label: 'Workplace Slack message', p: 'Write a Slack message to your team saying you\'ll be 15 minutes late to the morning standup.' },
        { label: 'NHS appointment request', p: 'Write a message to your GP surgery requesting an appointment for a routine check-up.' },
      ],
      vet: [
        { label: 'Clinical note', p: 'Write a brief clinical note for a 5-year-old Labrador presenting with vomiting for 48 hours and lethargy.' },
        { label: 'Owner follow-up email', p: 'Write an email to a dog owner to follow up after their pet\'s surgery yesterday and check how they\'re doing.' },
        { label: 'Referral letter intro', p: 'Write the opening paragraph of a referral letter to a specialist for a cat with suspected hyperthyroidism.' },
      ],
      tech: [
        { label: 'Slack to team', p: 'Write a Slack message to your UK dev team saying you\'ll be picking up the authentication feature and estimate it\'ll take 2 days.' },
        { label: 'PR description', p: 'Write a short pull request description for a refactor of the user authentication module.' },
        { label: 'Email to line manager', p: 'Write a professional email to your UK line manager requesting a day off next Friday for a personal appointment.' },
      ],
    };
    const pList = prompts[trackId] || prompts.everyday;
    const chosen = pList[Math.floor(Math.random() * pList.length)];

    c.innerHTML = `
      ${topbar(track.name + ' · Writing', track.color)}
      <div class="ex-type">${chosen.label}</div>
      <div class="ex-question" style="font-size:17px;margin-bottom:16px">${chosen.p}</div>
      <textarea class="writing-area" id="wi" rows="6" placeholder="Write in English…"></textarea>
      <button class="ex-next show" onclick="submitW()" style="display:block">Get AI feedback →</button>
      <div class="ex-feedback" id="wfb" style="margin-top:14px"></div>
      <div style="height:16px"></div>
    `;
    window.submitW = () => AI.writingFeedback(
      document.getElementById('wi').value,
      chosen.p, trackId,
      document.getElementById('wfb')
    );
  }

  // ─── ROLE PLAY PICKER ─────────────────────────────────────────────────────
  function renderRoleplayPicker(trackId, c) {
    const track = DATA.tracks.find(t => t.id === trackId);
    const scenarios = DATA.roleplay.filter(r => r.track === trackId);
    c.innerHTML = `
      ${topbar(track.name + ' · Role play', track.color)}
      <div style="font-size:14px;color:var(--ink2);margin-bottom:18px;line-height:1.6">
        The AI plays a realistic British character. Reply in English — you'll get feedback after.
        <br><strong style="color:var(--ink)">Intensive mode</strong> gives you corrections after each reply.
      </div>
      ${scenarios.map(s => `
        <div class="scenario-card" onclick="startRP('${s.id}')">
          <div class="scenario-header">
            <div style="display:flex;align-items:center;gap:8px">
              <i class="ti ${s.icon}" style="font-size:18px;color:${track.color}" aria-hidden="true"></i>
              <span class="scenario-name">${s.name}</span>
            </div>
            <span class="ex-pill" style="background:${track.color};font-size:10px;padding:3px 8px">AI</span>
          </div>
          <div class="scenario-desc">${s.desc}</div>
          <div class="scenario-open">"${s.open.substring(0,70)}…"</div>
        </div>
      `).join('')}
      <div style="height:16px"></div>
    `;
    window.startRP = (id) => {
      const scenario = DATA.roleplay.find(r => r.id === id);
      if (scenario) AI.startRoleplay(scenario, c);
    };
  }

  // ─── VET PROTOCOL CHECK ───────────────────────────────────────────────────
  function renderProtocolCheck(c) {
    const cases = [
      { title: 'Emergency triage call', scenario: 'A client calls saying their dog has been vomiting blood for an hour. How do you respond on the phone?', hint: 'Think about: urgency assessment, what questions to ask, what to tell the owner to do.' },
      { title: 'Breaking bad news', scenario: 'You\'ve just confirmed cancer in a 7-year-old Golden Retriever. The owner is in the consultation room waiting for results. How do you start the conversation?', hint: 'Think about: your opening words, positioning, how to frame options.' },
      { title: 'Consent for surgery', scenario: 'A cat needs an emergency splenectomy. The owner is present but very anxious. How do you explain and obtain consent?', hint: 'Think about: what information the owner needs, how to explain risk, how to ask for consent in British clinical style.' },
    ];
    const chosen = cases[Math.floor(Math.random() * cases.length)];
    c.innerHTML = `
      ${topbar('Veterinary · Protocol Check', '#0F6E56')}
      <div class="ex-type">AI clinical assessment</div>
      <div class="ex-question" style="font-size:17px;margin-bottom:8px">${chosen.title}</div>
      <div style="font-size:13px;color:var(--ink2);margin-bottom:6px;line-height:1.6">${chosen.scenario}</div>
      <div style="font-size:12px;color:var(--ink3);margin-bottom:16px;font-style:italic">${chosen.hint}</div>
      <textarea class="writing-area" id="pi" rows="7" placeholder="Write your response in English…"></textarea>
      <button class="ex-next show" onclick="submitProto()" style="display:block">Check protocol & English →</button>
      <div class="ex-feedback" id="pfb" style="margin-top:14px"></div>
      <div style="height:16px"></div>
    `;

    window.submitProto = async () => {
      const text = document.getElementById('pi').value.trim();
      if (!text) return;
      const fb = document.getElementById('pfb');
      fb.innerHTML = 'Checking clinical protocol and English<span class="loading-dots"></span>';
      fb.classList.add('show');
      const sys = `You are a British veterinary clinical trainer AND English language coach. Luis is a Spanish vet moving to the UK. Analyse his response to this clinical scenario. Respond IN SPANISH with:

🏥 Protocolo clínico UK: Is the clinical approach correct? What would a UK vet do differently? Be specific.
✓ Inglés que suena natural
✗ Inglés que suena traducido o americano (with British alternatives)
💡 Frase clave que usarían los vets en UK para esta situación

Max 200 words. Be honest and specific — this is about patient safety and professional integration.`;
      try {
        const reply = await AI.call ? AI.call(sys, [{role:'user', content:`Scenario: ${chosen.scenario}\n\nLuis responded: "${text}"`}], 600)
          : (async () => {
            const r = await fetch('/api/claude', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,system:sys,messages:[{role:'user',content:`Scenario: ${chosen.scenario}\n\nLuis responded: "${text}"`}]})});
            const d = await r.json(); return d.content?.[0]?.text;
          })();
        if (fb) fb.innerHTML = (reply||'').replace(/\n/g,'<br>');
      } catch(e) { if(fb) fb.textContent = '⚠ Connection error.'; }
    };
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function topbar(title, color) {
    return `
      <div class="ex-topbar">
        <button class="ex-back" onclick="Nav.backFromModule()">← Back</button>
        <span class="ex-pill" style="background:${color}">${title}</span>
      </div>`;
  }

  function doneScreen(title, sub) {
    return `
      <div class="ex-topbar">
        <button class="ex-back" onclick="Nav.backFromModule()">← Back</button>
      </div>
      <div style="text-align:center;padding:40px 0 20px">
        <div style="font-family:'Playfair Display',serif;font-size:28px;color:var(--ink);margin-bottom:8px">${title}</div>
        <div style="font-size:13px;color:var(--ink3);margin-bottom:28px">${sub}</div>
        <button class="ex-next show" onclick="Nav.backFromModule()">Back to track →</button>
      </div>`;
  }

  return { renderVocab, renderGrammar, renderSpeak, renderUSUK, renderWriting, renderRoleplayPicker, renderProtocolCheck };
})();
