import { createFileRoute } from "@tanstack/react-router";
import { QUOTES } from "@/data/quotes";

const EMBED_URL = "https://ai.gateway.lovable.dev/v1/embeddings";
const EMBED_MODEL = "google/gemini-embedding-001";
const EMBED_DIMS = 1536;

async function embed(input: string, apiKey: string): Promise<number[]> {
  const res = await fetch(EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input,
      dimensions: EMBED_DIMS,
    }),
  });
  if (!res.ok) {
    throw new Error(`embed ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

export const Route = createFileRoute("/api/admin/seed-quotes")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const seedSecret = process.env.SEED_SECRET;
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!seedSecret) return new Response("SEED_SECRET not set", { status: 500 });
        if (!apiKey) return new Response("LOVABLE_API_KEY not set", { status: 500 });
        if (request.headers.get("x-seed-secret") !== seedSecret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find which ids already have embeddings.
        const { data: existing, error: selErr } = await supabaseAdmin
          .from("quotes")
          .select("id")
          .not("embedding", "is", null);
        if (selErr) return new Response(`select: ${selErr.message}`, { status: 500 });
        const have = new Set((existing ?? []).map((r) => r.id));

        const todo = QUOTES.filter((q) => !have.has(q.id));
        const results: { id: string; ok: boolean; error?: string }[] = [];

        for (const q of todo) {
          try {
            const embedInput = `${q.author} — ${q.work} ${q.section}\nThemes: ${q.themes.join(", ")}\n\n${q.text}`;
            const embedding = await embed(embedInput, apiKey);
            const { error: upErr } = await supabaseAdmin.from("quotes").upsert(
              {
                id: q.id,
                text: q.text,
                author: q.author,
                work: q.work,
                section: q.section,
                translator: q.translator ?? null,
                themes: q.themes,
                embedding: embedding as unknown as string,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" },
            );
            if (upErr) throw new Error(upErr.message);
            results.push({ id: q.id, ok: true });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            results.push({ id: q.id, ok: false, error: msg });
          }
        }

        const ok = results.filter((r) => r.ok).length;
        const failed = results.filter((r) => !r.ok);
        return Response.json({
          total: QUOTES.length,
          alreadyEmbedded: have.size,
          processed: results.length,
          succeeded: ok,
          failed: failed.length,
          failures: failed.slice(0, 10),
        });
      },
    },
  },
});