# Design System — CLAUDE.md

## Context
Multi-brand health insurance landing page pipeline for **Sanna**, **Pacifico**, and **Tsana** brands.
Scope: landing pages, multi-step forms, plan comparison, confirmation, login/register + component library.
**HTML and CSS only.** No frameworks, no libraries. Use CSS custom properties for all values — never hardcode.

**Active brand: Pacifico** — set in `tokens/aliases.css`

> For coding rules, import order, layout patterns, and component catalogue — see `design-system-codegen/REFERENCE.md`.
> For visual quality and composition principles — see `design-taste/REFERENCE.md`.
> Consult these when you need specifics. They are references, not required pre-reads.

---

## Architecture

```
/
├── tokens/
│   ├── global.css           ← Shared tokens (neutral, feedback, typography, spacing, etc.)
│   ├── base.css             ← Reset + body defaults + skip-link utility
│   ├── sanna.css            ← Sanna raw brand tokens
│   ├── pacifico.css         ← Pacifico raw brand tokens
│   ├── tsana.css            ← Tsana raw brand tokens
│   ├── aliases.css          ← Semantic bridge → active brand (currently Pacifico)
│   └── aliases-sanna.css    ← Semantic bridge → Sanna brand
├── components/
│   └── [name].html + [name].css   ← button, text-field, accordion, radio-button, etc.
├── design-system-codegen/
│   ├── REFERENCE.md         ← Token rules, import order, HTML patterns, layout
│   └── references/visual-patterns.md
├── design-taste/
│   └── REFERENCE.md         ← Visual quality standard (Alan-inspired principles)
├── logos/                   ← Brand SVG logos (Negative × Isologo variants)
├── assets/                  ← Photo assets (see Assets section below)
├── fonts/                   ← Local Roboto woff2 + roboto.css
├── reference/               ← Visual reference screenshots
└── vercel.json              ← Rewrites / → pages/sanna-checkup/ (single page deployment)
```

### Multi-brand
1. Brand files define raw tokens prefixed with brand name (`--sanna-*`, `--pacifico-*`, `--tsana-*`)
2. `aliases.css` maps `--color-brand-*` semantic names to the active brand's raw tokens
3. Components and pages **only** use `--color-brand-*` aliases — never raw brand tokens
4. To use Sanna brand on a page: import `tokens/aliases-sanna.css` instead of `tokens/aliases.css`

### CSS import order (pages)
```html
<link rel="stylesheet" href="../../fonts/roboto.css" />
<link rel="stylesheet" href="../../tokens/global.css" />
<link rel="stylesheet" href="../../tokens/[brand].css" />
<link rel="stylesheet" href="../../tokens/aliases[-brand].css" />
<link rel="stylesheet" href="../../tokens/base.css" />
<link rel="stylesheet" href="page.css" />
```
Never use `@import` — always `<link>` tags in this order.

Also add `<base href="/pages/[name]/" />` as the first tag inside `<head>` so that relative asset paths resolve correctly under Vercel rewrites.

---

## Core rules

- **No hardcoded values** — every color, size, spacing, radius, shadow, transition uses a CSS custom property
- **No brand-prefixed tokens in CSS** — use `--color-brand-*` aliases only
- **BEM kebab-case** class names throughout: `.block__element--modifier`
- **Semantic HTML** — `<nav>`, `<main>`, `<section>`, `<footer>`, `<form>`, etc.
- **Skip link** as first element on every page: `<a href="#main" class="skip-link">Ir al contenido</a>`
- **`<main id="main">`** on all pages
- **Focus styles** on all interactive elements: `outline: 2px solid var(--color-brand-primary-medium); outline-offset: 2px;`
  On dark surfaces: use `var(--neutral-color-xlow)` as outline color
- **Interactive element minimum height**: `var(--size-touch)` (44px), ideally `var(--size-input)` (48px)
- **Mobile-first** breakpoints: sm 480px · md 768px · lg 1024px · xl 1280px
- **Transitions**: `var(--transition-base)` for state changes · `var(--transition-slow)` for animations

---

## Token quick-reference

Token values live in the CSS files. Names to know:

| What | Token pattern |
|------|---------------|
| Brand colors | `--color-brand-primary-[xhigh·high·medium·low·xlow]` |
| Brand accent | `--color-brand-secondary-[xhigh·high·medium·low·xlow]` |
| Text | `--neutral-color-xhigh` (primary) · `--neutral-color-medium` (secondary) |
| Backgrounds | `--neutral-color-low` (page) · `--neutral-color-xlow` (cards) |
| Feedback | `--feedback-color-[success·danger·warning·info]-[scale]` |
| Font size | `--font-size-[xs·s·m·l·xl·2xl·3xl·4xl]` |
| Font weight | `--font-weight-[light·regular·medium·bold]` |
| Spacing | `--spacing-[2xs·xs·s·m·l·xl·2xl·3xl·4xl·5xl·6xl]` |
| Border radius | `--border-radius-[none·small·medium·large·circular]` |
| Shadows | `--shadow-[down·up]-[small·medium·large]` |
| Z-index | `--z-[base·raised·sticky·dropdown·tooltip·modal]` |
| Sizing | `--size-input` (48px) · `--size-touch` (44px) · `--size-icon-[ui·step·feature]` |

**Context rules:**
- Landing CTAs → `--color-brand-secondary-medium`
- Form navigation / data labels → `--color-brand-primary-medium`
- Page background → `--neutral-color-low` (grey, not white)
- Card/surface → `--neutral-color-xlow`

---

## Component catalogue

All in `components/[name].html + [name].css`:

`button` · `text-field` · `checkbox` · `radio-button` · `dropdown` · `search-input` · `stepper` · `accordion` · `pill-tabs` · `badge` · `tag` · `tooltip` · `alert`

When building pages, copy needed component styles into the page CSS rather than linking component files directly.

---

## Visual Reference

Available as optional reference. Only read a specific screenshot if directly asked or if the task explicitly requires matching a particular page layout. Do not load these proactively.

| File | Description |
|------|-------------|
| `reference/screen-landing.png` | Pacifico PET landing — 2-col hero, feature strip, partner banner |
| `reference/screen-form.png` | Multi-step form step 1 — stepper, radio groups, 2-col name fields |
| `reference/screen-comparison.png` | Plan selection — 3-col cards, center highlighted, feature checklist |
| `reference/screen-confirmation.png` | Payment step — accordions, pricing card, trust badge |
| `reference/ref-tsana-landing.png` | Tsana telemedicine — minimal nav, scrollable specialty cards, benefit grid |
| `reference/ref-tsana-registration.png` | Tsana registration — centered card form, step counter, multi-brand footer |
| `reference/ref-sanna-appointments.png` | Sanna appointments — utility bar, pill tabs, 2-col feature cards, green palette |
| `reference/ref-querente-landing.png` | Querente wellness — full-bleed hero, dual CTA, high whitespace |
| `reference/ref-querente-login.png` | Login/register — tab switcher, phone prefix selector, 3-col footer |
| `reference/screen-full-landing.png` | Medical services full-page reference — section ordering and spacing density |

---

## Working approach — avoid timeouts

HTML pages in this repo can be long. Claude Code has hit timeouts when writing large files in one shot. **Always build and commit in parts.**

### Page build workflow

1. **Plan sections** before writing — decide the split upfront (typically 4–5 parts)
2. **Write → commit → push each part** before starting the next
3. **Read only the component files the page actually needs** — identify them upfront, read each once, copy the relevant CSS blocks into `page.css`. Do not read components speculatively or re-read files already in the session.
4. **Never read a component file just to find a class name** — use `grep` for that. Read the full file only when you need to copy its styles.

### Typical split for a full landing page

| Part | Content |
|------|---------|
| 1 | HTML shell + `<head>` + header + hero + first section + base CSS |
| 2 | Second major section (e.g. timeline, feature grid) + its CSS |
| 3 | Accordion / data-heavy section + its CSS |
| 4 | Form section + FAQ + their CSS |
| 5 | Remaining sections + footer + final CSS |

### Commit pattern per part
```bash
git add pages/<name>/
git commit -m "feat(<name>): Part N — <what>"
git push -u origin <branch>
# Verify PUSH OK before continuing
```

If push fails with 403, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s). The branch must start with `claude/`.

---

## Assets

Photo assets in `assets/` — use relative path from page HTML.

| File | Description | Recommended use |
|------|-------------|-----------------|
| `online-marketing-hIgeoQjS_iE-unsplash.jpg` | Male doctor in white lab coat, teal-gray bg | Hero right column |
| `nappy-J5UTvRgse7Q-unsplash.jpg` | Doctor reviewing tablet with patient | Booking / results section |
| `pexels-cottonbro-7579823.jpg` | Doctor at consultation desk with patient | Split sections or testimonials |
| `accuray-S34fEzWT6eE-unsplash.jpg` | Two doctors reviewing CT imaging (portrait) | CTA banner or results context |
| `mateo-hernandez-reyes-YgY1ITp8PMM-unsplash.jpg` | Nurse in blue scrubs with stethoscope (portrait) | Secondary visual / dark banner |
| `pexels-karola-g-4021775.jpg` | Healthcare professional in teal scrubs | Trust strip or CTA banner |
| `pexels-kowalievska-1170979.jpg` | Three doctors reviewing X-ray | Team section or sedes accent |
| `etactics-inc-g3PsF4_y7ZY-unsplash.jpg` | Stethoscope flat-lay on light blue | Decorative / section accent |
| `jc-gellidon-UIp163xCV6w-unsplash.jpg` | Surgeon in full surgical gear | Avoid for checkup prep pages |
