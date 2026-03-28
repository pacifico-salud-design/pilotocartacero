# Visual Patterns Reference

Detailed composition guidance for each page type. Read the relevant section before
building or modifying a page.

---

## Landing page (`pages/landing/`)

### Section order (standard)
1. Navbar — logo left, 1–2 nav links + ghost CTA right
2. Hero — see hero variants below
3. Feature strip — 3-col icon + label + description
4. Social proof / trust row — stats (patients, years, locations) or partner logos
5. Mid-page split section — text left, photo right (or reversed)
6. Specialties / benefits grid — 2–4 col depending on item count
7. Doctor/team cards (optional)
8. Pricing cards — 3-col, center card highlighted
9. Testimonials strip
10. Dark CTA banner — full-width, white text, dual CTAs, photo accent
11. Footer — multi-column

### Hero composition
- **Split hero (preferred for Pacifico):** headline + subtitle + CTA left, doctor photo
  in rounded card right. Grid `1fr 1fr`. Brand tint background.
- **Full-bleed (Tsana/Querente):** full-width bg gradient/image, centered headline +
  subtext + single CTA. High whitespace.
- **Utility bar above nav (Sanna):** small bar with phone numbers + CTAs above main nav.

### Landing CTA colors
- Primary CTA → `--color-brand-secondary-medium` (pink for Pacifico, blue for Sanna)
- Secondary/ghost CTA → `--color-brand-primary-medium`

### Specialty cards (Tsana)
- Horizontally scrollable row
- Each card: specialty name + price + ghost CTA
- `overflow-x: auto; display: flex; gap: var(--spacing-m)`

---

## Form page (`pages/form/`)

### Layout
- Narrow container: max-width 640px, centered
- Stepper at top (3 steps standard)
- Section headers with emoji icon + heading in `--color-brand-primary-medium`
- Fields grouped in sections; gap `--spacing-m`
- Split dropdowns for unit + number inputs: `display: grid; grid-template-columns: auto 1fr`
- Inline info card for contextual help
- 2-col name fields on md+: `grid-template-columns: 1fr 1fr`
- Background: optional faint decorative motif (paw prints for PET, etc.)

### Bottom nav
- Back button (ghost) left + Continue button (primary) right
- Fixed or sticky at bottom on mobile

---

## Comparison page (`pages/comparison/`)

### Layout
- 3-col card grid
- Center card: brand-color border + `--shadow-down-medium` + "Más recomendado" badge
- Price prominent at top of each card (large font, `--font-size-2xl` or above)
- Feature checklist: ✓ icon in `--feedback-color-success-medium`, ✗ in `--neutral-color-medium`
- "Ver más detalles" secondary link below checklist
- Back / Continue bottom nav (same as form page)

---

## Confirmation page (`pages/confirmation/`)

### Layout
- Narrow container: max-width 640px
- Collapsible accordion sections (data-summary variant) for submitted data
- Pricing display card: line items + total
- "Pago seguro" trust badge
- Partner logo strip at bottom
- Submit / Pay CTA in `--color-brand-secondary-medium`

---

## Login / Register page

### Layout
- Tab switcher at top: Login / Register
- Form in narrow container (~480px)
- Phone field: country-code prefix selector (flag + code) + number input
  `display: grid; grid-template-columns: auto 1fr`
- Multi-column footer (Contacto / Otros enlaces / Síguenos en:)
- Social icons row
- Multi-brand logo strip (Tsana + Pacifico + Sanna) at very bottom

---

## Internal tools (Validador-style)

### Layout pattern
- Full-width search/autocomplete input at top
- Results panel below (card grid or table)
- Detail panel: appears on selection, shows rule data
- Latency period + coverage details displayed as definition list or data table
- Export / action buttons in top-right of detail panel
- History in sidebar or collapsible panel

### Token usage notes
- Use `--color-brand-primary-xlow` for table row highlights / active states
- Use `--feedback-color-*` tokens for coverage status indicators
- Use `--shadow-down-small` on cards, `--shadow-down-medium` on active selection

---

## Photo asset quick reference

| File | Best use |
|------|----------|
| `online-marketing-hIgeoQjS_iE-unsplash.jpg` | Hero right column — pairs with Sanna green tint |
| `nappy-J5UTvRgse7Q-unsplash.jpg` | Booking / results section |
| `pexels-cottonbro-7579823.jpg` | Split sections or testimonials |
| `accuray-S34fEzWT6eE-unsplash.jpg` | CTA banner or results reading context |
| `mateo-hernandez-reyes-YgY1ITp8PMM-unsplash.jpg` | Secondary visual / dark banner background |
| `pexels-karola-g-4021775.jpg` | Trust strip or CTA banner photo |
| `pexels-kowalievska-1170979.jpg` | Team section or sedes accent |
| `etactics-inc-g3PsF4_y7ZY-unsplash.jpg` | Section accent or article thumbnail |
| `jc-gellidon-UIp163xCV6w-unsplash.jpg` | ⚠️ Avoid on checkup/prep pages — too surgical |
