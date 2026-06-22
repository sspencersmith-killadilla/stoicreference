
DROP INDEX IF EXISTS public.quotes_embedding_idx;
ALTER TABLE public.quotes ALTER COLUMN embedding TYPE public.vector(1536);
CREATE INDEX quotes_embedding_idx
  ON public.quotes USING hnsw (embedding public.vector_cosine_ops);

CREATE OR REPLACE FUNCTION public.match_quotes(
  query_embedding public.vector(1536),
  match_count int DEFAULT 12
)
RETURNS TABLE (
  id TEXT,
  text TEXT,
  author TEXT,
  work TEXT,
  section TEXT,
  translator TEXT,
  themes TEXT[],
  similarity FLOAT
)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    q.id, q.text, q.author, q.work, q.section, q.translator, q.themes,
    1 - (q.embedding <=> query_embedding) AS similarity
  FROM public.quotes q
  WHERE q.embedding IS NOT NULL
  ORDER BY q.embedding <=> query_embedding
  LIMIT match_count;
$$;
