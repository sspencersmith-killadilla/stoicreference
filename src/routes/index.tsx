import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AskForm } from "@/components/AskForm";
import { QuoteCard } from "@/components/QuoteCard";
import { QUOTES } from "@/data/quotes";
import { PHILOSOPHERS } from "@/data/philosophers";
import { THEMES } from "@/data/themes";
import { loadHistory, type HistoryEntry } from "@/lib/history";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Stoic Reference — Ask the Stoics" },
      { name: "description", content: "Type any question about life. Get sourced quotes from Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus, with modern interpretations." },
      { property: "og:title", content: "The Stoic Reference" },
      { property: "og:description", content: "Type any question about life. Get sourced Stoic quotes with modern interpretations." },
    ],
  }),
  component: Index,
});

function Index() {
  const daily = pickDaily();
  const [recent, setRecent] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    setRecent(loadHistory().slice(0, 3));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <section className="text-center">
        <p className="small-caps text-xs text-muted-foreground">A working reference of Stoicism</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-tight">
          Ask the Stoics.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Type any question you carry. We&rsquo;ll return what Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus left us — with sources and a modern reading.
        </p>
        <div className="mt-8">
          <AskForm autoFocus />
        </div>
      </section>

      <section className="mt-20">
        <p className="small-caps text-xs text-muted-foreground mb-4">Today&rsquo;s meditation</p>
        <QuoteCard quote={daily} />
      </section>

      {recent.length > 0 ? (
        <section className="mt-16">
          <p className="small-caps text-xs text-muted-foreground mb-4">Your recent questions</p>
          <ul className="space-y-2">
            {recent.map((e) => (
              <li key={e.id}>
                <Link to="/history" className="text-foreground hover:text-primary font-serif text-lg italic">
                  &ldquo;{e.question}&rdquo;
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-20 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-serif text-2xl mb-3">Philosophers</h2>
          <ul className="space-y-2 text-sm">
            {PHILOSOPHERS.map((p) => (
              <li key={p.slug}>
                <Link to="/philosophers/$slug" params={{ slug: p.slug }} className="hover:text-primary">
                  <span className="font-serif text-lg">{p.name}</span>
                  <span className="text-muted-foreground"> — {p.era}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-2xl mb-3">Themes</h2>
          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            {THEMES.map((t) => (
              <li key={t.slug}>
                <Link to="/themes/$slug" params={{ slug: t.slug }} className="hover:text-primary">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function pickDaily() {
  const now = new Date();
  const dayIdx = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000,
  );
  return QUOTES[dayIdx % QUOTES.length];
}
