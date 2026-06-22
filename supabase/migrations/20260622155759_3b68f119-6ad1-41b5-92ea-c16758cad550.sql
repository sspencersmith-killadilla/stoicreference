
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.quotes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  work TEXT NOT NULL,
  section TEXT NOT NULL,
  translator TEXT,
  themes TEXT[] NOT NULL DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quotes TO anon, authenticated;
GRANT ALL ON public.quotes TO service_role;

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quotes are publicly readable"
  ON public.quotes FOR SELECT
  USING (true);

CREATE INDEX quotes_embedding_idx
  ON public.quotes USING hnsw (embedding vector_cosine_ops);

CREATE OR REPLACE FUNCTION public.match_quotes(
  query_embedding vector(1536),
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

GRANT EXECUTE ON FUNCTION public.match_quotes(vector, int) TO anon, authenticated, service_role;
