const App = (() => {
  let sessionStartTime = null;
  let todayMins = parseInt(localStorage.getItem('linguauk_mins_today') || '0');
  let streak = parseInt(localStorage.getItem('linguauk_streak') || '1');
  let lastDate = localStorage.getItem('linguauk_last_date') || '';

  function init() {
    updateStreak();
    setDate();
    fillProfile();
    fillTracks();
    fillPlan();

    setTimeout(() => {
      document.getElementById('meter-fill').style.width = '34%';
      document.getElementById('splash').classList.add('hide');
      setTimeout(() => document.getElementById('splash').style.display = 'none', 600);
    }, 1200);

    if (window.speechSynthesis) window.speechSynthesis.getVoices();

    // iOS install banner
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone;
    const dismissed = localStorage.getItem('linguauk_banner_dismissed');
    if (isIOS && !isStandalone && !dismissed) showInstallBanner();
  }

  function updateStreak() {
    const today = new Date().toDateString();
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastDate !== yesterday && lastDate !== '') streak = 1;
      else if (lastDate !== '') streak++;
      localStorage.setItem('linguauk_streak', streak);
      localStorage.setItem('linguauk_last_date', today);
      localStorage.setItem('linguauk_mins_today', '0');
      todayMins = 0;
    }
    document.getElementById('streak-num').textContent = streak;
    document.getElementById('stat-streak').textContent = streak;
    document.getElementById('stat-mins').textContent = todayMins;
  }

  function setDate() {
    const opts = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('home-date').textContent = new Date().toLocaleDateString('en-GB', opts);
    const jan27 = new Date('2027-01-01');
    const days = Math.ceil((jan27 - new Date()) / 86400000);
    document.getElementById('stat-days').textContent = days;
  }

  function goScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const navMap = { home: 'nav-home', practice: 'nav-practice', 'tracks-screen': 'nav-tracks', profile: 'nav-profile', 'module-screen': 'nav-practice' };
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (navMap[id]) document.getElementById(navMap[id]).classList.add('active');
    window.scrollTo(0, 0);
  }

  function startSession() {
    sessionStartTime = Date.now();
    openModule('grammar');
  }

  function openModule(type) {
    if (!sessionStartTime) sessionStartTime = Date.now();
    goScreen('module-screen');
    const c = document.getElementById('module-content');
    switch(type) {
      case 'grammar':  Modules.renderGrammar(c); break;
      case 'vocab':    Modules.renderVocab(c); break;
      case 'speak':    Modules.renderSpeak(c); break;
      case 'roleplay': Modules.renderRoleplayPicker(c); break;
      case 'writing':  Modules.renderWriting(c); break;
      case 'usuk':     Modules.renderUSUK(c); break;
    }
  }

  function backToPractice() {
    if (sessionStartTime) {
      const mins = Math.round((Date.now() - sessionStartTime) / 60000);
      todayMins += mins;
      localStorage.setItem('linguauk_mins_today', todayMins);
      document.getElementById('stat-mins').textContent = todayMins;
      sessionStartTime = null;
    }
    goScreen('practice');
  }

  function fillTracks() {
    const c = document.getElementById('tracks-content');
    c.innerHTML = DATA.trackDetails.map(t => `
      <div class="track-detail-card" style="margin-bottom:12px">
        <div class="track-detail-header">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:10px;height:10px;border-radius:50%;background:${t.color};flex-shrink:0"></div>
            <span class="track-detail-name">${t.name}</span>
          </div>
          <span class="track-detail-level">${t.level}</span>
        </div>
        <div class="track-detail-sub">${t.desc}</div>
        <div class="track-detail-bar-bg">
          <div class="track-detail-bar-fill" style="width:${t.pct}%;background:${t.color}"></div>
        </div>
        ${t.subgoals.map(s => `
          <div class="track-subgoal">
            <span>${s.name}</span>
            <span class="track-subgoal-level">${s.level}</span>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  function fillPlan() {
    document.getElementById('plan-list').innerHTML = DATA.plan.map(p => `
      <div class="plan-item${p.current ? ' current' : ''}">
        <div class="plan-month">${p.month}${p.current ? ' · Now' : ''}</div>
        <div class="plan-focus">${p.focus}</div>
      </div>
    `).join('');
  }

  function fillProfile() {
    const jan27 = new Date('2027-01-01');
    const days = Math.ceil((jan27 - new Date()) / 86400000);
    document.getElementById('stat-days').textContent = days;
  }

  function showInstallBanner() {
    const section = document.querySelector('#home .section:first-of-type');
    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.style.marginTop = '16px';
    banner.innerHTML = `
      <div class="install-text"><strong>Install on iPhone</strong><br>Tap Share → "Add to Home Screen"</div>
      <button class="install-dismiss" onclick="App.dismissBanner(this.parentElement)">Got it</button>
    `;
    document.querySelector('#home').insertBefore(banner, document.querySelector('#home .section'));
  }

  function dismissBanner(el) {
    el.remove();
    localStorage.setItem('linguauk_banner_dismissed', '1');
  }

  return { init, goScreen, openModule, startSession, backToPractice, dismissBanner };
})();

document.addEventListener('DOMContentLoaded', App.init);
