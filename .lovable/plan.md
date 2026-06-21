## Reality check first

Per Semrush, **"stoicism" is KDI 68 and "stoics" is KDI 70**. The top 10 is locked up by Wikipedia, Stanford Encyclopedia of Philosophy, IEP, Daily Stoic, Merriam-Webster, and YouTube — sites with decades of authority and thousands of backlinks. Your domain currently has no measurable organic footprint in Semrush.

Cracking top 5 for the head terms is a multi-year project that requires backlinks (PR, guest posts, citations from .edu/.org sites) more than on-page work. **This plan gets the site SEO-correct, indexable, and aimed at winnable queries first**, with a moonshot pillar page for the head terms. Realistic outcome in 6–12 months: top 5 for long-tail "ask"-style queries and quote-specific searches, and a slow climb on the head terms.

---

## Phase 1 — Technical baseline (immediate, ~1 build session)

1. **`src/routes/sitemap[.]xml.ts`** — server route that lists `/`, `/about`, `/ask`, `/history`, `/philosophers`, `/themes`, `/wordsearch`, plus one entry per philosopher slug, theme slug, and quote id (pulled from the same source the `$slug`/`$id` loaders use).
2. **`public/robots.txt`** — `User-agent: *` / `Allow: /` plus `Sitemap: https://askthestoics.org/sitemap.xml`.
3. **Per-route `head()`** on every route file — unique `title`, `description`, `og:title`, `og:description`, `og:url`, `og:type`, self-referencing canonical. Replace any generic root title currently leaking through.
4. **JSON-LD per route type**:
   - `__root.tsx`: `WebSite` + `Organization` (sitewide).
   - `q.$id.tsx`: `Quotation` schema (`text`, `author`, `citation`) — this is how Goodreads dominates quote SERPs.
   - `philosophers.$slug.tsx`: `Person` schema.
   - `themes.$slug.tsx`: `CollectionPage` + `BreadcrumbList`.
   - `about.tsx`, `history.tsx`: `Article`.
5. **OG images** — generate a branded share image per top-level route (paper-and-ink style matching the site). Quote pages get a dynamic OG image showing the quote text.
6. **Render-on-server check** — confirm `/q/:id`, `/philosophers/:slug`, `/themes/:slug` ship full HTML (loader data in initial response), not just a JS shell. Google can render JS but indexes server-HTML faster and more reliably.

## Phase 2 — Quote and entity pages (high-volume, winnable)

7. **`/q/:id` title format**: `"{Quote text, truncated} — {Philosopher}, {Work}"`. Description: full quote + 1-sentence context. H1 is the quote itself.
8. **`/philosophers/:slug`**: title `"{Name} — Stoic Philosopher | Quotes, Works, Ideas"`. Add a 200–400 word bio section (currently likely just quote list) — thin pages don't rank.
9. **`/themes/:slug`**: title `"Stoicism on {Theme} — Quotes & Teachings"`. Add a 150–300 word intro explaining the Stoic view on that theme above the quote grid.
10. **Internal linking** — every quote page links to its philosopher page and theme pages; philosopher pages link to top themes; themes link back to philosophers. This is how Wikipedia got dominant.

## Phase 3 — Content pillar pages (the moonshot)

11. **New route `/what-is-stoicism`** — the head-term landing page. 2,000–3,000 words, original, structured with H2s matching the "People Also Ask" questions for "stoicism" (call `semrush--keyword_research` for "stoicism" before writing to get the exact questions). Includes `FAQPage` schema. This is the only page with a real shot at the head term, and only after backlinks accumulate.
12. **New route `/stoic-quotes`** — index/landing page targeting "stoic quotes" (high volume, lower difficulty than "stoicism"). Curated highlights linking into `/q/:id` pages.
13. **New routes for clear long-tail wins** — pick 5–8 from `semrush--keyword_research` output, e.g. `/stoic-advice-for-anxiety`, `/marcus-aurelius-on-death`. Each is a real essay, not a thin redirect.

## Phase 4 — Off-page (the part code can't do)

This is what the plan **cannot deliver from inside Lovable** — flagging it so expectations are right:
- Backlinks from philosophy blogs, Reddit communities, Substack, YouTube creators, .edu citations.
- A consistent publishing cadence (1–2 new long-form posts/month) for at least 6 months.
- Google Search Console verification + sitemap submission (already supported via the GSC connector — can be done after deploy).

---

## Technical notes

- Files to add: `src/routes/sitemap[.]xml.ts`, `public/robots.txt`, `src/routes/what-is-stoicism.tsx`, `src/routes/stoic-quotes.tsx`, plus 5–8 long-tail route files.
- Files to edit: every existing route file in `src/routes/` to add or upgrade `head()`; `__root.tsx` for sitewide JSON-LD and OG defaults.
- OG images: generated via `imagegen` into `src/assets/og/` and referenced as absolute URLs (`https://askthestoics.org/...`) in meta tags.
- Dynamic OG images for quote pages: a server route at `/api/og/q/$id` that renders an image — defer this to a follow-up; static branded fallback ships in Phase 1.

## Out of scope for this plan

- Backlink building, social promotion, GSC submission (off-platform).
- A blog CMS (can add later if you want a publishing workflow vs. hardcoded routes).
- Multi-language SEO.

## Suggested rollout

Phase 1 and 2 in one build session. Phase 3 pillar page in a second session (it needs you to draft or approve the long-form copy). Long-tail routes can land one at a time as you decide which queries to target.
