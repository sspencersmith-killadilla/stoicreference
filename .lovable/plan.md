
# Retrieval-Based Ask Engine

Right now `/api/ask` ships **every quote** (currently 49) to the LLM on every question. That caps how comprehensive the answer engine can get. This plan switches to **semantic retrieval**: every quote is embedded into a vector once, and each question only sends the top ~12 most relevant quotes to the LLM.

## What changes for the user
- The Ask page works the same — type a question, get a synthesis + cited quotes.
- The corpus grows from ~50 to several hundred quotes initially, with headroom for thousands.
- Answers feel more specific because the model is choosing from quotes that actually match the question, not skimming the whole corpus.

## Architecture

```text
   User question
        │
        ▼
  Embed question (Lovable AI gateway, gemini-embedding-001)
        │
        ▼
  pgvector similarity search in Lovable Cloud
        │
   top ~12 quotes
        │
        ▼
  LLM synthesis (gemini-3-flash-preview) with only those quotes in prompt
        │
        ▼
  Synthesis + cited picks → UI
```

## Implementation steps

1. **Enable Lovable Cloud** (Supabase + pgvector). Required to store embeddings.
2. **Migration**: create `quotes` table (id, text, author, work, section, translator, themes[], embedding vector(3072)) with HNSW index and a `match_quotes(query_embedding, match_count)` function. Public `TO anon` SELECT policy so the Ask endpoint can read.
3. **Seed script** (`scripts/seed-quotes.ts`): reads from `src/data/quotes.ts`, calls the Lovable AI embeddings endpoint per quote, upserts into Postgres. Idempotent by `id`. Run once after each corpus expansion.
4. **Corpus expansion**: grow `src/data/quotes.ts` from 49 to ~250 quotes initially (full Enchiridion coverage, more Meditations books, more Senecan letters, more Musonius lectures). Existing IDs stay stable.
5. **Rewrite `/api/ask`**: embed the question → call `match_quotes` → pass only the retrieved quotes (not the full corpus) to the LLM. Same response shape, so the UI doesn't change.
6. **Browse pages** (philosophers/themes) continue reading from the static `QUOTES` array — no change needed.

## Cost / scale notes
- Embeddings are billed once per quote at seed time (a few cents for hundreds of quotes).
- Each question = 1 small embedding call + 1 LLM call with ~12 quotes in context instead of all of them → **cheaper per question** than today once the corpus passes ~80 quotes.
- Comfortable scaling ceiling: thousands of quotes. Past that we'd tune the HNSW index.

## Out of scope (can do later)
- Multilingual quotes
- Per-user history of asked questions
- Admin UI to add quotes from the browser (would still just call the seed function)

## Open question
**How big should the initial corpus be?** I'll default to ~250 hand-curated quotes (a real working library) unless you want me to push harder toward ~500 in this same pass.
