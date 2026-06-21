## Stoic Reference — Build Plan

A reference site for Stoicism with an AI-powered question search, philosopher and theme browsing, daily quote, and in-browser history of past questions.

### Pages (TanStack routes)

- `/` — Home. Daily Stoic quote (rotates by date), prominent "Ask the Stoics" search bar, links to philosophers and themes, recent past questions from localStorage.
- `/ask` — Question results page. Shows the question, 3–6 relevant quotes (text, author, source citation, translator note where known), plus a short modern interpretation for each, and an overall synthesis. Saves to localStorage history.
- `/history` — Past questions saved in this browser, with delete + re-open.
- `/philosophers` — Index of Marcus Aurelius, Seneca, Epictetus, Musonius Rufus.
- `/philosophers/$slug` — Bio, key works, ~8 curated quotes with sources.
- `/themes` — Index of themes (Control, Death, Anger, Adversity, Virtue, Desire, Time, Friendship, Fear, Fate).
- `/themes/$slug` — Theme description + curated quotes for that theme.
- `/about` — What Stoicism is, how the site works, attribution note.

### Data model

Curated seed data lives in `src/data/` as typed TS modules (no DB needed — matches the "save in this browser" preference and keeps the build simple):

- `philosophers.ts` — slug, name, era, bio, key works, quotes.
- `themes.ts` — slug, title, description, related quote IDs.
- `quotes.ts` — id, text, author, work, section (e.g. "Meditations 4.7"), translator, themes[]. ~80–120 canonical, verified quotes seeded.

Daily quote = deterministic pick from `quotes.ts` keyed by date so it's stable per day.

### AI Q&A (hybrid)

Server route `src/routes/api/ask.ts` (POST) using AI SDK + Lovable AI Gateway (`google/gemini-3-flash-preview`) with structured output (`Output.object` via Zod):

1. Receives `{ question }`.
2. Sends the full curated `quotes.ts` list (compact form: id, text, author, source, themes) to the model as context.
3. Model returns `{ picks: [{ quoteId, interpretation, relevance }], synthesis }` — picks are chosen from the supplied IDs (canonical, sourced).
4. Model may also return `additional: [{ text, author, source, interpretation }]` for gaps not covered by the seed set, clearly labeled "AI-suggested attribution — verify".
5. Server resolves picks back to full quote records and returns them.

Client calls via `fetch('/api/ask', ...)` from the `/ask` page. While streaming/loading, show a skeleton. Errors (429 rate limit, 402 credits) surface clearly.

### History (localStorage)

- Key: `stoic.history.v1` → `Array<{ id, question, answeredAt, result }>`, capped at 50.
- Saved on successful answer. `/history` lists, opens (re-renders cached result, no re-fetch), and deletes entries.
- No threads, no accounts.

### Design direction

Editorial, calm, paper-like. Warm off-white background, deep ink text, a single accent (muted oxblood or olive). Serif display (Cormorant Garamond) for quotes and headings, clean sans (Inter) for UI. Generous whitespace, large pull-quote treatment, small caps for citations. No gradients, no purple-tech vibe.

### Tech notes

- Stack: existing TanStack Start template, Tailwind v4, shadcn/ui.
- AI: Lovable AI Gateway, server-only key. No Lovable Cloud / DB needed.
- SEO: per-route `head()` with unique title + description for philosophers and themes; `og:image` only on leaves where meaningful (skip for now).
- `public/llms.txt` listing public pages.
- Markdown rendering (`react-markdown`) for interpretations.

### Out of scope

- User accounts, cross-device sync, comments, sharing links to a saved answer.
