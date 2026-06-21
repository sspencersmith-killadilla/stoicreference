## What changes

A site-wide identity pass + homepage rebuild matching the chosen "Interactive specimen" direction. The current aurora-bg cream/cobalt aesthetic is retired in favor of a stricter editorial system.

## Design system (`src/styles.css` + `__root.tsx`)

- **Palette (Paper & Ink)** — locked tokens:
  - `--background: #F5F3EE` (warm paper)
  - `--card: #F5F3EE` (no card lift; bordered, not shadowed)
  - `--foreground: #2D2D2D` (ink)
  - `--ink-strong: #0D0D0D` (display + buttons)
  - `--border: #E8E4DD` (hairline rule)
  - `--inverse-bg: #0D0D0D`, `--inverse-fg: #F5F3EE` (puzzle tray, footer accent)
  - Retire the cobalt `--accent` and the aurora gradient. The accent role is taken by `--ink-strong` (black on cream).
- **Type** — replace Cormorant/Inter with Libre Baskerville (display) + IBM Plex Sans (body), loaded via `<link>` in `__root.tsx` head (per Tailwind v4 remote-CSS rules). Update `--font-display` and `--font-sans` tokens; keep the existing `font-display` / `pullquote` / `small-caps` utility class names so callsites don't break.
- **Shadows** — remove `shadow-soft` / `shadow-pop`. Editorial system uses 1px `border-border` only.
- **Wordmark** — italic Libre Baskerville set under a small-caps eyebrow ("A working reference of Stoicism"), per the chosen direction.

## Homepage (`src/routes/index.tsx`) — rebuilt

Above the fold, magazine layout in a single bordered frame:

```text
┌─────────────────────────────────────────────────────────────┐
│ A WORKING REFERENCE OF STOICISM         Philosophers Themes │
│ The Stoic Reference (italic display)    Archive             │
├──────────────────────────────────────────┬──────────────────┤
│                                          │ CONSULT THE      │
│   ✻  (faint glyph, top-left)             │ ARCHIVE          │
│                                          │                  │
│   DAILY SPECIMEN ───── June 21           │ Type any         │
│                                          │ question…        │
│   "It is not possible to live well       │ ─────────────    │
│   today unless one thinks of it as       │ Ask the Stoics   │
│   one's last."                           │      CONSULT →   │
│                                          │                  │
│   ─── MUSONIUS RUFUS                     │ COMMON INQUIRIES │
│       Lectures · VI                      │ · How do I…      │
│                                          │ · What should…   │
│                                          ├──────────────────┤
│                                          │ ▓ DAILY PUZZLE   │
│                                          │ Voices of the    │
│                                          │ Stoa  ▣▣▣▣       │
│                                          │ Play now ───     │
├──────────────────────────────────────────┴──────────────────┤
│ BROWSE BY  Philosophers (10)   Themes (9)   public domain…  │
└─────────────────────────────────────────────────────────────┘
```

- Left 8/12: today's meditation as the **specimen** — large Libre Baskerville quote, hairline-rule + author + source citation underneath. Faint `✻` glyph in the upper-left as the structural identity mark. Subtle entry animation: quote text fades in line-by-line; hairline rule extends in from the left.
- Right 4/12 split vertically:
  - Top tray: "Consult the Archive" — slim editorial ask input (border-bottom only, no rounded pill), 3 sample inquiries below.
  - Bottom tray: puzzle teaser on **inverted #0D0D0D** background — the one tonal counterpoint in the layout.
- Footer band: Philosophers / Themes index counts + public-domain colophon.

Below the fold (kept from current, restyled to the new system):
- Full Philosophers list as an editorial two-column index with hanging dates (no cards, no shadows, hairline rule between rows).
- Full Themes as a hairline-bordered tag list.
- Recent questions if present.

## Site-wide propagation (other routes)

Restyle to the new system — same tokens, same shell. Edit (no rebuilds):
- `__root.tsx` — wordmark, nav, font links, drop aurora.
- `src/components/QuoteCard.tsx` — remove `shadow-soft`/`shadow-pop`, replace decorative `&ldquo;` opener with the `✻` glyph in the top-left, retune type to Libre Baskerville, swap accent color refs.
- `src/components/AskForm.tsx` — slim editorial input (border-bottom variant), drop the pill.
- `src/components/ShareQuote.tsx` — button labels become small-caps text links, not chips.
- `src/routes/philosophers.tsx`, `themes.tsx`, `*.\$slug.tsx`, `wordsearch.tsx`, `history.tsx`, `about.tsx`, `q.\$id.tsx`, `ask.tsx` — adopt the same paper frame + hairline rules; remove gradient backgrounds; restyle headings and buttons. Functionality unchanged.

## Out of scope

- No business-logic changes (data, routing, server functions, OG card endpoint untouched).
- No new pages or features.
- No 3D, WebGL, photography, dark mode toggle.
- The puzzle, the share image endpoint, auth flows: unchanged.

## Technical notes

- Fonts loaded via `<link rel="stylesheet">` in `__root.tsx` head — Libre Baskerville (400/700 + italic) + IBM Plex Sans (400/500/600). Never `@import` URLs in styles.css under Tailwind v4.
- All color/border/shadow refs continue to use semantic CSS tokens; no `#hex` literals or `text-white`/`bg-black` in JSX.
- Animation: a single `animate-fade-in` on the quote block plus a CSS `@keyframes rule-extend` for the hairline. No framer-motion needed.
- Existing `aurora-bg` utility is removed; search-replace all usages.
- Existing `QuoteCard` API (props) is preserved — visual change only.
- Crawlers cache OG previews; this redesign doesn't change OG image URLs, so shared links keep working as-is.

## Files

- **Edit**: `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/components/QuoteCard.tsx`, `src/components/AskForm.tsx`, `src/components/ShareQuote.tsx`, `src/routes/philosophers.tsx`, `src/routes/philosophers.$slug.tsx`, `src/routes/themes.tsx`, `src/routes/themes.$slug.tsx`, `src/routes/wordsearch.tsx`, `src/routes/history.tsx`, `src/routes/about.tsx`, `src/routes/q.$id.tsx`, `src/routes/ask.tsx`.
- **Add**: none (no new components needed — the glyph and hairline are inline SVG/CSS).
- **Memory**: save `mem://design/identity` capturing Paper & Ink tokens, Libre Baskerville + IBM Plex Sans pairing, and "✻ as structural glyph, no shadows, hairline rules only" so future edits stay on-system.
