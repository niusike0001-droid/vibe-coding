/* ============================================
   Screen: Deploy
   ============================================ */

const Deploy = (() => {
  'use strict';

  async function deploy() {
    const repoInput = document.getElementById('githubRepo');
    const repo = repoInput?.value?.trim();

    if (!repo) {
      App.toast('Enter a GitHub repo (e.g. username/repo)');
      return;
    }

    const logEl = document.getElementById('deployLog');
    const logOutput = document.getElementById('logOutput');
    if (logEl) logEl.style.display = 'block';

    function log(msg) {
      if (logOutput) logOutput.textContent += msg + '\n';
    }

    logOutput.textContent = '';
    log('[DEPLOY] Starting deployment...');
    log('[DEPLOY] Target: https://github.com/' + repo);
    log('[DEPLOY] Step 1/4: Validating repository...');

    try {
      const resp = await fetch('https://api.github.com/repos/' + repo);
      if (!resp.ok) {
        log('[ERROR] Repository not found. Create it first at https://github.com/new');
        return;
      }
      log('[OK] Repository found.');

      log('[DEPLOY] Step 2/4: Preparing deployment package...');
      log('[DEPLOY] Files: index.html, style.css, manifest.json, sw.js, js/...');

      log('[DEPLOY] Step 3/4: Push to main branch...');
      log('[INFO] Run these commands in your terminal:');
      log('');
      log('  cd stitch-app');
      log('  git init');
      log('  git add -A');
      log('  git commit -m "Vibe Coding v1.0 — Design System PWA"');
      log('  git branch -M main');
      log('  git remote add origin https://github.com/' + repo + '.git');
      log('  git push -u origin main');
      log('');
      log('[DEPLOY] Step 4/4: Enable GitHub Pages...');
      log('[INFO] Go to: https://github.com/' + repo + '/settings/pages');
      log('[INFO] Set source to "Deploy from a branch" → "main" → "/ (root)"');
      log('[INFO] Your app will be live at: https://<username>.github.io/' + repo.split('/')[1] + '/');
      log('');
      log('[SUCCESS] Deployment guide ready! Follow the steps above.');

      const state = App.getState();
      state.exportHistory.push({
        name: 'Deploy: ' + repo,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        format: 'GitHub Pages'
      });
      App.saveState();

    } catch (err) {
      log('[ERROR] Network error: ' + err.message);
      log('[INFO] Check your internet connection and try again.');
    }
  }

  return { deploy };
})();
