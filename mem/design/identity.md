---
name: Paper & Ink design system
description: Locked palette, type, surface rules, and structural glyph for The Stoic Reference
type: design
---

Palette (semantic tokens in `src/styles.css`)

- `--background` / `--paper`: #F5F3EE warm letterpress paper
- `--foreground`: #2D2D2D ink
- `--ink-strong`: #0D0D0D for display headings + buttons (utility `text-ink`)
- `--border`: #E8E4DD hairline rule
- `--inverse-bg` / `--inverse-fg`: #0D0D0D on #F5F3EE (utility `bg-ink`) — used only for the puzzle tray as the single tonal counterpoint
- No chromatic accent. `--accent` is a warm neutral gray reserved for shadcn hover/focus surfaces only — never use `text-accent` in content.

Type

- Display: Libre Baskerville (400/700 + italic) — loaded via `<link>` in `src/routes/__root.tsx` head
- Body: IBM Plex Sans (400/500/600)
- `.small-caps` is uppercase 0.22em tracking 600 weight (not actual font-variant small-caps)
- `h1/h2/h3/.font-display` automatically take `--ink-strong` — override with `text-[var(--inverse-fg)]` on dark surfaces

Surfaces

- Hairline borders only: `border border-border`
- No shadows. `shadow-soft` / `shadow-pop` utilities exist as no-ops for legacy callsites — do not add new uses.
- No rounded corners (`--radius: 0`). No card lift.
- `aurora-bg` retired as no-op.

Structural glyph

- `✻` (U+273B) as the repeating identity mark; placed faint top-left on quote specimens, opacity ~15% → ~30% on group-hover.

Layout

- Homepage = single bordered "frame" with 8/4 magazine grid (specimen left, ask + puzzle right), footer index band, then editorial Philosophers/Themes sections below.
- Daily meditation is the visual specimen — never demote it back below the ask box.
