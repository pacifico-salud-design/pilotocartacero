# Design Taste — Visual Quality Reference

Defines what "good" looks like for Pacifico, Sanna, and Tsana pages. Consult for
layout composition, section rhythm, and interaction patterns. Token compliance
(REFERENCE.md) is the floor — this is the ceiling.

The north star reference is **Alan (alan.com)** — studied from full-page screenshots
of their live product pages. The patterns below are observed directly, not inferred.

---

## The page-level mental model: grey base, white/colored cards

Alan's pages use a **light grey page background** (~`#f0f0f0`) as the canvas. Content
lives inside white cards or colored rounded containers that float on that grey surface.
This is the opposite of the typical approach (white page, colored sections).

**What this means for your system:**
- `--neutral-color-low` (`#F0F1F2`) is the page background, not `--neutral-color-xlow`
- White (`--neutral-color-xlow`) is for card surfaces and component fills
- Colored sections are **contained rounded cards** (`border-radius: var(--border-radius-large)`),
  max-width ~900px, centered — not full-bleed background swaps
- Full-bleed treatment is reserved for the hero only

---

## The core problem to avoid: flat/lifeless sections

Flat sections happen when:
- Every section uses the same full-width white background
- Content is centered with nothing creating spatial hierarchy
- Stats and features are listed rather than composed
- Color only appears in buttons, never in section containers
- Photos are rectangular fills with no overlaid content

The fix is not more decoration — it's **grey base + white/colored cards floating on it**,
and **content composed inside those cards** with intention.

---

## Principle 1 — Section rhythm and contrast

Alan's page flow, observed across 8 screenshots:

1. Hero — full-bleed photo, copy bottom-left
2. Segmentation grid — white cards on grey, 4-col
3. Problem/context section — stats overlaid on photos
4. Split section — text left + mascot/illustration right, on grey
5. Feature card — large pink rounded container, centered
6. Stacked feature cards — teal + peach, overlapping slightly
7. App/product accordion — text left + 3D visual right
8. Social proof bento grid — asymmetric, warm cream cards
9. Pre-footer CTA — centered, mascot peaking up
10. Footer — dark charcoal, 4-col

**Key rhythm rule:** alternate between open grey sections (content floating freely)
and enclosed card sections (content inside a colored rounded container). Never place
two colored cards back to back without an open grey section between them.

The **dark CTA banner** does not appear on Alan's page. The climax is a light warm
section with centered copy + mascot. This is the right call for health insurance:
warmth at the conversion moment, not urgency.

---

## Principle 2 — Typography as structure

Roboto has enough range to build visual hierarchy without color or size extremes.

**Hero headline:** `--font-size-2xl` minimum on desktop. `--font-weight-bold`.
`--line-height-small` (1.32) — tighter = more confident.
`--letter-spacing-xlarge` (-0.01rem) on large headlines.

**Section headings:** `--font-size-xl`. `--font-weight-bold`. Left-aligned > centered
for feature sections. Centered works for short pivot headings (2–4 words max).

**Body copy:** `--font-size-m`. `--font-weight-regular`. Hard cap at ~65 characters
per line (`max-width: 38rem`). Beyond that, readability collapses.

**Inline bold stat:** Alan bolds a key stat mid-paragraph — "**98% des entreprises
clientes passent moins de 2h par an**" — then follows with a plain source attribution
in small neutral text. This is more powerful than a separate stat row.

**Section subtitle pattern:** after a centered section heading, one line of small
neutral text as a subtitle (`--font-size-s`, `--neutral-color-medium`). Used for
product category labels ("Assurance. Prévoyance. Prévention.") not marketing copy.

**What to avoid:**
- Centered body text blocks longer than 2 lines
- Bold used for decoration rather than hierarchy
- Heading + subtext + body all in the same section — pick two

---

## Principle 3 — Spatial generosity

Space signals confidence. Health insurance content is inherently complex — space is
the antidote, not more content.

**Section padding:** `--spacing-4xl` (80px) top and bottom minimum.
Hero: `--spacing-5xl` (96px) or more.

**Content max-width:**
- Hero copy block: `max-width: 32rem`
- Body text: `max-width: 38rem`
- Feature cards: `max-width: 900px`, centered
- Narrow form: `max-width: 640px`

**Vertical rhythm inside a section:**
- Heading → subtitle: `--spacing-xs`
- Subtitle → body: `--spacing-m`
- Body → CTA: `--spacing-xl`
- Between card groups: `--spacing-2xl`

**What kills space:**
- Padding at `--spacing-xl` when `--spacing-4xl` was needed
- Body text spanning full container width
- Gaps of `--spacing-xs` between cards

---

## Principle 4 — The segmentation card pattern

Alan's audience selector (img 1) is the definitive pattern for presenting multiple
user types. Apply whenever a page serves more than one audience segment.

**Structure:**
- 4-col grid (collapses to 2-col on tablet, 1-col on mobile)
- Each card: contextual photo (landscape, `border-radius: var(--border-radius-small)`)
  + bold segment label + 2-line description + lone `→` arrow as CTA
- No button — the `→` at the bottom is the only interactive signal
- Card background: `--neutral-color-xlow` (white)
- Page background: `--neutral-color-low` (grey) — the contrast creates the card

**Photo selection:** people in their actual context (office, coworking, home) — not
medical or clinical imagery. The photo shows the *buyer*, not the product.

**Section heading pattern:** left-aligned heading + 2-line description above the grid.
No centered heading for this section type.

---

## Principle 5 — Stats overlaid on photos

Alan's problem/context section (img 1+2) uses a pattern where stats float as
**white caption cards positioned over photos**, not in a separate stat row.

**Implementation:**
```css
.stat-card {
  position: relative;
}
.stat-card__photo {
  border-radius: var(--border-radius-small);
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}
.stat-card__overlay {
  position: absolute;
  top: var(--spacing-m);
  left: var(--spacing-m); /* or right for variation */
  background: var(--neutral-color-xlow);
  border-radius: var(--border-radius-small);
  padding: var(--spacing-s) var(--spacing-m);
  box-shadow: var(--shadow-down-small);
  max-width: 60%;
}
.stat-card__number {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-color-xhigh);
}
.stat-card__label {
  font-size: var(--font-size-xs);
  color: var(--neutral-color-medium);
}
```

Below each card: article/study title in `--font-size-s` `--font-weight-medium`, then
source + year in `--font-size-xs` `--neutral-color-medium`. This gives stats credibility
without a separate citation section.

**3-col grid** for this section. Each column: photo with stat overlay + title + source.

---

## Principle 6 — Colored feature cards (contained, not full-bleed)

Alan's feature sections (img 3+4) use large rounded containers as self-contained
section units. These are NOT full-bleed background color changes.

**Single feature card:**
```css
.feature-card {
  background: var(--color-brand-secondary-xlow); /* or primary-xlow */
  border-radius: var(--border-radius-large);
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-3xl);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--spacing-3xl);
}
```

Left: headline (`--font-size-xl`, bold) + body + **one bold proof stat** + source.
Right: product UI screenshot or illustration (no border-radius needed inside a card).

**Stacked cards with overlap (img 4):**
Two cards stacked vertically, the second starting before the first ends:
```css
.feature-card + .feature-card {
  margin-top: calc(-1 * var(--spacing-xl));
  position: relative;
  z-index: 1;
}
```
First card: brand primary tint (dark teal). Second card: warm peach/cream.
This creates depth without extra DOM complexity.

**Color palette for cards:**
- Dark teal: `--color-brand-primary-xhigh` bg, white text
- Soft pink: `--color-brand-secondary-xlow` bg, dark text
- Warm cream: `--neutral-color-low` bg, dark text
- Never use medium brand colors as card backgrounds — too loud

---

## Principle 7 — Floating label / tag orbits (for mascot/illustration sections)

Alan's service card (img 6) places floating pill labels around the mascot illustration —
"Efficace", "Pédagogue", "Clair", "Gentil" — positioned absolutely at different angles.

This technique applies whenever an illustration or icon is the visual centerpiece:
```css
.mascot-wrapper {
  position: relative;
  display: inline-block;
}
.floating-tag {
  position: absolute;
  background: var(--neutral-color-xlow);
  border-radius: var(--border-radius-circular);
  padding: var(--spacing-xs) var(--spacing-m);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-down-small);
  white-space: nowrap;
}
/* Position each tag individually */
.floating-tag--top-right    { top: 10%; right: -20%; }
.floating-tag--mid-left     { top: 40%; left: -25%; }
.floating-tag--bottom-right { bottom: 15%; right: -15%; }
```

For Pacífico's context: use benefit labels ("Sin filas", "24/7", "Sin papeleo")
orbiting an illustration of the app or a doctor illustration.

---

## Principle 8 — Bento-grid testimonials

Alan's social proof section (img 7) uses an **asymmetric bento grid** mixing:
- Large video/photo card (center or dominant position)
- Stat card (number large, description small, warm cream bg)
- Quote card (text + avatar + name/role, warm cream bg)
- All cards same height in their row, varied widths

**Grid pattern:**
```css
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--spacing-m);
}
/* First row: stat | video | quote-with-attribution */
/* Second row: video | stat | photo */
```

Tab switcher above ("Antes / Con Pacífico") using `pill-tabs` component.

**Card treatment:** `background: var(--color-brand-primary-xlow)` for stat/quote cards.
Video/photo cards have no background — the image fills the card.
All cards: `border-radius: var(--border-radius-medium)`, `overflow: hidden`.

---

## Principle 9 — Pre-footer CTA (warm, not dark)

Alan's climax section (img 8) is light and warm, not a dark banner:
- Background: warm cream/peach (`--color-brand-secondary-xlow` or `--neutral-color-low`)
- Centered headline at `--font-size-xl` or `--font-size-2xl`, bold
- One proof line in `--font-size-s` `--neutral-color-medium` below headline
- Primary CTA (filled) + secondary CTA (text link) — side by side, centered
- Mascot or illustration **peaking up from the bottom edge** of the section,
  cropped at ~chest height, creating a playful transition into the footer

```css
.pre-footer-cta {
  text-align: center;
  padding: var(--spacing-4xl) var(--spacing-xl) 0; /* no bottom padding — mascot fills it */
  background: var(--color-brand-secondary-xlow);
  position: relative;
  overflow: hidden;
}
.pre-footer-cta__mascot {
  display: block;
  margin: var(--spacing-2xl) auto 0;
  max-width: 300px;
  /* Crop bottom so it bleeds into footer */
}
```

**Footer:** dark charcoal (`--color-brand-primary-xhigh` or `--neutral-color-xhigh`),
4-col link grid, logo top-left, app store badges bottom-right of last column.

---

## Principle 10 — Interactive elements that feel alive

Token-compliant + unanimated = flat.

**Buttons:**
```css
.btn {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-down-medium);
}
.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-down-small);
}
```

**Segmentation cards:**
```css
.segment-card {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  cursor: pointer;
}
.segment-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-down-medium);
}
```

**Feature icons (when used):** tinted circle bg + `currentColor` icon:
```css
.feature-icon {
  background: var(--color-brand-primary-xlow);
  border-radius: var(--border-radius-circular);
  padding: var(--spacing-m);
  width: var(--size-icon-feature);
  height: var(--size-icon-feature);
  display: flex; align-items: center; justify-content: center;
}
```

---

## Mobile layout patterns (from Alan mobile screenshots)

Mobile is where Alan's decisions become clearest — no room to hide weak structure.
These are direct observations, not guesses.

### Mobile hero
The full-bleed desktop hero becomes a **contained rounded card** on mobile — visible
border-radius on all corners, sitting within page margins (~`var(--spacing-m)` each
side). Below the card: headline full-width, then two CTAs **stacked vertically**,
both full-width pills. Primary CTA filled, secondary CTA ghost (text link weight,
no background, brand color text).

Page background on mobile hero section: warm peach/cream, not grey.

### Mobile segmentation
Desktop 4-col photo grid becomes a **vertical list of horizontal rows**:
```css
.segment-row {
  display: grid;
  grid-template-columns: var(--spacing-4xl) 1fr auto; /* 80px thumbnail column */
  align-items: center;
  gap: var(--spacing-m);
  padding: var(--spacing-m) 0;
  border-bottom: var(--border-width-small) solid var(--neutral-color-low);
}
.segment-row__photo {
  width: var(--spacing-4xl);   /* 80px */
  height: var(--spacing-3xl);  /* 64px */
  object-fit: cover;
  border-radius: var(--border-radius-small);
}
.segment-row__label {
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-bold);
}
.segment-row__arrow {
  color: var(--color-brand-primary-medium);
  font-size: var(--font-size-l);
}
```
Full-width, no card wrapper, divider lines between rows. Much cleaner than
a collapsed 2-col grid on small screens.

### Mobile stats on photos
Same overlay pattern as desktop but single column, full width. The cream stat
card occupies the upper ~40% of the photo. Stat number at `--font-size-xl`,
label at `--font-size-s`. Photo `border-radius: var(--border-radius-small)`.

### Mobile mascot section
On mobile: **illustration leads, text follows**. The mascot/illustration sits above
the section heading, centered, full width (~70% of viewport). Then heading, body,
and horizontally scrollable metric mini-cards below:
```css
.metric-cards {
  display: flex;
  gap: var(--spacing-m);
  overflow-x: auto;
  padding-bottom: var(--spacing-s);
  /* Slight clip on right signals scroll */
  padding-right: var(--spacing-xl);
}
.metric-card {
  flex: 0 0 calc(50vw - var(--spacing-xl));
  background: var(--neutral-color-xlow);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-m);
}
```
The clipped right edge of the second card signals there's more to scroll —
do not make all cards equal width or it looks complete.

### Mobile feature card (pink/colored)
Full-width on mobile with `var(--spacing-m)` margin each side. Internal layout
stacks vertically: heading → body → bold stat → source → visual below. No grid.
The visual (UI screenshot, illustration) goes below the text, full card width.

### Mobile accordion sections
Section heading + plain text subtitle (rating, stat). Accordion rows full-width,
thin divider between items. Expanded item shows body text + contextual illustration
below — the illustration has **floating 3D objects** around it (coins, icons) that
extend slightly beyond the photo edges via `overflow: visible` on the wrapper.

### Mobile testimonials — full-screen dark carousel
On mobile, the bento grid becomes a **horizontal swipe carousel on dark teal background**:
- Background: `--color-brand-primary-xhigh` (dark teal), fills the entire section
- Cards are ~90vw wide, slightly peeking the next card at the right edge
- "Avant Alan" state: photo is **desaturated/black-and-white** — use `filter: grayscale(100%)`
- "Avec Alan" state: full color
- Tab switcher above: pill container, active tab filled with brand primary

```css
.testimonial-section {
  background: var(--color-brand-primary-xhigh);
  padding: var(--spacing-2xl) 0;
}
.testimonial-track {
  display: flex;
  gap: var(--spacing-m);
  overflow-x: auto;
  padding: 0 var(--spacing-m);
  scroll-snap-type: x mandatory;
}
.testimonial-card {
  flex: 0 0 88vw;
  scroll-snap-align: start;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  position: relative;
}
.testimonial-card img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
}
.testimonial-card--before img {
  filter: grayscale(100%);
}
.testimonial-card__caption {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: var(--spacing-m);
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: var(--neutral-color-xlow);
}
```
Navigation: two ghost pill buttons (← →) centered below the track.

### Mobile service card (dark teal + mascot + floating tags)
Full-width card on mobile. Card structure top to bottom:
- Avatar stack + copy (upper half, `padding: var(--spacing-l)`)
- Mascot illustration (lower half, bleeds to card edges)
- Floating tags positioned around mascot using absolute positioning

The card has `overflow: hidden` but the orange lightning bolt decorative element
peeks out from the top-right corner — achieved with `overflow: visible` on the
outer wrapper while the card itself clips.

---

## Pre-output quality check

Before returning any code, verify:

1. **Page background** — is it `--neutral-color-low` (grey), not white?
2. **Section containers** — are colored sections rounded cards (max-width ~900px), not full-bleed?
3. **Rhythm** — do open grey sections alternate with contained card sections?
4. **Stats** — are they overlaid on photos or inlined as bold mid-paragraph, not in separate icon rows?
5. **Typography** — is there a clear size jump between heading and body? Is body text width-capped?
6. **Segmentation** — if multiple audiences exist, is there a photo card grid (desktop) or row list (mobile)?
7. **Climax** — does the page end warm (light section + mascot/illustration), not dark?
8. **Interactivity** — do cards and buttons have hover lift transitions?
9. **Mobile hero** — does the full-bleed photo become a contained rounded card on mobile?
10. **Mobile CTAs** — are CTAs stacked full-width on mobile, not side by side?

---

## Flat vs alive: the full-page comparison

| Pattern | Flat version | Alan version |
|---------|-------------|--------------|
| Page background | White | Light grey (`--neutral-color-low`) |
| Colored sections | Full-bleed bg swap | Rounded card on grey, max-width 900px |
| Stats | Icon + number row | White caption card overlaid on photo |
| Segmentation desktop | Bullet list or tabs | 4-col photo card grid with `→` |
| Segmentation mobile | Collapsed 2-col grid | Horizontal row list: photo + label + `→` |
| Features | 3-col icon strip | Split left/right inside a colored card |
| Social proof desktop | Quote carousel | Asymmetric bento grid, mixed content |
| Social proof mobile | Stacked quote cards | Full-screen dark carousel, peek next card |
| "Before" state | Same styling as after | Desaturated/grayscale photos |
| Page climax | Dark full-bleed banner | Warm light section + illustration peaking up |
| Mascot/illustration | Absent or decorative | Structural — appears at key emotional beats |
| Mobile hero | Shrunk desktop layout | Contained rounded card + stacked full-width CTAs |
