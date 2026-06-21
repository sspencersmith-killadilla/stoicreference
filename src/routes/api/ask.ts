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
          const { text } = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system:
              "You are a careful Stoic scholar. Reply ONLY with a single JSON object, no prose, no markdown fences. The object must have keys: synthesis (string, 3-5 sentences), picks (array of 3-5 objects with quoteId, interpretation [2-3 sentences plain English], relevance [1 sentence]), additional (array, 0-2 objects with text, author, source, interpretation). Pick quoteIds from the supplied corpus only. Never fabricate citations — leave additional empty if unsure.",
            prompt: `User question: ${question}\n\nCorpus (JSON):\n${JSON.stringify(compactQuotes)}\n\nReturn the JSON object now.`,
          });

          const jsonStr = extractJson(text);
          const parsed = JSON.parse(jsonStr);
          const out = ResponseSchema.parse(parsed);
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