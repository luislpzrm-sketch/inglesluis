const Modules = (() => {

  // ─── GRAMMAR ───────────────────────────────────────────────────────────────
  function renderGrammar(c) {
    let idx = 0, answered = false;

    function show() {
      if (idx >= DATA.grammarQuestions.length) {
        c.innerHTML = `
          <div class="ex-topbar">
            <button class="ex-back" onclick="App.backToPractice()">← Back</button>
            <span class="ex-track-pill" style="background:#1D9E75">Complete</span>
          </div>
          <div style="text-align:center;padding:40px 0 20px">
            <div style="font-family:'Playfair Display',serif;font-size:30px;color:var(--ink);margin-bottom:8px">Session complete</div>
            <div style="font-size:14px;color:var(--ink3);margin-bottom:32px">10 grammar exercises done</div>
            <button class="ex-next show" onclick="App.backToPractice()">Back to modules →</button>
          </div>`;
        return;
      }
      answered = false;
      const q = DATA.grammarQuestions[idx];
      c.innerHTML = `
        <div class="ex-topbar">
          <button class="ex-back" onclick="App.backToPractice()">← Back</button>
          <span class="ex-track-pill" style="background:${q.color}">${q.track}</span>
        </div>
        <div class="ex-progress"><div class="ex-progress-fill" style="width:${idx / DATA.grammarQuestions.length * 100}%"></div></div>
        <div class="ex-type">${q.type}</div>
        <div class="ex-question">${q.q}</div>
        <div class="ex-options">
          ${q.opts.map((o, i) => `<button class="ex-option" onclick="pick(${i})">${o}</button>`).join('')}
        </div>
        <div class="ex-feedback" id="fb"><div class="ex-feedback-label">Why</div>${q.f}</div>
        <button class="ex-next" id="nxt" onclick="next()">Next question →</button>
        <div style="font-size:11px;color:var(--ink3);text-align:right;margin-top:8px">${idx + 1} / ${DATA.grammarQuestions.length}</div>
      `;

      window.pick = (i) => {
        if (answered) return;
        answered = true;
        document.querySelectorAll('.ex-option').forEach((b, bi) => {
          b.classList.add('disabled');
          if (bi === q.c) b.classList.add('correct');
          else if (bi === i && i !== q.c) b.classList.add('wrong');
        });
        document.getElementById('fb').classList.add('show');
        document.getElementById('nxt').classList.add('show');
      };
      window.next = () => { idx++; show(); };
    }
    show();
  }

  // ─── VOCABULARY ────────────────────────────────────────────────────────────
  function renderVocab(c) {
    let idx = 0, flipped = false;

    function show() {
      if (idx >= DATA.vocabCards.length) {
        c.innerHTML = `
          <div class="ex-topbar">
            <button class="ex-back" onclick="App.backToPractice()">← Back</button>
          </div>
          <div style="text-align:center;padding:40px 0">
            <div style="font-family:'Playfair Display',serif;font-size:28px;margin-bottom:8px">All done today</div>
            <div style="font-size:13px;color:var(--ink3);margin-bottom:28px">Cards will return based on your ratings</div>
            <button class="ex-next show" onclick="App.backToPractice()">Back to modules →</button>
          </div>`;
        return;
      }
      flipped = false;
      const v = DATA.vocabCards[idx];
      c.innerHTML = `
        <div class="ex-topbar">
          <button class="ex-back" onclick="App.backToPractice()">← Back</button>
          <span class="ex-track-pill" style="background:${v.color}">${v.track}</span>
        </div>
        <div style="font-size:12px;color:var(--ink3);margin-bottom:14px">${idx + 1} / ${DATA.vocabCards.length} · Tap card to reveal</div>
        <div class="vocab-card" onclick="flipCard()" id="vcard">
          <div class="vocab-word">${v.word}</div>
          <div class="vocab-phonetic">${v.phonetic} · ${v.track}</div>
          <div class="vocab-hint" id="vhint">Tap to reveal definition</div>
          <div class="vocab-back" id="vback">
            <div class="vocab-divider"></div>
            <div class="vocab-def">${v.def}</div>
            <div class="vocab-ex">${v.ex}</div>
            ${v.us ? `<div class="vocab-us"><i class="ti ti-arrows-exchange" style="font-size:13px" aria-hidden="true"></i>US equivalent: ${v.us}</div>` : ''}
          </div>
        </div>
        <div class="vocab-rating" id="vrating" style="display:none">
          <button class="vocab-btn hard" onclick="rate()">Hard</button>
          <button class="vocab-btn ok" onclick="rate()">OK</button>
          <button class="vocab-btn easy" onclick="rate()">Easy</button>
        </div>
        <button class="ex-next" id="vspeakbtn" onclick="speakWord('${v.word.replace(/'/g, "\\'")}')">
          <i class="ti ti-volume" style="font-size:16px;margin-right:6px" aria-hidden="true"></i>Hear pronunciation
        </button>
      `;

      window.flipCard = () => {
        if (flipped) return;
        flipped = true;
        document.getElementById('vhint').style.display = 'none';
        document.getElementById('vback').classList.add('show');
        document.getElementById('vrating').style.display = 'flex';
        document.getElementById('vspeakbtn').classList.add('show');
      };
      window.rate = () => { idx++; show(); };
    }
    show();
  }

  function speakWord(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB'; u.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const brit = voices.find(v => v.lang === 'en-GB');
    if (brit) u.voice = brit;
    window.speechSynthesis.speak(u);
  }

  // ─── SPEAKING ──────────────────────────────────────────────────────────────
  function renderSpeak(c) {
    let idx = 0;
    let recognition = null;
    let recording = false;

    function show() {
      if (idx >= DATA.speakingPhrases.length) {
        c.innerHTML = `
          <div class="ex-topbar">
            <button class="ex-back" onclick="App.backToPractice()">← Back</button>
          </div>
          <div style="text-align:center;padding:40px 0">
            <div style="font-family:'Playfair Display',serif;font-size:28px;margin-bottom:8px">Speaking done!</div>
            <div style="font-size:13px;color:var(--ink3);margin-bottom:28px">Great practice session</div>
            <button class="ex-next show" onclick="App.backToPractice()">Back →</button>
          </div>`;
        return;
      }
      const p = DATA.speakingPhrases[idx];
      c.innerHTML = `
        <div class="ex-topbar">
          <button class="ex-back" onclick="App.backToPractice()">← Back</button>
          <span class="ex-track-pill" style="background:${p.color}">${p.track}</span>
        </div>
        <div class="ex-progress"><div class="ex-progress-fill" style="width:${idx / DATA.speakingPhrases.length * 100}%"></div></div>
        <div class="ex-type">${p.label}</div>
        <div class="speak-phrase">"${p.phrase}"</div>
        <div style="font-size:12px;color:var(--ink3);margin-bottom:16px;line-height:1.5">
          <i class="ti ti-bulb" style="font-size:14px;vertical-align:-2px" aria-hidden="true"></i> ${p.tip}
        </div>
        <button class="speak-btn speak-listen" onclick="listen('${p.phrase.replace(/'/g, "\\'")}')">
          <i class="ti ti-player-play" aria-hidden="true"></i> Listen (British English)
        </button>
        <button class="speak-btn speak-record" id="rec-btn" onclick="toggleRec('${p.phrase.replace(/'/g, "\\'")}')">
          <i class="ti ti-microphone" aria-hidden="true"></i> <span id="rec-label">Record your voice</span>
        </button>
        <div class="speak-result" id="speak-result"></div>
        <div style="height:16px"></div>
        <button class="ex-next show" onclick="nextPhrase()">Next phrase →</button>
        <div style="font-size:11px;color:var(--ink3);text-align:right;margin-top:8px">${idx + 1} / ${DATA.speakingPhrases.length}</div>
      `;

      window.listen = (text) => speakWord(text);
      window.nextPhrase = () => { idx++; show(); };
      window.toggleRec = (target) => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          const r = document.getElementById('speak-result');
          r.innerHTML = 'Speech recognition not available in this browser. Try Safari on iOS or Chrome on desktop.';
          r.classList.add('show'); return;
        }
        if (recording) { if (recognition) recognition.stop(); return; }
        recording = true;
        document.getElementById('rec-btn').classList.add('recording');
        document.getElementById('rec-label').textContent = 'Recording… tap to stop';
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR();
        recognition.lang = 'en-GB'; recognition.continuous = false;
        recognition.onresult = (e) => {
          const said = e.results[0][0].transcript.toLowerCase().trim();
          const tgt = target.toLowerCase().trim();
          const words = tgt.split(' ');
          let matched = 0;
          words.forEach(w => { if (said.includes(w.replace(/[^a-z]/g, ''))) matched++; });
          const pct = Math.round(matched / words.length * 100);
          const r = document.getElementById('speak-result');
          r.innerHTML = `
            <div style="margin-bottom:6px"><strong>You said:</strong> "${said}"</div>
            <div style="margin-bottom:8px"><strong>Target:</strong> "${target}"</div>
            <div style="font-weight:500;color:${pct >= 70 ? 'var(--vet)' : 'var(--accent)'}">
              ${pct >= 80 ? 'Excellent pronunciation!' : pct >= 60 ? 'Good — try again for a closer match.' : 'Keep practising — focus on individual words.'} (${pct}% match)
            </div>`;
          r.classList.add('show');
        };
        recognition.onend = () => {
          recording = false;
          const btn = document.getElementById('rec-btn');
          if (btn) { btn.classList.remove('recording'); document.getElementById('rec-label').textContent = 'Record your voice'; }
        };
        recognition.start();
      };
    }
    show();
  }

  // ─── ROLEPLAY PICKER ───────────────────────────────────────────────────────
  function renderRoleplayPicker(c) {
    c.innerHTML = `
      <div class="ex-topbar">
        <button class="ex-back" onclick="App.backToPractice()">← Back</button>
        <span class="ex-track-pill" style="background:var(--ink)">AI Role play</span>
      </div>
      <div style="font-size:14px;color:var(--ink2);margin-bottom:20px;line-height:1.6">
        Choose a scenario. The AI plays a realistic British character. Respond naturally in English — you'll get feedback at the end.
      </div>
      ${DATA.roleplayScenarios.map(s => `
        <div class="scenario-card" onclick="startRP('${s.id}')">
          <div class="scenario-header">
            <span class="scenario-name">${s.name}</span>
            <span class="module-badge" style="background:${s.badgeBg};color:${s.color}">${s.track}</span>
          </div>
          <div class="scenario-preview">${s.preview}</div>
        </div>
      `).join('')}
    `;
    window.startRP = (id) => AI.startRoleplay(id, c);
  }

  // ─── WRITING ───────────────────────────────────────────────────────────────
  function renderWriting(c) {
    const prompts = [
      { label: 'Workplace message', prompt: 'Write a Slack message to your UK dev team saying you\'ll be 15 minutes late to the morning standup.' },
      { label: 'Client email', prompt: 'Write a short email to a dog owner explaining that their pet needs to stay overnight for observation after surgery.' },
      { label: 'Professional request', prompt: 'Write a message to your UK line manager asking for a day off next Friday for a personal appointment.' },
    ];
    let pidx = Math.floor(Math.random() * prompts.length);
    const p = prompts[pidx];

    c.innerHTML = `
      <div class="ex-topbar">
        <button class="ex-back" onclick="App.backToPractice()">← Back</button>
        <span class="ex-track-pill" style="background:var(--tech)">Writing + AI</span>
      </div>
      <div class="ex-type">${p.label}</div>
      <div class="ex-question" style="font-size:17px">${p.prompt}</div>
      <textarea class="writing-area" id="writing-input" rows="6" placeholder="Write in English..."></textarea>
      <button class="ex-next show" onclick="submitWriting()">Get AI feedback →</button>
      <div class="ex-feedback" id="writing-fb" style="margin-top:14px"></div>
    `;

    window.submitWriting = () => AI.submitWriting(
      document.getElementById('writing-input').value.trim(),
      p.prompt,
      document.getElementById('writing-fb')
    );
  }

  // ─── US → UK ───────────────────────────────────────────────────────────────
  function renderUSUK(c) {
    let idx = 0;

    function show() {
      if (idx >= DATA.usukPairs.length) {
        c.innerHTML = `
          <div class="ex-topbar">
            <button class="ex-back" onclick="App.backToPractice()">← Back</button>
          </div>
          <div style="text-align:center;padding:40px 0">
            <div style="font-family:'Playfair Display',serif;font-size:28px;margin-bottom:8px">All pairs done!</div>
            <div style="font-size:13px;color:var(--ink3);margin-bottom:28px">These will come back in vocabulary sessions</div>
            <button class="ex-next show" onclick="App.backToPractice()">Back →</button>
          </div>`;
        return;
      }
      const p = DATA.usukPairs[idx];
      c.innerHTML = `
        <div class="ex-topbar">
          <button class="ex-back" onclick="App.backToPractice()">← Back</button>
          <span class="ex-track-pill" style="background:var(--accent)">US → UK</span>
        </div>
        <div style="font-size:12px;color:var(--ink3);margin-bottom:16px">You learnt English in Boston. These are words to unlearn for UK life.</div>
        <div style="background:var(--accent-light);border:0.5px solid var(--border);border-radius:var(--r-lg);padding:22px;margin-bottom:16px">
          <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:10px">American English</div>
          <div style="font-family:'Playfair Display',serif;font-size:28px;color:var(--ink);margin-bottom:10px">${p.us}</div>
          <div style="font-size:13px;color:var(--ink3);font-style:italic">${p.context}</div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:var(--ink3)">
          <i class="ti ti-arrow-down" aria-hidden="true"></i>
        </div>
        <div id="uk-card" style="background:var(--vet-light);border:0.5px solid var(--border);border-radius:var(--r-lg);padding:22px;margin-bottom:16px;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="revealUK()">
          <span style="font-size:14px;color:var(--ink3)">Tap to reveal British English</span>
        </div>
        <button class="ex-next show" onclick="nextPair()">Next →</button>
        <div style="font-size:11px;color:var(--ink3);text-align:right;margin-top:8px">${idx + 1} / ${DATA.usukPairs.length}</div>
      `;

      window.revealUK = () => {
        document.getElementById('uk-card').innerHTML = `
          <div>
            <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--vet);margin-bottom:8px">British English</div>
            <div style="font-family:'Playfair Display',serif;font-size:28px;color:var(--ink)">${p.uk}</div>
          </div>`;
        document.getElementById('uk-card').style.cursor = 'default';
        speakWord(p.uk.split(' /')[0]);
      };
      window.nextPair = () => { idx++; show(); };
    }
    show();
  }

  return { renderGrammar, renderVocab, renderSpeak, renderRoleplayPicker, renderWriting, renderUSUK };
})();
