import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import { AskForm } from "@/components/AskForm";
import { QuoteCard } from "@/components/QuoteCard";
import type { AskResult } from "@/lib/ask-types";
import { saveEntry } from "@/lib/history";

const search = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/ask")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Ask the Stoics — The Stoic Reference" },
      { name: "description", content: "Get sourced Stoic quotes and modern interpretations for any question." },
    ],
  }),
  component: AskPage,
});

function AskPage() {
  const { q } = Route.useSearch();
  const question = q?.trim() ?? "";
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ok"; result: AskResult }
  >({ status: question ? "loading" : "idle" });
  const lastQ = useRef<string | null>(null);

  useEffect(() => {
    if (!question || lastQ.current === question) return;
    lastQ.current = question;
    setState({ status: "loading" });
    const ctl = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
          signal: ctl.signal,
        });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          if (res.status === 429) throw new Error("Rate limited — please wait a moment and try again.");
          if (res.status === 402) throw new Error("AI credits exhausted for this workspace. Add credits in Settings → Plans & credits.");
          throw new Error(body || `Request failed (${res.status})`);
        }
        const result = (await res.json()) as AskResult;
        setState({ status: "ok", result });
        saveEntry({
          id: crypto.randomUUID(),
          question,
          answeredAt: Date.now(),
          result,
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState({ status: "error", message: (err as Error).message });
      }
    })();
    return () => ctl.abort();
  }, [question]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <AskForm />

      {question ? (
        <div className="mt-12">
          <p className="small-caps text-xs text-muted-foreground">You asked</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2 leading-snug italic">
            &ldquo;{question}&rdquo;
          </h1>
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          Enter a question above. <Link to="/themes" className="underline">Or browse by theme.</Link>
        </p>
      )}

      {state.status === "loading" ? <LoadingSkeleton /> : null}
      {state.status === "error" ? (
        <div className="mt-10 border border-destructive/40 bg-destructive/5 text-destructive-foreground rounded-md p-4 text-sm">
          <p className="text-destructive font-medium">Something went wrong.</p>
          <p className="text-foreground/80 mt-1">{state.message}</p>
        </div>
      ) : null}
      {state.status === "ok" ? <Result result={state.result} /> : null}
    </div>
  );
}

function Result({ result }: { result: AskResult }) {
  return (
    <div className="mt-10 space-y-12">
      <section>
        <p className="small-caps text-xs text-muted-foreground mb-3">A reading</p>
        <div className="prose prose-stone max-w-none font-serif text-lg leading-relaxed">
          <ReactMarkdown>{result.synthesis}</ReactMarkdown>
        </div>
      </section>

      <section>
        <p className="small-caps text-xs text-muted-foreground mb-6">From the Stoics</p>
        <div className="space-y-10">
          {result.picks.map((p, i) => (
            <QuoteCard
              key={i}
              quote={p.quote}
              footer={
                <div className="text-sm text-foreground/90 leading-relaxed">
                  <p className="text-xs small-caps text-muted-foreground mb-1">Modern reading</p>
                  <p>{p.interpretation}</p>
                  <p className="mt-2 text-xs text-muted-foreground italic">{p.relevance}</p>
                </div>
              }
            />
          ))}
        </div>
      </section>

      {result.additional.length > 0 ? (
        <section>
          <p className="small-caps text-xs text-muted-foreground mb-3">Further passages</p>
          <p className="text-xs text-muted-foreground mb-6 italic">
            AI-suggested attributions. Verify against a printed edition before quoting.
          </p>
          <div className="space-y-8">
            {result.additional.map((a, i) => (
              <figure key={i} className="border-l-2 border-muted-foreground/30 pl-5">
                <blockquote className="pullquote text-lg">&ldquo;{a.text}&rdquo;</blockquote>
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  {a.author} · <span className="italic">{a.source}</span>
                </figcaption>
                <p className="mt-3 text-sm text-foreground/90">{a.interpretation}</p>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-10 space-y-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-11/12" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-24 bg-muted rounded mt-8" />
      <div className="h-24 bg-muted rounded" />
    </div>
  );
}