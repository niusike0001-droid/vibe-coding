/* ============================================
   Screen: Dashboard
   ============================================ */

const Dashboard = (() => {
  'use strict';

  function refresh() {
    const state = App.getState();
    const lastEdit = document.getElementById('lastEdit');
    if (lastEdit) {
      lastEdit.textContent = state.exportHistory.length > 0
        ? state.exportHistory[state.exportHistory.length - 1].date
        : '--';
    }

    const list = document.getElementById('recentExports');
    if (!list) return;

    // Clear existing
    while (list.firstChild) list.removeChild(list.firstChild);

    if (state.exportHistory.length === 0) {
      const li = document.createElement('li');
      li.className = 'list-item list-item--empty body-md';
      li.textContent = 'No exports yet';
      list.appendChild(li);
      return;
    }

    state.exportHistory.slice(-5).reverse().forEach(e => {
      const li = document.createElement('li');
      li.className = 'list-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'body-md';
      nameSpan.textContent = e.name;

      const metaSpan = document.createElement('span');
      metaSpan.className = 'status-meta label-caps';
      metaSpan.textContent = e.date + ' — ' + e.format;

      li.appendChild(nameSpan);
      li.appendChild(metaSpan);
      list.appendChild(li);
    });
  }

  return { refresh };
})();
