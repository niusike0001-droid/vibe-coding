/* ============================================
   Vibe Coding — App Shell
   Router, state management, PWA registration, persistence
   ============================================ */

const App = (() => {
  'use strict';

  // --- State ---
  const state = {
    currentScreen: 'dashboard',
    settings: {
      autoExport: true,
      minifyCss: false,
      includeReset: true,
      darkMode: false,
      apiUrl: '',
      apiKey: ''
    },
    exportHistory: []
  };

  // --- Persistence ---
  const STORAGE_KEY = 'vibe_coding_state';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        Object.assign(state.settings, saved.settings || {});
        state.exportHistory = saved.exportHistory || [];
        state.currentScreen = 'dashboard';
      }
    } catch (_) { /* corrupted data — use defaults */ }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: state.settings,
        exportHistory: state.exportHistory
      }));
    } catch (_) { /* storage full */ }
  }

  // --- Router ---
  function navigate(screenName) {
    const target = document.getElementById('screen-' + screenName);
    if (!target) return;

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    state.currentScreen = screenName;

    if (screenName === 'dashboard') {
      Dashboard.refresh();
    }
  }

  // --- Toast ---
  let toastTimer;

  function toast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    clearTimeout(toastTimer);

    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    document.body.appendChild(el);

    toastTimer = setTimeout(() => {
      el.classList.add('toast--hidden');
      el.addEventListener('animationend', () => el.remove());
    }, 2000);
  }

  // --- Time ---
  function updateTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const timeEl = document.getElementById('statusTime');
    if (timeEl) timeEl.textContent = h + ':' + m;
  }

  // --- Event Delegation ---
  function handleClick(e) {
    // Navigation cards
    const navCard = e.target.closest('[data-screen]');
    if (navCard) {
      const screen = navCard.dataset.screen;
      if (screen) navigate(screen);
      return;
    }

    // Toggle switches
    const toggle = e.target.closest('.toggle');
    if (toggle) {
      const key = toggle.dataset.key;
      const isOn = toggle.classList.toggle('toggle--on');
      toggle.textContent = isOn ? 'ON' : 'OFF';
      state.settings[key] = isOn;
      saveState();
      return;
    }

    // Code tabs
    const codeTab = e.target.closest('.code-tab');
    if (codeTab) {
      document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('code-tab--active'));
      codeTab.classList.add('code-tab--active');
      CodeExport.updateEditor(codeTab.dataset.file);
      return;
    }

    // Token group headers
    const tokenHeader = e.target.closest('.token-group-header');
    if (tokenHeader) {
      const body = tokenHeader.nextElementSibling;
      const arrow = tokenHeader.querySelector('.token-group-arrow');
      if (body) {
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
      }
      return;
    }
  }

  // --- Init ---
  function init() {
    loadState();
    updateTime();
    setInterval(updateTime, 30000);

    document.addEventListener('click', handleClick);

    // PWA registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Apply saved settings to UI
    Object.keys(state.settings).forEach(key => {
      const toggle = document.querySelector(`.toggle[data-key="${key}"]`);
      if (toggle && typeof state.settings[key] === 'boolean') {
        const isOn = state.settings[key];
        toggle.classList.toggle('toggle--on', isOn);
        toggle.textContent = isOn ? 'ON' : 'OFF';
      }
    });

    const apiUrlEl = document.getElementById('apiUrl');
    const apiKeyEl = document.getElementById('apiKey');
    if (apiUrlEl) apiUrlEl.value = state.settings.apiUrl;
    if (apiKeyEl) apiKeyEl.value = state.settings.apiKey;

    Dashboard.refresh();
  }

  // --- Public API ---
  return {
    init,
    navigate,
    toast,
    getState: () => state,
    saveState
  };
})();

// Settings screen actions (bound after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  document.getElementById('btnExportTokens')?.addEventListener('click', () => {
    Tokens.exportDesignMd();
  });

  document.getElementById('btnEditTokens')?.addEventListener('click', () => {
    App.toast('Token editor coming in v1.1');
  });

  document.getElementById('btnCopyCode')?.addEventListener('click', () => {
    CodeExport.copyCode();
  });

  document.getElementById('btnDownloadCode')?.addEventListener('click', () => {
    CodeExport.downloadZip();
  });

  document.getElementById('btnDeploy')?.addEventListener('click', () => {
    Deploy.deploy();
  });

  document.getElementById('btnSaveSettings')?.addEventListener('click', () => {
    const state = App.getState();
    state.settings.apiUrl = document.getElementById('apiUrl')?.value || '';
    state.settings.apiKey = document.getElementById('apiKey')?.value || '';
    App.saveState();
    App.toast('Settings saved');
  });

  document.getElementById('btnClearData')?.addEventListener('click', () => {
    if (confirm('Clear all local data? This cannot be undone.')) {
      localStorage.clear();
      App.toast('All data cleared');
      location.reload();
    }
  });

  document.getElementById('btnExportData')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(App.getState(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibe-coding-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    App.toast('Data exported');
  });
});
