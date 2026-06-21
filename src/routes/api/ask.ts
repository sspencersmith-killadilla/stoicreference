import { createFileRoute } from "@tanstack/react-router";
import { generateObject } from "ai";
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

        const compactQuotes = QUOTES.map((q) => ({
          id: q.id,
          text: q.text,
          author: q.author,
          source: `${q.work} ${q.section}`,
          themes: q.themes,
        }));

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const { object: out } = await generateObject({
            model: gateway("google/gemini-3-flash-preview"),
            schema: ResponseSchema,
            system:
              "You are a careful Stoic scholar. Given a user's question about life, select 3-5 of the most relevant quotes from the provided curated corpus by id. For each pick, write a 2-3 sentence modern interpretation in plain English and one short sentence explaining why it answers this question. Then write a 3-5 sentence synthesis weaving them together. If a vital angle is missing from the corpus, you MAY add up to 2 'additional' canonical Stoic quotes you are confident in (Marcus Aurelius, Seneca, Epictetus, Musonius Rufus), with author and source citation; if uncertain, leave additional empty. Never fabricate citations.",
            prompt: `User question: ${question}\n\nCorpus (JSON):\n${JSON.stringify(compactQuotes)}`,
          });
          const picks = out.picks
            .map((p) => {
              const quote = QUOTES.find((q) => q.id === p.quoteId);
              if (!quote) return null;
              return { quote, interpretation: p.interpretation, relevance: p.relevance };
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