import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pickDailyPuzzle, generateGrid, matchSelection, type WordSearch, type Placement } from "@/data/wordsearch";
import { loadProgress, saveProgress, clearProgress } from "@/lib/wordsearch-progress";

export const Route = createFileRoute("/wordsearch")({
  head: () => ({
    meta: [
      { title: "Daily Stoic Word Search — The Stoic Reference" },
      { name: "description", content: "A fresh themed word search every day, drawn from the Stoic canon. Find the hidden virtues." },
      { property: "og:title", content: "Daily Stoic Word Search" },
      { property: "og:description", content: "A fresh themed word search every day, drawn from the Stoic canon." },
    ],
  }),
  component: WordSearchPage,
});

function WordSearchPage() {
  const puzzle = useMemo(() => pickDailyPuzzle(), []);
  return <PuzzleView key={puzzle.id} puzzle={puzzle} />;
}

type Cell = { r: number; c: number };

function cellsBetween(a: Cell, b: Cell): Cell[] {
  const dr = Math.sign(b.r - a.r);
  const dc = Math.sign(b.c - a.c);
  const dist = Math.max(Math.abs(b.r - a.r), Math.abs(b.c - a.c));
  // only straight lines (incl. 45°)
  if (a.r !== b.r && a.c !== b.c && Math.abs(b.r - a.r) !== Math.abs(b.c - a.c)) {
    return [a];
  }
  const out: Cell[] = [];
  for (let i = 0; i <= dist; i++) out.push({ r: a.r + dr * i, c: a.c + dc * i });
  return out;
}

function PuzzleView({ puzzle }: { puzzle: WordSearch }) {
  const { letters, placements } = useMemo(() => generateGrid(puzzle), [puzzle]);
  const [found, setFound] = useState<Placement[]>([]);
  const [start, setStart] = useState<Cell | null>(null);
  const [hover, setHover] = useState<Cell | null>(null);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);

  const solved = found.length === placements.length && placements.length > 0;

  useEffect(() => {
    const saved = loadProgress(puzzle.id);
    if (saved?.found) {
      const restored = placements.filter((p) => saved.found.includes(p.word));
      setFound(restored);
    }
  }, [puzzle.id, placements]);

  useEffect(() => {
    saveProgress(puzzle.id, {
      found: found.map((p) => p.word),
      completedAt: solved ? Date.now() : undefined,
    });
  }, [found, solved, puzzle.id]);

  const selectionCells = useMemo<Cell[]>(() => {
    if (!start) return [];
    if (!hover) return [start];
    return cellsBetween(start, hover);
  }, [start, hover]);

  const foundCellSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of found) {
      for (let i = 0; i < p.word.length; i++) {
        s.add(`${p.row + p.dr * i},${p.col + p.dc * i}`);
      }
    }
    return s;
  }, [found]);

  const selectionSet = useMemo(() => new Set(selectionCells.map((c) => `${c.r},${c.c}`)), [selectionCells]);

  const finish = useCallback((end: Cell) => {
    if (!start) return;
    const hit = matchSelection(placements, start, end);
    if (hit && !found.some((f) => f.word === hit.word)) {
      setFound((prev) => [...prev, hit]);
      setFlash("hit");
    } else if (!hit) {
      setFlash("miss");
    }
    setTimeout(() => setFlash(null), 400);
    setStart(null);
    setHover(null);
  }, [start, placements, found]);

  function reset() {
    setFound([]);
    clearProgress(puzzle.id);
  }

  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] aurora-bg -z-10" aria-hidden />
      <div className="mx-auto max-w-5xl px-6 pt-16 md:pt-20 pb-20">
        <header className="text-center mb-10">
          <p className="small-caps text-xs text-muted-foreground">{dateLabel}</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-tight">Daily Stoic Word Search</h1>
          <p className="mt-3 text-muted-foreground italic font-serif text-lg">{puzzle.title}</p>
        </header>

        <div className="grid md:grid-cols-[1fr,auto] gap-10 md:gap-14 items-start justify-center">
          {/* Word list */}
          <div className="order-2 md:order-1 md:max-w-xs">
            <p className="small-caps text-xs text-muted-foreground mb-3">
              Found {found.length} / {placements.length}
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-1.5 gap-x-4 text-sm">
              {puzzle.words.map((w) => {
                const got = found.some((f) => f.word === w);
                return (
                  <li
                    key={w}
                    className={`tracking-wider font-medium transition ${got ? "text-accent line-through" : "text-foreground/80"}`}
                  >
                    {w}
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={reset} className="rounded-full border border-border bg-background px-4 py-1.5 text-xs hover:bg-secondary transition">Reset</button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Click the first letter, then the last. Words run in all eight directions.
            </p>
          </div>

          {/* Grid */}
          <div className="order-1 md:order-2 mx-auto w-full max-w-[520px]">
            <div
              className={`rounded-2xl border border-border bg-card p-3 shadow-soft select-none ${flash === "miss" ? "ring-2 ring-destructive/40" : ""} ${flash === "hit" ? "ring-2 ring-accent/40" : ""}`}
              onMouseLeave={() => { setHover(null); }}
            >
              <div
                className="grid gap-[2px] bg-foreground/10 rounded-lg overflow-hidden"
                style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
                role="grid"
                aria-label="Word search grid"
              >
                {letters.map((row, r) =>
                  row.map((ch, c) => {
                    const key = `${r},${c}`;
                    const inFound = foundCellSet.has(key);
                    const inSel = selectionSet.has(key);
                    const isStart = start && start.r === r && start.c === c;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          if (!start) { setStart({ r, c }); setHover({ r, c }); }
                          else { finish({ r, c }); }
                        }}
                        onMouseEnter={() => { if (start) setHover({ r, c }); }}
                        className={`aspect-square flex items-center justify-center font-sans text-sm md:text-base font-medium uppercase tabular-nums transition-colors
                          ${inFound ? "bg-accent/20 text-accent-foreground" : "bg-background text-foreground"}
                          ${inSel ? "bg-accent/40 text-foreground" : ""}
                          ${isStart ? "ring-2 ring-accent ring-inset" : ""}
                          hover:bg-accent/15`}
                        aria-label={`Row ${r + 1} column ${c + 1}: ${ch}`}
                      >
                        {ch}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </div>
        </div>

        {solved && (
          <div className="mt-12 mx-auto max-w-2xl rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center shadow-soft">
            <p className="small-caps text-xs text-accent">Solved</p>
            <h2 className="mt-2 font-display text-3xl">All words found.</h2>
            <p className="mt-3 text-muted-foreground font-serif italic text-lg">{puzzle.note}</p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center text-sm">
              <ShareButton puzzle={puzzle} />
              <Link to="/ask" className="rounded-full border border-border bg-background px-4 py-2 hover:bg-secondary transition">Ask a question</Link>
              <Link to="/" className="rounded-full border border-border bg-background px-4 py-2 hover:bg-secondary transition">Home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShareButton({ puzzle }: { puzzle: WordSearch }) {
  const [copied, setCopied] = useState(false);
  const text = `I solved today's Stoic Word Search — "${puzzle.title}". The Stoic Reference.`;
  const url = typeof window !== "undefined" ? window.location.origin + "/wordsearch" : "";
  async function share() {
    try {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (nav.share) {
        await nav.share({ title: "Daily Stoic Word Search", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  return (
    <button onClick={share} className="rounded-full bg-foreground text-background px-4 py-2 hover:opacity-90 transition">
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
