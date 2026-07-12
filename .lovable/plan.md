# Plan: Pass B Corpus Expansion

## Goal
Take the current library from 319 quotes to 1,800+ curated passages by completing the major surviving Stoic sources, while preserving the editorial quality of the existing corpus (public-domain translations, verified citations, accurate translator credits, and theme tags).

## What will be added

### Core four authors — primary texts

| Author | Work | Target after pass | Notes |
|---|---|---|---|
| Marcus Aurelius | Meditations | 150 passages | Complete all 12 books with representative passages; every book represented |
| Seneca | Letters to Lucilius | 124 letters | Add every letter that has a usable Stoic teaching; mark as "Letter N" |
| Seneca | On the Shortness of Life | 15 | Fill remaining sections |
| Seneca | On Anger | 20 | Fill remaining books |
| Seneca | On Tranquility of Mind | 15 | Complete |
| Seneca | On Providence | 10 | Complete |
| Seneca | Consolation to Marcia | 10 | New work; grief/loss focus |
| Seneca | Consolation to Helvia | 10 | New work; exile/poverty focus |
| Epictetus | Enchiridion | 53 | Complete all chapters |
| Epictetus | Discourses Books I–II | 80 each | Complete surviving books |
| Epictetus | Discourses Books III–IV | 80 each | New additions; bulk of the expansion |
| Musonius Rufus | Lectures | 21 | Complete the lecture series |

### Early and middle Stoics — balanced fragment set

Add a representative set of ~50–60 passages from:

- Zeno of Citium (fragments via Diogenes Laertius, Lives Book 7)
- Cleanthes (Hymn to Zeus, additional fragments in Stobaeus)
- Chrysippus (fragments in Diogenes Laertius, Plutarch, Galen)
- Panaetius of Rhodes (via Cicero, De Officiis)
- Posidonius (via Cicero, Tusculan Disputations; Seneca Letters)
- Cato the Younger (sayings in Plutarch and Seneca)

These will be reported/attributed fragments, not invented sayings, and will be marked clearly as "Fragments (in ...)."

### New sources

- Cicero, Tusculan Disputations Books 3–5 (Stoic-influenced consolation, endurance, death)
- Cicero, De Officiis Book 1 (Panaetian duty ethics)
- Diogenes Laertius, Lives of Eminent Philosophers Book 7 (Stoic doxography)
- Hierocles, Elements of Ethics (papyrus fragments; oikeiosis)
- Cleanthes, Hymn to Zeus (already partially present; complete)

## New theme pages

Create three new landing pages in `/themes` and add them to `THEMES`:

1. **Grief & Loss** (`/themes/grief`) — tags: `grief`, `loss`
   - Focus: Seneca consolations, Marcus Aurelius on death, Epictetus on returning what is borrowed
2. **Courage** (`/themes/courage`) — tags: `courage`, `fear`
   - Focus: Seneca Letters 78, Epictetus Discourses I.1, Marcus Aurelius on endurance
3. **Friendship** (`/themes/friendship`) — tags: `friendship`, `others`
   - Focus: Cato, Seneca Letters, Epictetus III.24, Cicero on friendship

These pages will follow the existing `src/routes/themes.$slug.tsx` pattern and will be linked from the coverage dashboard and from the main themes index.

## File structure

Instead of one monolithic file, split the corpus into source files and import them into a single `QUOTES` array:

```text
src/data/quotes/
├── index.ts          # exports QUOTES, merges all source arrays
├── marcus.ts
├── seneca-letters.ts
├── seneca-essays.ts
├── epictetus-enchiridion.ts
├── epictetus-discourses.ts
├── musonius.ts
├── early-stoics.ts
└── other-sources.ts
```

The existing `src/data/quotes.ts` and `src/data/quotes-extra.ts` will be merged into this structure. IDs will remain stable; the move is append-only.

## Technical steps

1. **Restructure data files**: create `src/data/quotes/` directory, split existing quotes into the files above, keep stable IDs.
2. **Add new quotes**: append the Pass B corpus across the source files, tagging each with themes and verified citations.
3. **Add new theme pages**: create `src/routes/themes.$slug.tsx` entries for grief, courage, friendship; update `THEMES` in `src/data/themes.ts`.
4. **Update coverage dashboard**: expand `CANONICAL_WORKS` targets to reflect Pass B targets; add new works to the wishlist; add a section for new theme coverage.
5. **Regenerate embeddings**: call `/api/admin/seed-quotes` with the seed secret to embed the new entries. The endpoint is idempotent; it will skip already-embedded quotes and process only the new ones.
6. **Adjust retrieval**: keep `match_count` at 24 or raise it slightly to 30; keep the diversity filter (max 2 per work) in `src/routes/api/ask.ts`.
7. **Validate**: run the build, check the coverage dashboard, and test the ask endpoint with a sample question.

## Quality guardrails

- Every new quote will have: `id`, `text`, `author`, `work`, `section`, `translator`, and `themes`.
- No invented quotes. All passages come from public-domain translations or standard fragment collections.
- No duplicate IDs. IDs use a stable prefix scheme: `ma-` Marcus, `se-` Seneca, `ep-` Epictetus, `mu-` Musonius, `ze-` Zeno, `cl-` Cleanthes, `ch-` Chrysippus, `ci-` Cicero, `dl-` Diogenes Laertius, `hi-` Hierocles, etc.
- Theme tags will be consistent: `grief`, `courage`, `friendship`, `loss`, `anger`, `fear`, `anxiety`, `virtue`, `control`, `fate`, `time`, `death`, `others`, `perception`, `action`, `desire`, `wealth`, `contentment`, `tranquility`, `character`, `nature`, `philosophy`, `gratitude`, `present`, `inner-life`, `power`, `duty`, `dichotomy-of-control`, `adversity`, `preparation`.

## Sizing estimate

- Current: ~319 quotes
- After Pass B: ~1,800+ quotes
- New theme pages: 3
- New source files: 9
- New data rows: ~1,500 embeddings to generate (one-time cost)

## Risks / trade-offs

- The build will be slower because the data bundle is larger; splitting into source files and relying on tree-shaking keeps route payloads reasonable.
- Embedding generation will take several minutes for 1,500 quotes and consumes AI credits. The seed endpoint is idempotent and can be re-run if interrupted.
- Large passages will be chunked at the embedding step if they exceed token limits; the quote text itself stays intact in the UI.

## After approval

Once you approve, I'll start by restructuring the existing data files, then add the new quotes in batches, add the new theme pages, and finally trigger the seed endpoint to generate embeddings.