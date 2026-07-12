import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { QUOTES } from "@/data/quotes";

const ResponseSchema = z.object({
  synthesis: z.string(),
  picks: z.array(
    z.object({
      quoteId: z.string(),
      interpretation: z.string(),
      relevance: z.string(),
    }),
  ),
  additional: z
    .array(
      z.object({
        text: z.string(),
        author: z.string(),
        source: z.string(),
        interpretation: z.string(),
      }),
    )
    .optional(),
});

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return candidate;
  return candidate.slice(start, end + 1);
}

const EMBED_URL = "https://ai.gateway.lovable.dev/v1/embeddings";
const EMBED_MODEL = "google/gemini-embedding-001";
const EMBED_DIMS = 1536;
const MATCH_COUNT = 24;
const MAX_PER_WORK = 2;
const FINAL_COUNT = 12;

async function embedQuery(input: string, apiKey: string): Promise<number[]> {
  const res = await fetch(EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({ model: EMBED_MODEL, input, dimensions: EMBED_DIMS }),
  });
  if (!res.ok) throw new Error(`embed ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

export const Route = createFileRoute("/api/ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { question?: unknown };
        const question = typeof body.question === "string" ? body.question.trim() : "";
        if (!question || question.length > 500) {
          return new Response("Invalid question", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          // 1. Embed the question.
          const queryEmbedding = await embedQuery(question, key);

          // 2. Retrieve top quotes via pgvector.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: matches, error: matchErr } = await supabaseAdmin.rpc("match_quotes", {
            query_embedding: queryEmbedding as unknown as string,
            match_count: MATCH_COUNT,
          });
          if (matchErr) throw new Error(`match_quotes: ${matchErr.message}`);

          // Diversity filter: cap consecutive picks from the same work so the
          // LLM sees a broader spread (avoids e.g. 6 Senecan letters in a row).
          const perWork = new Map<string, number>();
          const diversified = (matches ?? [])
            .filter((m) => {
              const key = `${m.author}::${m.work}`;
              const seen = perWork.get(key) ?? 0;
              if (seen >= MAX_PER_WORK) return false;
              perWork.set(key, seen + 1);
              return true;
            })
            .slice(0, FINAL_COUNT);

          // Fall back to the static corpus if the DB is unseeded.
          const retrieved =
            diversified.length > 0
              ? diversified.map((m) => ({
                  id: m.id,
                  text: m.text,
                  author: m.author,
                  source: `${m.work} ${m.section}`,
                  themes: m.themes ?? [],
                }))
              : QUOTES.slice(0, FINAL_COUNT).map((q) => ({
                  id: q.id,
                  text: q.text,
                  author: q.author,
                  source: `${q.work} ${q.section}`,
                  themes: q.themes,
                }));

          // 3. Send only the retrieved quotes to the LLM.
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system:
              "You are a careful Stoic scholar. Reply ONLY with a single JSON object, no prose, no markdown fences. The object must have keys: synthesis (string, 3-5 sentences), picks (array of 3-5 objects with quoteId, interpretation [2-3 sentences plain English], relevance [1 sentence]), additional (array, 0-2 objects with text, author, source, interpretation). Pick quoteIds from the supplied corpus only. Never fabricate citations — leave additional empty if unsure.",
            prompt: `User question: ${question}\n\nCandidate quotes (retrieved by semantic search, JSON):\n${JSON.stringify(retrieved)}\n\nReturn the JSON object now.`,
          });

          const jsonStr = extractJson(text);
          const parsed = JSON.parse(jsonStr);
          const out = ResponseSchema.parse(parsed);

          // Hydrate picks from the static QUOTES (canonical metadata for UI),
          // falling back to retrieved rows if the LLM picked a DB-only quote.
          const picks = out.picks
            .map((p) => {
              const fromStatic = QUOTES.find((q) => q.id === p.quoteId);
              if (fromStatic) {
                return {
                  quote: fromStatic,
                  interpretation: p.interpretation,
                  relevance: p.relevance,
                };
              }
              const fromRetrieved = retrieved.find((r) => r.id === p.quoteId);
              if (!fromRetrieved) return null;
              const [work, ...sectionParts] = fromRetrieved.source.split(" ");
              return {
                quote: {
                  id: fromRetrieved.id,
                  text: fromRetrieved.text,
                  author: fromRetrieved.author as never,
                  work,
                  section: sectionParts.join(" "),
                  themes: fromRetrieved.themes,
                },
                interpretation: p.interpretation,
                relevance: p.relevance,
              };
            })
            .filter((p): p is NonNullable<typeof p> => p !== null);

          return Response.json({
            question,
            synthesis: out.synthesis,
            picks,
            additional: out.additional ?? [],
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          const status = /429/.test(msg) ? 429 : /402/.test(msg) ? 402 : 500;
          return new Response(msg, { status });
        }
      },
    },
  },
});
