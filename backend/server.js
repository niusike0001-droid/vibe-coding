/* ============================================
   Vibe Coding — Backend API Server
   Design token management, code generation, project handling
   Deploy on Railway / Render / Fly.io
   ============================================ */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' }
});
app.use('/api/', limiter);

// --- Security helpers ---
const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
const SAFE_CSS_NUM = /^[\d.]+(px|em|rem|%|vh|vw|s|ms)?$/;
const SPACING_KEYS = new Set(['unit', 'gutter', 'margin', 'containerMax']);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeIdent(s, fallback) {
  if (typeof s !== 'string') return fallback;
  const cleaned = s.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/^-+/, '');
  return cleaned || fallback;
}

function validateTokens(category, data) {
  const reject = (msg) => { throw Object.assign(new Error(msg), { statusCode: 400 }); };

  if (category === 'colors') {
    if (!Array.isArray(data)) reject('Colors must be an array');
    for (const c of data) {
      if (typeof c.name !== 'string' || c.name.length > 128) reject('Invalid color name');
      if (typeof c.value !== 'string' || !HEX_COLOR.test(c.value)) reject('Invalid hex color: ' + escapeHtml(String(c.value)));
    }
  } else if (category === 'typography') {
    if (!Array.isArray(data)) reject('Typography must be an array');
    const allowed = new Set(['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']);
    for (const t of data) {
      if (typeof t.name !== 'string' || t.name.length > 64) reject('Invalid type name');
      if (typeof t.family !== 'string' || t.family.length > 128) reject('Invalid font family');
      for (const k of Object.keys(t)) {
        if (k !== 'name' && !allowed.has(k)) reject('Invalid typography key: ' + escapeHtml(k));
      }
    }
  }
}

// --- In-memory store (replace with DB in production) ---
const store = {
  tokens: {
    colors: [
      { name: 'Primary / Ink', value: '#000000', role: 'primary' },
      { name: 'Surface / Paper', value: '#FFFFFF', role: 'surface' },
      { name: 'Structural Line', value: '#E5E5E5', role: 'outline' }
    ],
    typography: [
      { name: 'Headline', family: 'Source Serif 4', size: '48px', weight: '700', lineHeight: '1.1' },
      { name: 'Body', family: 'Source Serif 4', size: '16px', weight: '400', lineHeight: '1.5' },
      { name: 'Code', family: 'JetBrains Mono', size: '13px', weight: '400', lineHeight: '1.4' },
      { name: 'Label Caps', family: 'JetBrains Mono', size: '11px', weight: '700', lineHeight: '1' }
    ],
    spacing: { unit: '4px', gutter: '24px', margin: '48px', containerMax: '1200px' },
    components: {
      shapes: '0px border-radius on all elements',
      elevation: 'No shadows — tonal layers only',
      buttons: 'Solid black / white outline / invert on active'
    }
  },
  projects: [],
  exports: []
};

// --- Health ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', uptime: process.uptime() });
});

// --- Design Tokens API ---

// GET all tokens
app.get('/api/tokens', (_req, res) => {
  res.json(store.tokens);
});

// GET token category
app.get('/api/tokens/:category', (req, res) => {
  const cat = store.tokens[req.params.category];
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  res.json(cat);
});

// PUT update tokens
app.put('/api/tokens/:category', (req, res) => {
  const { category } = req.params;
  if (!store.tokens[category]) return res.status(404).json({ error: 'Category not found' });
  try {
    validateTokens(category, req.body);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
  store.tokens[category] = req.body;
  res.json({ status: 'updated', category });
});

// --- Code Generation API ---

function sanitizeTokens(tokens) {
  const clean = {};
  if (tokens.colors && Array.isArray(tokens.colors)) {
    clean.colors = tokens.colors.map(c => ({
      name: escapeHtml(String(c.name || '')).slice(0, 128),
      value: HEX_COLOR.test(c.value) ? c.value : '#000000',
      role: safeIdent(String(c.role || ''), 'custom')
    }));
  }
  if (tokens.typography && Array.isArray(tokens.typography)) {
    clean.typography = tokens.typography.map(t => ({
      name: escapeHtml(String(t.name || '')).slice(0, 64),
      family: (t.family || '').replace(/['"\\;\{\}<>&]/g, '').slice(0, 128),
      size: SAFE_CSS_NUM.test(String(t.size || '')) ? String(t.size) : '16px',
      weight: /^[1-9]00$/.test(String(t.weight || '')) ? String(t.weight) : '400',
      lineHeight: /^[\d.]+$/.test(String(t.lineHeight || '')) ? String(t.lineHeight) : '1.5'
    }));
  }
  if (tokens.spacing && typeof tokens.spacing === 'object') {
    clean.spacing = {};
    for (const k of SPACING_KEYS) {
      if (tokens.spacing[k] !== undefined) {
        const val = String(tokens.spacing[k]).replace(/[^a-zA-Z0-9]/g, '');
        clean.spacing[k] = val || '0px';
      }
    }
  }
  return clean;
}

// POST generate CSS from tokens
app.post('/api/generate/css', (req, res) => {
  const tokens = sanitizeTokens(req.body.tokens || store.tokens);
  const minify = req.query.minify === 'true';

  const css = generateCSS(tokens, minify);
  res.set('Content-Type', 'text/css');
  res.send(css);
});

// POST generate full HTML bundle
app.post('/api/generate/bundle', (req, res) => {
  const tokens = sanitizeTokens(req.body.tokens || store.tokens);
  const css = generateCSS(tokens, false);
  const html = generateHTML(tokens, css);

  store.exports.push({
    type: 'bundle',
    timestamp: new Date().toISOString(),
    tokenVersion: req.body.version || '1.0.0'
  });

  res.set('Content-Type', 'text/html');
  res.send(html);
});

// GET export history
app.get('/api/exports', (_req, res) => {
  res.json(store.exports.slice(-20));
});

// --- Project API ---

// GET all projects
app.get('/api/projects', (_req, res) => {
  res.json(store.projects);
});

// POST create project
app.post('/api/projects', (req, res) => {
  const { name, repo } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name is required' });

  const project = {
    id: 'proj_' + Date.now().toString(36),
    name,
    repo: repo || '',
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  store.projects.push(project);
  res.status(201).json(project);
});

// --- Code Generators ---

function generateCSS(tokens, minify) {
  const nl = minify ? '' : '\n';
  const sp = minify ? '' : ' ';
  const rules = [];

  rules.push(':root {');
  if (tokens.colors) {
    tokens.colors.forEach(c => {
      const varName = '--' + safeIdent(c.role || c.name, 'color');
      const safeValue = HEX_COLOR.test(c.value) ? c.value : '#000000';
      rules.push(`  ${varName}: ${safeValue};`);
    });
  }
  if (tokens.spacing) {
    for (const k of SPACING_KEYS) {
      if (tokens.spacing[k] !== undefined) {
        rules.push(`  --spacing-${k}: ${tokens.spacing[k]};`);
      }
    }
  }
  if (tokens.typography) {
    tokens.typography.forEach(t => {
      const name = safeIdent(t.name, 'body');
      const safeFamily = (t.family || '').replace(/['"\\;\{\}]/g, '');
      rules.push(`  --font-${name}: ${t.weight} ${t.size}/${t.lineHeight} '${safeFamily}';`);
    });
  }
  rules.push('}');

  rules.push('');
  rules.push('*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }');
  rules.push('');
  rules.push('body {');
  rules.push('  font: var(--font-body);');
  rules.push('  background: var(--surface);');
  rules.push('  color: var(--primary);');
  rules.push('}');
  rules.push('');
  rules.push('.btn--primary {');
  rules.push('  background: var(--primary);');
  rules.push('  color: var(--on-primary);');
  rules.push('  border: 1px solid var(--primary);');
  rules.push('  padding: 12px 24px;');
  rules.push('  cursor: pointer;');
  rules.push('}');

  return rules.join(nl);
}

function generateHTML(tokens, css) {
  const colorCount = (tokens.colors || []).length;
  const typeCount = (tokens.typography || []).length;
  const swatches = (tokens.colors || []).map(c => {
    const safeValue = HEX_COLOR.test(c.value) ? c.value : '#000000';
    const fg = isLight(safeValue) ? '#000' : '#fff';
    return `<div class="swatch" style="background:${safeValue}; color:${fg}">
          <span>${escapeHtml(c.name)}</span><code>${escapeHtml(safeValue)}</code>
        </div>`;
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibe Coding — Generated</title>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,200..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet">
  <style>
${css}
  </style>
</head>
<body>
  <main class="app-container">
    <header>
      <h1>Vibe Coding</h1>
      <p>Design system generated from ${colorCount} color tokens, ${typeCount} type scales.</p>
    </header>
    <section class="color-palette">
      ${swatches}
    </section>
  </main>
</body>
</html>`;
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// --- Start ---
app.listen(PORT, () => {
  console.log('[Vibe Coding API] running on port ' + PORT);
  console.log('[Vibe Coding API] http://localhost:' + PORT + '/api/health');
});
