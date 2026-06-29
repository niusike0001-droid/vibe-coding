/* ============================================
   Screen: Code Export
   ============================================ */

const CodeExport = (() => {
  'use strict';

  const files = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Vibe Coding</title>
</head>
<body>
  <div class="app">
    <header class="header">
      <h1>Vibe Coding</h1>
    </header>
    <main>
      <!-- Design system components here -->
    </main>
  </div>
</body>
</html>`,

    'style.css': `/* Vibe Coding Design System */
:root {
  --ink: #000000;
  --paper: #FFFFFF;
  --line: #E5E5E5;
  --font-serif: 'Source Serif 4', serif;
  --font-mono: 'JetBrains Mono', monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font: 400 16px/1.5 var(--font-serif);
  background: var(--paper);
  color: var(--ink);
}

h1 { font: 700 32px/1.2 var(--font-serif); letter-spacing: -0.01em; }

.card {
  border: 1px solid var(--ink);
  padding: 24px;
}

.btn {
  padding: 12px 24px;
  font: 700 11px/1 var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid var(--ink);
  background: var(--paper);
  cursor: pointer;
}

.btn--primary {
  background: var(--ink);
  color: var(--paper);
}

@media (min-width: 768px) {
  h1 { font-size: 48px; letter-spacing: -0.02em; }
}`,

    'tokens.json': JSON.stringify({
      name: "Vibe Coding 1.0",
      colors: {
        primary: "#000000",
        surface: "#FFFFFF",
        line: "#E5E5E5"
      },
      typography: {
        headline: { family: "Source Serif 4", size: "48px", weight: "700", lineHeight: "1.1" },
        body: { family: "Source Serif 4", size: "16px", weight: "400", lineHeight: "1.5" },
        code: { family: "JetBrains Mono", size: "13px", weight: "400", lineHeight: "1.4" }
      },
      spacing: { unit: "4px", gutter: "24px", margin: "48px" },
      components: {
        shapes: "0px border-radius",
        elevation: "No shadows — tonal layers only",
        buttons: "Solid black / outline / invert"
      }
    }, null, 2)
  };

  function updateEditor(fileName) {
    const display = document.getElementById('codeDisplay');
    if (display && files[fileName]) {
      display.textContent = files[fileName];
    }
  }

  function copyCode() {
    const code = document.getElementById('codeDisplay')?.textContent || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => App.toast('Code copied'));
    } else {
      App.toast('Clipboard not available');
    }
  }

  function downloadZip() {
    const state = App.getState();

    // Build a simple combined file (browser JSZip not available, so we do a single .html bundle)
    const bundle = `<!-- Vibe Coding Design System Export -->
<!-- Generated: ${new Date().toISOString()} -->

${files['index.html']}

<!-- Inline style.css -->
<style>
${files['style.css']}
</style>
`;

    const blob = new Blob([bundle], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibe-coding-export.html';
    a.click();
    URL.revokeObjectURL(url);

    state.exportHistory.push({
      name: 'vibe-coding-export.html',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      format: 'HTML bundle'
    });
    App.saveState();
    App.toast('Bundle downloaded');
  }

  return { updateEditor, copyCode, downloadZip };
})();
