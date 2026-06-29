/* ============================================
   Screen: Design Tokens
   ============================================ */

const Tokens = (() => {
  'use strict';

  function exportDesignMd() {
    const state = App.getState();
    const md = generateDesignMd(state);

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DESIGN.md';
    a.click();
    URL.revokeObjectURL(url);

    state.exportHistory.push({
      name: 'DESIGN.md',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      format: 'Markdown'
    });
    App.saveState();
    App.toast('DESIGN.md exported');
  }

  function generateDesignMd(state) {
    return `---
name: Vibe Coding 1.0
colors:
  surface: '#f9f9f9'
  primary: '#000000'
  on-primary: '#ffffff'
  outline: '#E5E5E5'
typography:
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Source Serif 4
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin: 48px
  container-max: 1200px
---

## Brand & Style
High-Contrast / Minimalist. "Paper and Ink" philosophy.
No gradients, no blurs, no decorative colors.

## Colors
- **Primary / Ink:** #000000
- **Surface / Paper:** #FFFFFF
- **Structural Lines:** #E5E5E5

## Typography
- **Headlines:** Source Serif 4 — tight leading, negative tracking
- **Body:** Source Serif 4 — generous line height
- **Code/Labels:** JetBrains Mono

## Components
- **Buttons:** Solid black rectangles with white serif text.
- **Cards:** 1px black border, 0px radius, no shadows.
- **Dividers:** 1px solid #000 or #E5E5E5.
- **Shapes:** Sharp. Every corner is 0px.
`;
  }

  return { exportDesignMd };
})();
