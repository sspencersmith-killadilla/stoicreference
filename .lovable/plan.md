## Goal

When someone shares a quote link (e.g. `/q/ma-4-7`) on X, LinkedIn, Facebook, iMessage, Slack, etc., the link preview should render **that quote** as an image — author, source, and the site mark — instead of the generic site OG card.

## Approach

Generate the image **server-side on demand** as a PNG at a stable URL, then point each quote page's `og:image` / `twitter:image` at it. No pre-baked images to maintain, no asset pipeline; every existing and future quote in `src/data/quotes.ts` gets a card automatically.

### 1. New server route — `src/routes/api/og/q.$id.ts`

A public GET endpoint (`/api/og/q/:id.png`-style; we'll use `/api/og/q/$id` returning `image/png`) that:

1. Looks up the quote by `id` from `QUOTES`. 404 if missing.
2. Renders a 1200×630 card with [`satori`](https://github.com/vercel/satori) (JSX → SVG) and rasterizes to PNG with [`@resvg/resvg-wasm`](https://github.com/yisibl/resvg-js) — both run inside the Cloudflare Worker runtime (pure JS + WASM, no native bindings, Worker-compatible).
3. Returns the PNG with `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` so crawlers and the edge cache it.

Fonts: fetch the two project faces (Cormorant Garamond for the pull-quote, Inter for the meta line) once per isolate from Google Fonts and memoize the ArrayBuffers in module scope. If the fetch fails, fall back to a single bundled Inter weight so the route never 500s.

### 2. Card design

Matches the site aesthetic already on `QuoteCard`:

```text
┌───────────────────────────────────────────────────┐
│  THE STOIC REFERENCE                              │
│                                                   │
│      "                                            │
│      Waste no more time arguing what a            │
│      good man should be. Be one.                  │
│                                                   │
│      — Marcus Aurelius                            │
│      Meditations · 10.16                          │
│                                                   │
│                              askthestoics.org     │
└───────────────────────────────────────────────────┘
```

- Off-white background (`#FAF8F4`), cobalt accent rule, Cormorant italic open-quote glyph, serif quote body auto-sized in 3 tiers based on text length (≤140 / ≤260 / longer), Inter small-caps for the wordmark and URL.
- Translator line included when present.

### 3. Wire up the meta tags — `src/routes/q.$id.tsx`

In the existing `head()`:

- Add `{ property: "og:image", content: \`https://askthestoics.org/api/og/q/${params.id}\` }`
- Add matching `twitter:image`
- Upgrade `twitter:card` from inherited `summary` to `summary_large_image`
- Add `og:image:width` 1200 / `og:image:height` 630 / `og:image:alt` (the quote text)

URLs are absolute (askthestoics.org) — crawlers require absolute `og:image`.

### 4. No change needed to `ShareQuote`

It already passes `permalinkPath` and the social intents already point at the quote URL. Once the meta tags above are in place, X/LinkedIn/Facebook/iMessage will scrape `/q/$id`, find the per-quote `og:image`, and render the card.

### 5. Cache-buster note for the user

I'll mention in the closing reply that previously-shared links may still show the old card until each platform re-scrapes (X Card Validator, LinkedIn Post Inspector, Facebook Sharing Debugger force a refresh).

## Technical notes

- **Dependencies to add**: `satori`, `@resvg/resvg-wasm`. Both are Worker-safe; `@resvg/resvg-wasm` ships a `.wasm` we import via Vite's `?url` and `initWasm()` once per isolate.
- **Runtime**: route handler stays under the Worker CPU budget — satori renders ~30ms, resvg ~80ms for a 1200×630 card with short text.
- **Route file shape**: `createFileRoute('/api/og/q/$id')({ server: { handlers: { GET: async ({ params }) => Response } } })` — matches the project's `/api/public/*` pattern, but lives under `/api/og/` since it's a public read endpoint (no auth, no signature needed; idempotent).
- **Fallback**: if rendering throws, return a 302 redirect to the existing static site OG image so the link still previews *something*.

## Out of scope

- Per-philosopher / per-theme OG cards (easy follow-up reusing the same renderer).
- A homepage hero card refresh.
- Storing rendered PNGs anywhere persistent — edge cache is enough.

## Files

- **Add**: `src/routes/api/og/q.$id.ts` (route), `src/lib/og-card.tsx` (satori JSX + font loader).
- **Edit**: `src/routes/q.$id.tsx` (meta tags), `package.json` (deps).
