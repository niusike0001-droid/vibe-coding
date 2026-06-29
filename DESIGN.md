---
name: Vibe Coding 1.0
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
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
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
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
The brand personality is uncompromising, clinical, and intellectual. It adopts a **High-Contrast / Minimalist** aesthetic that leans into the raw utility of code and the permanence of print. The UI is designed to evoke a sense of focused isolation, removing all chromatic noise to prioritize the logic and rhythm of the content.

The design system utilizes a "Paper and Ink" philosophy. There are no gradients, no blurs, and no decorative colors. Every pixel must serve a functional purpose. The emotional response is one of "Professional Cold"—a state of high-performance clarity where the interface disappears, leaving only the structural integrity of the workspace.

## Colors
The palette is strictly binary. By stripping away all color, including the previous green accents, the system relies entirely on value and weight to establish hierarchy.

- **Primary / Ink:** `#000000`. Used for all typography, icons, and primary action states.
- **Surface / Paper:** `#FFFFFF`. The universal background for all views and containers.
- **Accents:** Strictly black. Any "active" state or highlight is represented by inverted values (white text on black background) or increased stroke weight.
- **Structural Lines:** `#E5E5E5` or `#000000` at low opacity. Used for grid lines and dividers to maintain layout without breaking the high-contrast flow.

## Typography
The "Professional Cold" aesthetic is driven by **Source Serif 4**. It provides a literary, authoritative tone that contrasts with the technical nature of "coding." 

- **Headlines:** Set with tight leading and slight negative tracking. Use heavy weights to create "ink blocks" on the page.
- **Body:** Generous line height to ensure readability against the stark white background.
- **Technical Elements:** **JetBrains Mono** is used for labels, metadata, and code snippets to ground the system in its developer-centric roots.
- **Alignment:** Consistent left-alignment is preferred. Justified text may be used in specific editorial blocks to enhance the "print" feel.

## Layout & Spacing
The layout uses a **fixed grid** model inspired by brutalist architecture and technical blueprints. 

- **Grid:** A 12-column grid with visible dividers. Vertical and horizontal lines should be used to "box in" content sections.
- **Margins:** Aggressive white space at the edges of the viewport (48px+) to frame the content.
- **Rhythm:** All spacing is derived from a 4px baseline. Components should snap to this grid to maintain a disciplined, "engineered" look.
- **Responsive:** On mobile, margins reduce to 16px and the 12-column grid collapses to a single column, but the visible divider lines remain to separate logical blocks.

## Elevation & Depth
This design system rejects shadows and blurs. Depth is communicated exclusively through **Tonal Layering** and **Line Weight**.

- **Level 0:** The base `#FFFFFF` surface.
- **Level 1:** Containers defined by a 1px `#000000` border.
- **Active State:** Complete inversion. A selected item or primary button becomes a solid `#000000` block with `#FFFFFF` content.
- **Separation:** Use thin horizontal and vertical rules (hairlines) to define sections rather than using background offsets or shadows.

## Shapes
The shape language is **Sharp**. Every corner is 0px. This reinforces the "Stark" and "Cold" brand pillars. 

Circular elements are only permitted for user avatars or specific status indicators to provide a solitary point of visual relief. All buttons, inputs, cards, and containers must maintain 90-degree angles.

## Components
- **Buttons:** Primary buttons are solid black rectangles with white serif text. Secondary buttons are white with a 1px black border. Hover states should flicker/invert instantly with no transition duration.
- **Inputs:** Simple bottom-border only or full 1px border. Label text should use the `label-caps` JetBrains Mono style.
- **Cards:** Defined by 1px black borders. No shadows. Content inside is heavily padded to prevent "crowding" the stark lines.
- **Lists:** Separated by 1px horizontal hairlines. Use a small black square or a "dash" as a bullet point.
- **Status Indicators:** Since color is removed, use symbols (●, ○, ■, □) or text labels (TRUE/FALSE, ON/OFF) in JetBrains Mono to indicate state.
- **Dividers:** Use `border-top: 1px solid #000000` for primary sections and `1px solid #E5E5E5` for secondary groupings.