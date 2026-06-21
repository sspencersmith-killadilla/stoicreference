import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AskForm } from "@/components/AskForm";
import { QUOTES } from "@/data/quotes";
import { PHILOSOPHERS } from "@/data/philosophers";
import { THEMES } from "@/data/themes";
import { loadHistory, type HistoryEntry } from "@/lib/history";
import { pickDailyPuzzle } from "@/data/wordsearch";
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

  const dateLabel = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10 pt-8 pb-16">
      {/* The Frame */}
      <div className="border border-border bg-paper">
        <div className="grid grid-cols-12">
          {/* Specimen — the daily meditation */}
          <section className="col-span-12 lg:col-span-8 p-8 md:p-16 lg:border-r border-border relative group">
            <span
              className="absolute top-8 left-8 md:top-10 md:left-10 font-display text-3xl text-foreground/15 select-none transition-opacity group-hover:text-foreground/30"
              aria-hidden
            >
              &#10033;
            </span>

            <div className="flex items-center gap-4 small-caps text-[10px] text-foreground/60 mb-10 animate-fade-in">
              <span>Daily Specimen</span>
              <span className="h-px w-12 bg-border rule-extend" aria-hidden />
              <span className="text-foreground/40">{dateLabel}</span>
            </div>

            <blockquote className="pullquote text-3xl md:text-5xl lg:text-[3.4rem] animate-fade-in">
              {daily.text}
            </blockquote>

            <div className="mt-10 flex items-center gap-5">
              <span className="h-px w-8 bg-foreground" aria-hidden />
              <div>
                <Link
                  to="/philosophers/$slug"
                  params={{ slug: authorSlug(daily.author) }}
                  className="small-caps text-[11px] text-ink hover:underline decoration-border underline-offset-4 block"
                >
                  {daily.author}
                </Link>
                <span className="text-[11px] text-foreground/60 italic font-display">
                  {daily.work} &middot; {daily.section}
                  {daily.translator ? ` · trans. ${daily.translator}` : ""}
                </span>
              </div>
              <Link
                to="/q/$id"
                params={{ id: daily.id }}
                className="ml-auto small-caps text-[10px] text-foreground/60 hover:text-ink hover:translate-x-1 transition-transform"
              >
                Read &rarr;
              </Link>
            </div>
          </section>

          {/* Instruments — ask + puzzle */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col">
            <div className="p-8 md:p-10 border-t lg:border-t-0 border-border">
              <h2 className="small-caps text-[10px] text-ink mb-3">Consult the Archive</h2>
              <p className="text-[13px] text-foreground/70 leading-relaxed mb-6">
                Type any question you carry. We return what Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus actually wrote — sourced, dated, translated.
              </p>
              <AskForm />
            </div>

            <Link
              to="/wordsearch"
              className="group/puzzle bg-ink p-8 md:p-10 flex-1 min-h-[200px] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="small-caps text-[10px] opacity-60 mb-2">Daily Puzzle</p>
                  <h3 className="font-display text-2xl">{dailyPuzzle.title}</h3>
                </div>
                <MiniGridPreview />
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-[12px] italic font-display opacity-60">A themed Stoic word search.</p>
                <span className="small-caps text-[10px] border-b border-current/30 pb-0.5 group-hover/puzzle:border-current transition-colors">
                  {puzzleSolved ? "Solved ✓" : "Play \u2192"}
                </span>
              </div>
            </Link>
          </aside>
        </div>

        {/* Footer band — index counts */}
        <div className="border-t border-border px-8 md:px-10 py-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-[11px]">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <Link to="/philosophers" className="group flex items-baseline gap-3">
              <span className="small-caps text-[10px] text-foreground/40">Browse</span>
              <span className="font-display italic text-foreground/80 group-hover:text-ink">
                Philosophers ({PHILOSOPHERS.length})
              </span>
            </Link>
            <Link to="/themes" className="group flex items-baseline gap-3">
              <span className="small-caps text-[10px] text-foreground/40">Filter</span>
              <span className="font-display italic text-foreground/80 group-hover:text-ink">
                Themes ({THEMES.length})
              </span>
            </Link>
          </div>
          <span className="text-foreground/40 italic font-display">
            Public-domain sources · AI-assisted readings.
          </span>
        </div>
      </div>

      {/* Recent inquiries — only when present */}
      {recent.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <p className="small-caps text-[10px] text-foreground/50 mb-5">Your recent inquiries</p>
          <ul className="space-y-3">
            {recent.map((e) => (
              <li key={e.id} className="flex items-baseline gap-4">
                <span className="small-caps text-[10px] text-foreground/30 shrink-0">
                  {new Date(e.answeredAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <Link to="/history" className="font-display italic text-lg md:text-xl text-foreground/80 hover:text-ink hover:underline decoration-border underline-offset-4">
                  &ldquo;{e.question}&rdquo;
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Philosophers index — editorial two-column */}
      <section className="mt-20 border-t border-border pt-10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl italic">Philosophers</h2>
          <Link to="/philosophers" className="small-caps text-[10px] text-foreground/60 hover:text-ink">All &rarr;</Link>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {PHILOSOPHERS.map((p) => (
            <li key={p.slug}>
              <Link
                to="/philosophers/$slug"
                params={{ slug: p.slug }}
                className="grid grid-cols-12 gap-4 py-4 group items-baseline"
              >
                <span className="col-span-12 md:col-span-5 font-display text-lg md:text-xl text-foreground/85 group-hover:text-ink">
                  {p.name}
                </span>
                <span className="hidden md:inline col-span-5 text-[12px] text-foreground/55 italic">
                  {p.era}
                </span>
                <span className="hidden md:flex col-span-2 small-caps text-[10px] text-foreground/30 group-hover:text-ink justify-end">
                  Read &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Themes — hairline-bordered editorial tag list */}
      <section className="mt-20 border-t border-border pt-10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl italic">Themes</h2>
          <Link to="/themes" className="small-caps text-[10px] text-foreground/60 hover:text-ink">All &rarr;</Link>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {THEMES.map((t) => (
            <li key={t.slug}>
              <Link
                to="/themes/$slug"
                params={{ slug: t.slug }}
                className="font-display italic text-base md:text-lg text-foreground/75 hover:text-ink hover:underline decoration-border underline-offset-4"
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
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

function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function MiniGridPreview() {
  // Decorative word-search hint, inverted to match the dark puzzle tray.
  const hits = new Set([1, 6, 9, 12, 14]);
  return (
    <div className="grid grid-cols-4 gap-1 shrink-0" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 border border-current/40 ${hits.has(i) ? "bg-current" : ""}`}
        />
      ))}
    </div>
  );
}
