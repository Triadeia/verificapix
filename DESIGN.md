# Verifica Pix Design Direction

## Physical Scene

A merchant checks a receipt on a bright counter while customers are waiting. The
interface must remain calm, readable and decisive under pressure. Light mode is the
primary environment; navy sections provide moments of focus and authority.

## Visual Concept

"Operational proof sheet": a precise digital workspace influenced by receipts,
checklists and evidence review. The system combines a rigorous grid with generous
breathing room and realistic product UI.

## Color Strategy

Committed green and navy palette with warm, green-tinted neutrals.

```css
--vp-green-600: oklch(0.63 0.15 145);
--vp-green-700: oklch(0.53 0.13 145);
--vp-navy-900:  oklch(0.29 0.065 250);
--vp-navy-950:  oklch(0.22 0.045 250);
--vp-paper:     oklch(0.985 0.006 145);
--vp-ink:       oklch(0.24 0.025 250);
```

Green communicates progress, verification activity and positive apparent risk.
Navy carries navigation, headings and high-attention surfaces. Amber and red are
reserved for evidence status.

## Typography

Francy remains the official display face when licensed web files are available.
Sora is the public web fallback for headings. Plus Jakarta Sans is the body and UI
face. Roboto Mono is limited to tokens, receipt identifiers and code.

- Hero: `clamp(3rem, 7vw, 6.8rem)`, tight leading.
- Page title: `clamp(2.5rem, 5vw, 4.8rem)`.
- Section title: `clamp(1.8rem, 3vw, 3rem)`.
- Body: 1rem to 1.125rem, maximum 70ch.
- UI label: 0.75rem to 0.875rem, medium or semibold.

## Layout

- Marketing home uses a 12-column composition and asymmetric product preview.
- Documentation uses a persistent left navigation, reading column and optional
  on-page index.
- Main content width: 1240px.
- Reading measure: 720px.
- Section spacing uses fluid values and alternates dense reference areas with
  generous narrative pauses.

## Shape

Use 10px to 18px radii for product surfaces. Pills are reserved for compact statuses
and filters. Use full borders and tonal backgrounds; do not use colored side stripes.

## Elevation

Most surfaces are flat with a visible border. Product screenshots use one broad,
soft navy-tinted shadow. Avoid stacked floating cards.

## Components

- Global header with product/brand switch and primary CTA.
- Documentation sidebar with grouped navigation and current-page state.
- Evidence rows with label, value and explicit status.
- Risk status badge containing both icon and text.
- Token row with value, usage and copy action.
- Do/avoid comparison using two distinct columns.
- Responsive table with horizontal overflow and clear row headers.
- Inline callout with full border, icon and action.

## Motion

Motion explains state change. Use opacity and transform only, with an exponential
ease-out. Typical duration is 180ms for controls and 420ms for page reveals.
Risk and error states do not bounce, pulse or celebrate. Respect
`prefers-reduced-motion`.

## Imagery

The main imagery is the Verifica Pix product itself: receipt analysis panels,
evidence timelines, status summaries and owner notifications. Brand pages may use
logo specimens and enlarged interface fragments. Decorative stock photography is
not required.

## Responsive Rules

- 375px: single column, drawer navigation, tables scroll horizontally.
- 768px: two-column comparisons and compact product panels.
- 1024px: persistent documentation sidebar.
- 1440px: full reading column plus on-page navigation.

## Prohibited Patterns

- Repeated icon-title-description card grids.
- Emojis as interface icons.
- Gradient text.
- Decorative glassmorphism.
- Pure black or pure white.
- Color-only status communication.
- Absolute claims such as "Pix confirmado" based only on receipt analysis.
