# Design System — Code Reference

Rules, import order, layout patterns, and component catalogue for the multi-brand
design system (Pacifico · Sanna · Tsana). Consult when you need specifics on token
usage, HTML structure, or component patterns.

---

## Step 1 — Identify the request

Determine:
- **Brand**: Pacifico (default) · Sanna · Tsana
- **Output type**: full page · page section · component · internal tool
- **Page type** (if applicable): landing · form · comparison · confirmation · login

Load the relevant reference section below before writing code.

---

## Step 2 — Token rules (non-negotiable)

**Never hardcode any value.** Every color, size, spacing, radius, shadow, transition,
and z-index must use a CSS custom property.

### Correct token layers

| What you're styling | Tokens to use |
|---------------------|---------------|
| Brand colors (buttons, headings, CTAs) | `--color-brand-primary-*` or `--color-brand-secondary-*` (semantic aliases) |
| Text | `--neutral-color-xhigh` (primary) · `--neutral-color-medium` (secondary) |
| Backgrounds | `--neutral-color-low` (page) · `--neutral-color-xlow` (cards/surfaces) |
| Status / feedback | `--feedback-color-success-*` · `-danger-*` · `-warning-*` · `-info-*` |
| Spacing | `--spacing-*` (2xs → 6xl) |
| Font size | `--font-size-*` (xs → 4xl) |
| Font weight | `--font-weight-*` (light · regular · medium · bold) |
| Line height | `--line-height-*` (small · medium · large · xlarge) |
| Letter spacing | `--letter-spacing-*` |
| Border radius | `--border-radius-*` (none · small · medium · large · circular) |
| Border width | `--border-width-*` (none · small · medium) |
| Shadows | `--shadow-down-*` · `--shadow-up-*` |
| Transitions | `--transition-fast` · `--transition-base` · `--transition-slow` |
| Z-index | `--z-*` (base · raised · sticky · dropdown · tooltip · modal) |
| Component sizing | `--size-input` · `--size-touch` · `--size-icon-ui` · `--size-icon-step` · `--size-icon-feature` |

### Hard constraints

- Components and pages **never** reference `--sanna-*` or `--pacifico-*` directly
- Use `--color-brand-*` aliases only — brand-switching happens in `aliases.css`, not here
- All interactive elements must be at least `var(--size-touch)` (44px) tall
- State changes always use `var(--transition-base)`; animations use `var(--transition-slow)`
- Focus styles: `outline: 2px solid var(--color-brand-primary-medium); outline-offset: 2px;`
  On dark surfaces: use `var(--neutral-color-xlow)` as outline color

---

## Step 3 — CSS import order

**Components:**
```html
<link rel="stylesheet" href="../tokens/global.css" />
<link rel="stylesheet" href="../tokens/[brand].css" />
<link rel="stylesheet" href="../tokens/aliases.css" />
<link rel="stylesheet" href="showcase.css" />
<link rel="stylesheet" href="component.css" />
```

**Pages:**
```html
<link rel="stylesheet" href="../../tokens/global.css" />
<link rel="stylesheet" href="../../tokens/[brand].css" />
<link rel="stylesheet" href="../../tokens/aliases.css" />
<link rel="stylesheet" href="page.css" />
```

Replace `[brand]` with `pacifico`, `sanna`, or `tsana`.
Never use `@import` — always `<link>` tags in this order.

---

## Step 4 — HTML structure rules

- Semantic tags: `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`, `<form>`, etc.
- No inline styles
- BEM kebab-case class names: `.block__element--modifier`
- Every page opens with: `<a href="#main" class="skip-link">Ir al contenido</a>`
- `<main id="main">` on all pages
- Labels connected to inputs via matching `for` / `id`
- ARIA landmarks on all page regions
- Color contrast minimum 4.5:1
- Add CSS comments indicating which token group is applied

---

## Step 5 — Layout patterns

### Container
```css
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--spacing-xl); }
.container--narrow { max-width: 640px; margin: 0 auto; padding: 0 var(--spacing-xl); }
```

### Section rhythm
```css
.section { padding: var(--spacing-4xl) 0; }
```

### Hero variants
- **Split:** CSS Grid `1fr 1fr` — text left, image right. Stacks below `md` (768px)
- **Full-bleed:** full-width bg, centered text, max-width container for copy
- **Offset image:** brand tint bg, text left, image bleeding to edge

### Grid layouts
- 2-col: `repeat(2, 1fr)` → 1-col on mobile
- 3-col: `repeat(3, 1fr)` → 1-col on mobile
- 4-col: `repeat(4, 1fr)` → 2-col tablet, 1-col mobile

### Breakpoints (mobile-first)
```css
/* sm */ @media (min-width: 480px)  { … }
/* md */ @media (min-width: 768px)  { … }
/* lg */ @media (min-width: 1024px) { … }
/* xl */ @media (min-width: 1280px) { … }
```

---

## Step 6 — Color usage by context

| Context | Token |
|---------|-------|
| Landing page CTAs | `--color-brand-secondary-medium` (emotional contrast) |
| Form / flow navigation | `--color-brand-primary-medium` (trustworthy, directional) |
| Data labels in confirmation | `--color-brand-primary-medium` |
| Section headings in forms | `--color-brand-primary-medium` |
| All other text | neutral scale only |

**Spacing defaults:**
- Input padding: `--spacing-s` vertical, `--spacing-m` horizontal
- Button padding: `--spacing-s` vertical, `--spacing-l` horizontal
- Card padding: `--spacing-l`
- Gap between form fields: `--spacing-m`
- Section gap: `--spacing-xl`

**Border radius defaults:**
- Buttons → `--border-radius-circular`
- Inputs → `--border-radius-small`
- Cards → `--border-radius-medium`
- Modals → `--border-radius-large`

---

## Step 7 — Component catalogue

When including components in a page, use the correct file pair from `components/`:

| Component | Use case |
|-----------|----------|
| `button` | Primary, Secondary, Ghost, Danger, Negative variants |
| `text-field` | Input + label + helper text + icon adornments + states |
| `checkbox` | With/without label, all states |
| `radio-button` | With/without label, all states |
| `dropdown` | Select with label, helper text, states |
| `search-input` | Autocomplete with clear button |
| `stepper` | Multi-step progress indicator |
| `accordion` | Collapsible sections (data-summary + FAQ variants) |
| `pill-tabs` | Horizontally scrollable tabs with active state |
| `badge` | Pill-shaped status labels (7 color variants, filled + outlined) |
| `tag` | Filter chips, specialty categories (selectable + removable) |
| `tooltip` | CSS-only hover/focus, 4 positions, no JS |
| `alert` | Full-width dismissible notification (success/danger/warning/info) |

---

## Step 8 — New page checklist

Before delivering any new page:

- [ ] File at `pages/<name>/index.html` + `pages/<name>/<name>.css`
- [ ] Token imports in correct order
- [ ] Skip link as first element
- [ ] `<main id="main">` present
- [ ] Mobile layout first, breakpoints added after
- [ ] Zero brand-prefixed tokens in component or page CSS
- [ ] Works with both Pacifico and Sanna by swapping brand name in imports

---

## Step 9 — Brand-specific notes

### Pacifico
- Primary: teals (`#003840` → `#F2F9FD`)
- Secondary: pinks (`#40001B` → `#FEF4F6`)
- Active brand in `aliases.css` by default

### Sanna
- Primary: greens (`#00230C` → `#D6F5DF`)
- Secondary: blues/purples (`#101332` → `#F3F2FF`)
- Switch: replace `pacifico` with `sanna` in `aliases.css` alias values

### Tsana
- Primary: purples (`#101332` → `#F3F6FF`)
- Secondary: greens (`#00230C` → `#D6F5DF`)
- Switch: replace `pacifico` with `tsana` in `aliases.css` alias values

---

## Step 10 — Typography

**Font:** Roboto — import from Google Fonts (weights 300, 400, 500, 700)

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
```

Use `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*` tokens.
Never hardcode font sizes, weights, or line heights.

---

## Anti-patterns — never do this

```css
/* ✗ WRONG — hardcoded values */
padding: 16px;
font-size: 1rem;
color: #0099CC;
height: 48px;

/* ✓ RIGHT — always use tokens */
padding: var(--spacing-m);
font-size: var(--font-size-m);
color: var(--color-brand-primary-medium);
height: var(--size-input);
```

- **Never** use `px` or `rem` values directly — always reference tokens
- **Never** use `@import` for stylesheets — always `<link>` tags
- **Never** use `--pacifico-*`, `--sanna-*`, or `--tsana-*` in page or component CSS — always `--color-brand-*` aliases
- **Never** center body text blocks wider than 2 lines
- **Never** use `--spacing-*` tokens for interactive element heights — use `--size-input` or `--size-touch`
- **Never** skip the focus-visible outline on interactive elements
- If a component doesn't exist in the catalogue, create it following the same conventions: BEM naming, token-only values, showcase HTML, one HTML + one CSS file

---

## Reference files

For visual references (screenshot descriptions) and photo asset guidance, see `CLAUDE.md`.
For detailed visual composition and section ordering, read:
- `references/visual-patterns.md` — section-by-section breakdown of each page type

---

## Quick validation before output

Before returning any code, check:

1. ✅ No hardcoded hex, px, rem, or numeric values anywhere
2. ✅ `--color-brand-*` used for all brand colors (not `--pacifico-*` / `--sanna-*`)
3. ✅ CSS import order matches the template above
4. ✅ Skip link present on pages
5. ✅ Mobile-first breakpoints
6. ✅ All interactive elements ≥ `var(--size-touch)`
7. ✅ Focus styles applied to all interactive elements
8. ✅ BEM class names throughout
