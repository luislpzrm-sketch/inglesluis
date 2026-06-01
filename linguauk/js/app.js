const Nav = (() => {
  let currentTrack = null;
  let sessionStart = null;

  function init() {
    updateDate();
    updateStats();
    fillPlan();
    updateStreakDisplay();

    setTimeout(() => {
      document.getElementById('meter-fill').style.width = '34%';
      document.getElementById('splash').classList.add('hide');
      setTimeout(() => document.getElementById('splash').style.display = 'none', 600);
    }, 1200);

    if (window.speechSynthesis) window.speechSynthesis.getVoices();

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.navigator.standalone;
    if (isIOS && !localStorage.getItem('banner_dismissed')) showInstallBanner();

    // Build track detail pages
    DATA.tracks.forEach(t => buildTrackPage(t));
  }

  function updateDate() {
    const opts = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('home-date').textContent = new Date().toLocaleDateString('en-GB', opts);
  }

  function updateStreakDisplay() {
    const streak = parseInt(localStorage.getItem('luk_streak') || '1');
    document.getElementById('streak-num').textContent = streak;
    document.getElementById('stat-streak').textContent = streak;
  }

  function updateStats() {
    const jan27 = new Date('2027-01-01');
    const days = Math.ceil((jan27 - new Date()) / 86400000);
    document.getElementById('stat-days').textContent = days;
    document.getElementById('stat-mins').textContent = localStorage.getItem('luk_mins_today') || '0';
  }

  function fillPlan() {
    document.getElementById('plan-list').innerHTML = DATA.plan.map(p => `
      <div class="plan-item${p.current ? ' current' : ''}">
        <div class="plan-month">${p.months}${p.current ? ' · Now' : ''}</div>
        <div class="plan-focus">${p.focus}</div>
      </div>
    `).join('');
  }

  function buildTrackPage(track) {
    const mods = DATA.modules[track.id] || [];
    const page = document.getElementById('track-' + track.id);
    if (!page) return;

    page.querySelector('.topbar-title').textContent = track.name;
    page.querySelector('.topbar-sub').textContent = `Level ${track.level} · Active`;

    const grid = page.querySelector('.module-grid');
    grid.innerHTML = mods.map(m => `
      <div class="module-card" onclick="Nav.openModule('${track.id}', '${m.id}')">
        <i class="ti ${m.icon} module-icon" style="color:${track.color}" aria-hidden="true"></i>
        <div class="module-name">${m.name}</div>
        <div class="module-desc">${m.desc}</div>
        ${m.ai ? `<span class="module-badge" style="background:${track.light};color:${track.color}">AI powered</span>` : ''}
        ${m.badge ? `<span class="module-badge" style="background:#FAECE7;color:#993C1D">${m.badge}</span>` : ''}
      </div>
    `).join('');
  }

  function goScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    updateNav(id);
    window.scrollTo(0, 0);
  }

  function updateNav(screenId) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const map = {
      'home': 'nav-home',
      'track-everyday': 'nav-everyday',
      'track-vet': 'nav-vet',
      'track-tech': 'nav-tech',
      'profile': 'nav-profile',
      'module-screen': null,
    };
    const navId = map[screenId];
    if (navId) document.getElementById(navId)?.classList.add('active');
  }

  function openModule(trackId, moduleId) {
    currentTrack = trackId;
    sessionStart = sessionStart || Date.now();
    goScreen('module-screen');
    const c = document.getElementById('module-content');

    switch(moduleId) {
      case 'ev-vocab':
      case 'vet-vocab':
      case 'tech-vocab':   Modules.renderVocab(trackId, c); break;
      case 'ev-grammar':
      case 'vet-grammar':
      case 'tech-grammar': Modules.renderGrammar(trackId, c); break;
      case 'ev-speak':
      case 'vet-speak':
      case 'tech-speak':   Modules.renderSpeak(trackId, c); break;
      case 'ev-role':
      case 'vet-client':
      case 'vet-handover':
      case 'tech-stand':
      case 'tech-review':
      case 'tech-inter':   Modules.renderRoleplayPicker(trackId, c); break;
      case 'vet-notes':
      case 'ev-write':
      case 'tech-write':   Modules.renderWriting(trackId, c); break;
      case 'vet-proto':    Modules.renderProtocolCheck(c); break;
      case "usuk":         Modules.renderUSUK(c); break;
      case "ev-fill":
      case "vet-fill":
      case "tech-fill":   Modules.renderFillBlank(trackId, c); break;
      case "ev-read":
      case "vet-read":
      case "tech-read":   Modules.renderReading(trackId, c); break;
      default:             Modules.renderVocab(trackId, c);
    }
  }

  function backFromModule() {
    if (sessionStart) {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart) / 60000));
      const prev = parseInt(localStorage.getItem('luk_mins_today') || '0');
      localStorage.setItem('luk_mins_today', prev + mins);
      document.getElementById('stat-mins').textContent = prev + mins;
      sessionStart = null;
    }
    if (currentTrack) goScreen('track-' + currentTrack);
    else goScreen('home');
  }

  function startSession() {
    sessionStart = Date.now();
    goScreen('track-everyday');
  }

  function showInstallBanner() {
    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.id = 'install-banner';
    banner.innerHTML = `
      <div class="install-text"><strong>Install on iPhone</strong> — tap Share → "Add to Home Screen"</div>
      <button class="install-dismiss" onclick="Nav.dismissBanner()">✕</button>
    `;
    const home = document.getElementById('home');
    home.insertBefore(banner, home.querySelector('.section'));
  }

  function dismissBanner() {
    document.getElementById('install-banner')?.remove();
    localStorage.setItem('banner_dismissed', '1');
  }

  return { init, goScreen, openModule, backFromModule, startSession, dismissBanner };
})();

document.addEventListener('DOMContentLoaded', Nav.init);
