## How big can the library get?

With the retrieval engine in place, the ceiling is much higher than the current 136 quotes. Here's the honest breakdown of where the limits actually are.

### Practical scale tiers

| Tier | Size | What it takes | What it feels like |
|---|---|---|---|
| Current | ~136 | Already built | Solid coverage of headline themes; some questions still return the same 3–4 passages. |
| Comprehensive | ~500–800 | 1 expansion pass | Full *Enchiridion*, most of *Meditations*, ~40 Senecan letters, core *Discourses*, all Musonius lectures. Ask rarely repeats itself. |
| Near-complete core canon | ~1,500–2,500 | 2–3 passes | All of *Meditations* + *Enchiridion* + *Letters to Lucilius* + *Discourses* Books 1–4 + Musonius + selected Seneca essays (*On Anger*, *On the Shortness of Life*, *On Providence*, etc.). This is essentially "every quotable passage in the surviving Roman Stoic corpus in English." |
| Full scholarly corpus | 5,000+ | Ongoing | Adds Cicero's Stoic passages, Diogenes Laertius Book 7, Cleanthes, Chrysippus fragments, Hierocles, Marcus's letters to Fronto, later Stoic-adjacent writers. Diminishing returns past this point — much is fragmentary or repetitive. |

### The real constraints

1. **Retrieval quality, not size.** pgvector + HNSW handles tens of thousands of rows with sub-100ms search. Size is not the bottleneck.
2. **Curation time.** Every quote needs text, accurate citation (work + book/section), a translator credit, and 1–3 theme tags. Machine-scraped quotes are riddled with misattributions ("The best revenge…" — not Marcus). Hand-verification against public-domain editions (Long, Hard, Gummere, Higginson, Oldfather) is the slow step.
3. **Embedding cost.** One-time, cheap. ~$0.15 per 1,000 quotes at current Gemini embedding pricing. Not a factor.
4. **Theme taxonomy.** At ~500+ quotes the current 10 themes get crowded. We'd add sub-themes (e.g. `virtue/justice`, `virtue/courage`, `desire/pleasure`, `others/friendship`, `time/procrastination`) so browse pages stay readable.

### Recommendation

Do this in two passes rather than one giant dump:

**Pass A — Comprehensive (target ~600 quotes)**
- Complete *Enchiridion* (all 53 chapters)
- Expand *Meditations* to ~150 passages (from current ~30) across all 12 books
- Add ~80 Senecan letter excerpts covering the most cited letters (1, 2, 7, 12, 16, 26, 47, 48, 54, 63, 77, 91, 96, 101, 104, 107, 116, 118, 122)
- Add ~60 passages from *Discourses* Books 1–2
- Complete Musonius (all 21 lectures, ~40 excerpts)
- Add Seneca's *On the Shortness of Life* and *On Anger* highlights (~40)
- Expand theme taxonomy to ~20 sub-themes; retag existing quotes; add a `themes` browse page redesign only if needed (browse pages already scale).

**Pass B — Near-complete (target ~1,800, later)**
- Finish *Discourses* Books 3–4
- Fill in remaining Senecan letters and essays
- Add Cicero (*Tusculan Disputations* Book 3–5, *De Officiis* Book 1) and Diogenes Laertius Book 7 on Zeno/Chrysippus
- Add Hierocles fragments and Cleanthes' *Hymn to Zeus*

### What changes structurally

- **Data file split.** `src/data/quotes.ts` at 600+ entries is unwieldy. Split into `quotes/marcus.ts`, `quotes/seneca-letters.ts`, `quotes/seneca-essays.ts`, `quotes/epictetus-enchiridion.ts`, `quotes/epictetus-discourses.ts`, `quotes/musonius.ts`, with `quotes/index.ts` re-exporting a merged `QUOTES` array. IDs stay stable.
- **Sub-theme taxonomy.** Add a `subthemes: string[]` field alongside `themes`. Theme pages still work off `themes`; philosopher pages and Ask both benefit from finer tags.
- **Seed endpoint stays idempotent.** Only new IDs get embedded; existing rows are untouched. Re-running is safe and cheap.
- **Retrieval tuning.** Bump `match_count` from 12 to 20, and post-filter to top 8–10 by diversity (avoid returning 6 passages from the same Senecan letter). Small change in `src/routes/api/ask.ts`.
- **Sitemap.** Already generated; grows automatically with more theme/philosopher pages. No change needed unless we add per-quote canonical pages, which we could — `/q/[id]` routes for SEO and sharing.

### Optional but worth considering

- **Per-quote permalink pages** (`/quotes/marcus-med-4-3`) — big SEO win, one route file, hydrated from static data. Currently `/q/[id]` exists for share cards but isn't a full page.
- **"More like this"** on each quote page, powered by the same pgvector similarity search.
- **Attribution audit pass** on the existing 136 — some translator credits are approximate and worth verifying against the actual public-domain editions before we 5x the corpus on top of them.

### What I'd do this turn if you approve

Just Pass A: bring the corpus to ~600 hand-curated, cited quotes, split the data files, add sub-themes, tune retrieval, and re-run the seed. No UI changes beyond theme page tag chips. Roughly a large single implementation pass; the browse pages, Ask engine, and sitemap all absorb the growth without redesign.

Say the word and I'll execute Pass A. Or tell me to aim higher (Pass B in one go) or narrower (e.g. "just finish Enchiridion + Meditations").
