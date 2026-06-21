import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AskForm } from "@/components/AskForm";
import { QuoteCard } from "@/components/QuoteCard";
import { QUOTES } from "@/data/quotes";
import { PHILOSOPHERS } from "@/data/philosophers";
import { THEMES } from "@/data/themes";
import { loadHistory, type HistoryEntry } from "@/lib/history";
import { pickDailyPuzzle, generateGrid } from "@/data/wordsearch";
import { isSolved } from "@/lib/wordsearch-progress";
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
  const dailyPuzzle = pickDailyPuzzle();
  const [recent, setRecent] = useState<HistoryEntry[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  useEffect(() => {
    setRecent(loadHistory().slice(0, 3));
    setPuzzleSolved(isSolved(dailyPuzzle.id));
  }, [dailyPuzzle.id]);

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[640px] aurora-bg -z-10" aria-hidden />
      <div className="mx-auto max-w-3xl px-6 pt-20 md:pt-28 pb-16">
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1 text-[11px] small-caps text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> A working reference of Stoicism
          </span>
          <h1 className="mt-6 font-display text-6xl md:text-7xl leading-[0.95] tracking-tight">
            Ask the Stoics.
            <br />
            <span className="italic text-muted-foreground">Get a real answer.</span>
          </h1>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            Type any question you carry. We return what Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus actually wrote — sourced, dated, and translated into a modern reading you can share.
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <AskForm autoFocus />
          </div>
        </section>

        <section className="mt-24">
          <div className="flex items-baseline justify-between mb-5">
            <p className="small-caps text-xs text-muted-foreground">Today&rsquo;s meditation</p>
            <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" })}</span>
          </div>
          <QuoteCard quote={daily} />
        </section>

        <section className="mt-10">
          <Link
            to="/wordsearch"
            className="group block rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-foreground/30 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="small-caps text-xs text-muted-foreground">Today&rsquo;s puzzle</p>
                <h2 className="mt-1 font-display text-2xl">{dailyPuzzle.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">A themed Stoic word search. Find them all.</p>
              </div>
              <MiniGridPreview />
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
              {puzzleSolved ? <span className="text-accent">✓ Solved today</span> : <span>Play →</span>}
            </div>
          </Link>
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

        <section className="mt-24 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl">Philosophers</h2>
              <Link to="/philosophers" className="text-xs text-muted-foreground hover:text-foreground">All →</Link>
            </div>
            <ul className="space-y-1">
              {PHILOSOPHERS.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/philosophers/$slug"
                    params={{ slug: p.slug }}
                    className="flex items-center justify-between rounded-lg px-3 py-2 -mx-3 hover:bg-secondary transition group"
                  >
                    <span className="font-display text-lg">{p.name}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground">{p.era}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl">Themes</h2>
              <Link to="/themes" className="text-xs text-muted-foreground hover:text-foreground">All →</Link>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {THEMES.map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/themes/$slug"
                    params={{ slug: t.slug }}
                    className="inline-block text-sm rounded-full border border-border bg-background px-3 py-1.5 hover:bg-secondary hover:border-foreground/30 transition"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
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

function MiniGridPreview() {
  // Decorative 5x5 grid hint for the puzzle teaser.
  const pattern = [
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],
  ];
  return (
    <div className="hidden sm:grid grid-cols-5 gap-[2px] bg-foreground/70 p-[2px] rounded-md w-20 h-20 shrink-0" aria-hidden>
      {pattern.flat().map((v, i) => (
        <div key={i} className={v ? "bg-background" : "bg-foreground"} />
      ))}
    </div>
  );
}
