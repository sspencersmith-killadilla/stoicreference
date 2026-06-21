import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import { AskForm } from "@/components/AskForm";
import { QuoteCard } from "@/components/QuoteCard";
import type { AskResult } from "@/lib/ask-types";
import { saveEntry } from "@/lib/history";
import { ShareQuote } from "@/components/ShareQuote";

const search = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/ask")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Ask the Stoics — Sourced Answers from Marcus Aurelius, Seneca & Epictetus" },
      { name: "description", content: "Ask any question and get sourced Stoic quotes with modern interpretations from Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus." },
      { property: "og:title", content: "Ask the Stoics" },
      { property: "og:description", content: "Sourced Stoic answers to any question." },
      { property: "og:url", content: "https://askthestoics.org/ask" },
    ],
    links: [{ rel: "canonical", href: "https://askthestoics.org/ask" }],
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
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-paper -z-10" aria-hidden />
      <div className="mx-auto max-w-3xl px-6 pt-12 md:pt-16 pb-16">
        <AskForm />

        {question ? (
          <div className="mt-14">
            <p className="small-caps text-xs text-muted-foreground">You asked</p>
            <h1 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05] tracking-tight italic">
              &ldquo;{question}&rdquo;
            </h1>
          </div>
        ) : (
          <p className="mt-16 text-center text-muted-foreground">
            Enter a question above. <Link to="/themes" className="text-ink hover:underline">Or browse by theme.</Link>
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
    </div>
  );
}

function Result({ result }: { result: AskResult }) {
  return (
    <div className="mt-10 space-y-12">
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
        <p className="small-caps text-xs text-muted-foreground mb-3">A reading</p>
        <div className="prose prose-stone max-w-none text-base md:text-lg leading-relaxed">
          <ReactMarkdown>{result.synthesis}</ReactMarkdown>
        </div>
      </section>

      <section>
        <p className="small-caps text-xs text-muted-foreground mb-6">From the Stoics</p>
        <div className="space-y-6">
          {result.picks.map((p, i) => (
            <QuoteCard
              key={i}
              quote={p.quote}
              interpretation={p.interpretation}
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
          <div className="space-y-6">
            {result.additional.map((a, i) => (
              <figure key={i} className="rounded-2xl border border-dashed border-border bg-card/60 p-6">
                <blockquote className="pullquote text-xl">&ldquo;{a.text}&rdquo;</blockquote>
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {a.author} · <span className="italic">{a.source}</span>
                </figcaption>
                <p className="mt-3 text-sm text-foreground/90">{a.interpretation}</p>
                <ShareQuote
                  text={a.text}
                  author={a.author}
                  source={a.source}
                  interpretation={a.interpretation}
                />
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