---
name: Emerald Umami
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#414846'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#717976'
  outline-variant: '#c1c8c4'
  surface-tint: '#43655c'
  primary: '#01261f'
  on-primary: '#ffffff'
  primary-container: '#1a3c34'
  on-primary-container: '#83a69c'
  inverse-primary: '#aacec3'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#20221f'
  on-tertiary: '#ffffff'
  tertiary-container: '#353734'
  on-tertiary-container: '#9fa09c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c5eadf'
  primary-fixed-dim: '#aacec3'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#2b4d44'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e3e3de'
  tertiary-fixed-dim: '#c6c7c2'
  on-tertiary-fixed: '#1a1c19'
  on-tertiary-fixed-variant: '#454744'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The brand personality is rooted in "Quiet Luxury Gastronomy"—an aesthetic that bridges traditional Asian minimalism with modern, high-end culinary precision. The target audience consists of discerning epicureans who value ingredient integrity and serene dining environments.

The design style is **Minimalism** with subtle **Tonal Layering**. It prioritizes heavy white space, extreme typographic clarity, and a restrained color palette. The emotional response should be one of calm, focus, and prestige, evoking the atmosphere of a private omakase counter or a contemporary tea house. Visual clutter is eliminated to let photography and essential information breathe.

## Colors
The palette shifts from a high-energy red to a **Deep Gastronomy Green** (#1A3C34), symbolizing freshness, longevity, and sophistication. This primary green is used for key brand moments and high-level navigation. 

A muted gold (#D4AF37) serves as a secondary accent for subtle highlights, while the background relies on a "Warm Paper" neutral (#F5F5F0) to prevent the clinical feel of pure white. Text is set in a "Charcoal Bone" (#2D2926) to maintain high legibility without the harshness of pure black. Use the `primary-container` for soft background fills in cards or selection states to maintain the tonal aesthetic.

## Typography
The typographic system creates a tension between the traditional and the modern. **Noto Serif** is used for headlines and display elements, providing an authoritative, editorial feel that mimics high-end menus. **Plus Jakarta Sans** provides a clean, approachable counterpoint for body text and interface labels.

Use `label-caps` for small metadata, categories, or overlines to add a structured, architectural feel to the layout. Ensure `display-lg` transitions to `display-lg-mobile` on smaller viewports to maintain vertical rhythm and prevent awkward line breaks.

## Layout & Spacing
The system utilizes a **Fixed Grid** on desktop (12 columns) and a **Fluid Grid** on mobile (4 columns). The spacing philosophy is generous, favoring "Stack" patterns that create a clear vertical hierarchy. 

Margins are wider than standard industry defaults to frame content like a piece of art. Use the `stack-lg` (32px) for separating major sections, while `stack-sm` (8px) handles internal component spacing (e.g., label to input field). Elements should align strictly to the 8px baseline grid to maintain a disciplined, structured appearance.

## Elevation & Depth
Depth is expressed through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. In this design system, elevation is "flat but layered." 

- **Level 0 (Base):** The primary background color.
- **Level 1 (Cards/Surface):** A subtle shift in color (using `surface-variant`) or a 1px solid border in `outline` color.
- **Level 2 (Overlays):** Used for modals or dropdowns, utilizing a very soft, highly diffused ambient shadow (10% opacity of the primary green) to suggest a gentle lift without breaking the minimalist aesthetic.
- **Interactive States:** Instead of shadows, use subtle color shifts or the addition of a 1px inner border to indicate focus or hover.

## Shapes
The shape language is **Soft**. Sharp corners are avoided to remain welcoming, but excessive roundness (pill shapes) is avoided to maintain a professional, architectural rigor. A 4px (0.25rem) base radius is the standard for buttons and input fields. Larger containers like cards may use the `rounded-lg` (8px) setting to create a clear visual distinction between small UI elements and structural layout blocks.

## Components
- **Buttons:** Primary buttons use the deep green background with white text. Secondary buttons are outlined in `outline` color with green text. Use high horizontal padding (24px+) for a premium, elongated look.
- **Chips:** Small, rectangular with `rounded-sm` corners. Use `primary-container` backgrounds with `on-primary-container` text for active states.
- **Input Fields:** Minimalist design with only a bottom border or a very light `outline` border. Use `Plus Jakarta Sans` for placeholder text in a muted grey.
- **Lists:** Clean dividers using 1px `outline` color. Increase vertical padding to 16px between list items to enhance readability and a "premium" sense of space.
- **Cards:** No shadows. Use a 1px border or a subtle fill change. Photography within cards should be full-bleed at the top to emphasize the "Gastronomy" focus.
- **Interactive Elements:** Checkboxes and Radio buttons use the primary green for selected states, maintaining a thin, elegant stroke weight.