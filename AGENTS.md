# AGENTS.md

## Repository purpose
Token-driven, multi-brand HTML/CSS design system for health insurance experiences.

## Source of truth
- `CLAUDE.md` for architecture, constraints, and workflow.
- `design-system-codegen/REFERENCE.md` for implementation rules.
- `design-taste/REFERENCE.md` for visual quality principles.

## Non-negotiable implementation rules
- Use CSS custom properties for all design values.
- In components/pages, use semantic aliases (`--color-brand-*`), never raw brand tokens.
- Keep import order: `fonts -> global -> brand -> aliases -> base -> local css`.
- Keep semantic HTML + BEM naming.
- Keep focus-visible styles and touch targets (`--size-touch` minimum).

## Working conventions for Codex
- Prefer targeted edits over broad rewrites.
- Run a hardcoded-value audit before finishing:
  - `rg -n "#[0-9A-Fa-f]{3,6}|rgba?\(|\b[0-9]+px\b" components/*.css`
- Keep components self-contained and token-compliant.
- If adding a new page, scaffold under `pages/<name>/` and include skip-link + `<main id="main">`.

## Deployment note
`vercel.json` rewrites `/` to `/index.html`.
