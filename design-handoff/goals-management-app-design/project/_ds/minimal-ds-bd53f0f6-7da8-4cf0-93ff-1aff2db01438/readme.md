# Minimal DS

A clean, minimal design system built around an indigo primary palette, Inter typeface, and an 8px spacing grid. Intended as a general-purpose UI foundation — suitable for dashboard applications, admin tools, and task management interfaces.

**No external codebase or Figma file was provided.** This system was constructed from the specification: colors, font, radius, spacing, and component list defined by the user.

---

## Visual Foundations

### Colors
- **Primary:** `#4F46E5` indigo — buttons, links, focus rings, active states
- **Background:** `#F8FAFC` — page canvas; very light cool gray
- **Surface:** `#FFFFFF` — card and panel backgrounds
- **Text:** `#1E293B` — near-black slate; `#64748B` muted; `#94A3B8` subtle
- **Success:** `#16A34A` green; **Warning:** `#F59E0B` amber; **Error:** `#DC2626` red
- **Borders:** `#E2E8F0` standard; `#F1F5F9` light dividers

Semantic colors always come in a main + light pair (e.g. `#16A34A` + `#DCFCE7`) for use on status pills and alert backgrounds.

### Typography
- **Family:** Inter (Google Fonts CDN). No custom font files provided — Google Fonts CDN is the source of truth.
- **Scale:** 11 → 36px. Base UI text is 15px / 400.
- **Weights:** 400 regular, 500 medium, 600 semibold, 700 bold.
- **Headings:** 600–700 weight, tight leading (1.25).
- **Body:** 400–500 weight, relaxed leading (1.5).
- **Labels / caps:** 11px / 600 / letter-spacing 0.08em / uppercase.

### Spacing
8px base grid. Tokens: `--space-1` (4px) through `--space-24` (96px). Component padding follows the same scale. Prefer multiples of 8; use 4px for micro-gaps within components.

### Radii
Default card radius is **12px** (`--radius-lg`). Buttons and inputs use `--radius-md` (8px). Status pills use `--radius-full` (pill). Avoid mixing radii within a single surface.

### Shadows
Four levels: `xs` (hairline), `sm` (card default), `md` (elevated panel), `lg` (modal / dropdown). Shadows use low-opacity black — no colored shadows.

### Motion
Transitions at **120ms** for interactive state changes (hover, focus, press). Progress bar fill animates at **400ms** with cubic-bezier easing. No decorative loops or spring animations.

### Hover / Press states
- Buttons: darken background by one step (primary → `#4338CA` → `#3730A3`).
- Ghost / secondary: light tinted fill on hover.
- Focus: 3px indigo ring at 18% opacity (`--ring-focus`).

### Cards
White background, `border-radius: 12px`, `1px solid #E2E8F0` border, `shadow-sm` by default. Padding 24px. No colored left-border accents.

---

## Content Fundamentals

- **Tone:** Clear, direct, minimal. No filler copy.
- **Casing:** Sentence case for UI labels and headings. ALL CAPS only for section-header captions (11px label style).
- **Language:** Default labels in Uzbek (Bajarildi, Kutilmoqda, Qoralama). Override with `label` prop for other locales.
- **Emoji:** Not used.

---

## Iconography

No icon library was specified. No icon assets were provided. Recommend integrating **Lucide Icons** (CDN: `https://unpkg.com/lucide@latest`) — stroke-based, consistent weight, pairs well with Inter. Document this choice if adopted.

**Intentional additions:** No icons are bundled. Consumers are expected to bring their own icon layer.

---

## Components

| Name | Path | Description |
|---|---|---|
| `Button` | `components/core/Button.jsx` | Primary / secondary / ghost action buttons |
| `Card` | `components/core/Card.jsx` | White surface container with shadow + radius |
| `Input` | `components/core/Input.jsx` | Labeled text input with focus, error, prefix/suffix |
| `StatusTag` | `components/core/StatusTag.jsx` | Pill status indicator (success / pending / error / info / draft) |
| `ProgressBar` | `components/core/ProgressBar.jsx` | Animated horizontal progress bar with optional label |

---

## File Index

```
styles.css                  → entry point; imports all tokens
tokens/
  colors.css                → --color-* custom properties
  typography.css            → --font-*, --text-*, --weight-*, --leading-*, --tracking-*
  spacing.css               → --space-*, --gap-*, --pad-*, --radius-*, --shadow-*
components/core/
  Button.jsx / .d.ts        → action button
  Card.jsx / .d.ts          → surface container
  Input.jsx / .d.ts         → text input
  StatusTag.jsx / .d.ts     → status pill
  ProgressBar.jsx / .d.ts   → progress indicator
  components.card.html      → @dsCard specimen
guidelines/
  colors-primary.card.html  → primary palette card
  colors-neutral.card.html  → neutral palette card
  colors-semantic.card.html → semantic palette card
  type-display.card.html    → heading type scale
  type-body.card.html       → body + UI type
  spacing-scale.card.html   → 8px grid visualization
  radius-shadow.card.html   → radii + shadow depths
ui_kits/app/
  index.html                → interactive app UI kit
readme.md                   → this file
SKILL.md                    → agent skill descriptor
```

---

## Intentional Additions
- **Ghost button variant** — not in the original spec but standard for tertiary actions.
- **Draft status** in StatusTag — neutral gray for unpublished content.
- **Info status** in StatusTag — completes the semantic set alongside success/warning/error.
