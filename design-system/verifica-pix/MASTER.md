# Verifica Pix Design System

This file is the compact implementation contract. Product rationale lives in
`PRODUCT.md`; visual rationale lives in `DESIGN.md`.

## Foundations

- Primary: Verifica green, `oklch(0.63 0.15 145)`.
- Structural: Verifica navy, `oklch(0.29 0.065 250)`.
- Surfaces: warm green-tinted paper, never pure white.
- Heading: Francy with Sora fallback.
- Body and UI: Plus Jakarta Sans.
- Code and identifiers: Roboto Mono.
- Base spacing unit: 4px.
- Content grid: 12 columns, 1240px maximum.

## Interaction Contract

- Minimum pointer target: 44px.
- Visible `:focus-visible` ring on every interactive element.
- Hover cannot change layout geometry.
- Use icon plus label for risk status.
- Respect `prefers-reduced-motion`.
- Mobile navigation must be keyboard-operable and dismissible with Escape.

## Content Contract

- Say "risco aparente", never "fraude confirmada".
- Always recommend confirmation in the receiving bank account.
- Lead with the next action, then explain the evidence.
- Avoid fear, celebration and absolute safety claims.

## Component Contract

- Buttons: 10px radius, semibold, 44px minimum height.
- Panels: full 1px border, 14px to 18px radius.
- Badges: compact pill with icon and explicit text.
- Tables: row headers, visible dividers, overflow wrapper on small screens.
- Callouts: tonal background and full border, never a colored side stripe.

## Quality Gates

- WCAG 2.2 AA target.
- Test at 375, 768, 1024 and 1440px.
- No emojis as icons.
- No gradient text or decorative blur.
- No generic repeated card grids.
- No broken internal links.
