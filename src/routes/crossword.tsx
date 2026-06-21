import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pickDailyPuzzle, type Puzzle } from "@/data/crosswords";
import { loadProgress, saveProgress, clearProgress } from "@/lib/crossword-progress";

export const Route = createFileRoute("/crossword")({
  head: () => ({
    meta: [
      { title: "Daily Stoic Crossword — The Stoic Reference" },
      { name: "description", content: "A fresh five-by-five word-square crossword every day, themed around Stoic philosophy. Solve in two minutes." },
      { property: "og:title", content: "Daily Stoic Crossword" },
      { property: "og:description", content: "A fresh five-by-five word-square crossword every day, themed around Stoic philosophy." },
    ],
  }),
  component: CrosswordPage,
});

type Dir = "across" | "down";

const SIZE = 5;

function emptyGrid(): string[][] {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => ""));
}

function CrosswordPage() {
  const puzzle = useMemo(() => pickDailyPuzzle(), []);
  return <PuzzleView key={puzzle.id} puzzle={puzzle} />;
}

function PuzzleView({ puzzle }: { puzzle: Puzzle }) {
  const [cells, setCells] = useState<string[][]>(emptyGrid);
  const [focus, setFocus] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [dir, setDir] = useState<Dir>("across");
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<null | "checking" | "wrong">(null);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null)),
  );

  // Hydrate from storage
  useEffect(() => {
    const saved = loadProgress(puzzle.id);
    if (saved?.cells) {
      setCells(saved.cells.map((row) => row.slice()));
      if (saved.completedAt) setSolved(true);
    }
  }, [puzzle.id]);

  // Persist on change
  useEffect(() => {
    const allFilled = cells.every((row) => row.every((c) => c.length === 1));
    const correct = allFilled && cells.every((row, r) => row.every((c, ci) => c === puzzle.grid[r][ci]));
    if (correct && !solved) {
      setSolved(true);
      saveProgress(puzzle.id, { cells, completedAt: Date.now() });
    } else {
      saveProgress(puzzle.id, { cells, completedAt: solved ? Date.now() : undefined });
    }
  }, [cells, puzzle, solved]);

  const setCell = useCallback((r: number, c: number, v: string) => {
    setCells((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
      return next;
    });
  }, []);

  const focusCell = useCallback((r: number, c: number) => {
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return;
    setFocus({ r, c });
    inputRefs.current[r]?.[c]?.focus();
    inputRefs.current[r]?.[c]?.select();
  }, []);

  const advance = useCallback((r: number, c: number, d: Dir, backwards = false) => {
    const delta = backwards ? -1 : 1;
    if (d === "across") focusCell(r, c + delta);
    else focusCell(r + delta, c);
  }, [focusCell]);

  function onCellChange(r: number, c: number, raw: string) {
    const v = raw.toUpperCase().replace(/[^A-Z]/g, "");
    if (!v) {
      setCell(r, c, "");
      return;
    }
    setCell(r, c, v[v.length - 1]);
    advance(r, c, dir);
    if (feedback === "wrong") setFeedback(null);
  }

  function onCellKeyDown(e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) {
    const key = e.key;
    if (key === "ArrowRight") { e.preventDefault(); setDir("across"); focusCell(r, c + 1); }
    else if (key === "ArrowLeft") { e.preventDefault(); setDir("across"); focusCell(r, c - 1); }
    else if (key === "ArrowDown") { e.preventDefault(); setDir("down"); focusCell(r + 1, c); }
    else if (key === "ArrowUp") { e.preventDefault(); setDir("down"); focusCell(r - 1, c); }
    else if (key === "Backspace") {
      if (cells[r][c]) {
        setCell(r, c, "");
      } else {
        advance(r, c, dir, true);
        setCells((prev) => {
          const next = prev.map((row) => row.slice());
          if (dir === "across" && c - 1 >= 0) next[r][c - 1] = "";
          if (dir === "down" && r - 1 >= 0) next[r - 1][c] = "";
          return next;
        });
      }
      e.preventDefault();
    } else if (key === " " || key === "Tab") {
      e.preventDefault();
      setDir((d) => (d === "across" ? "down" : "across"));
    } else if (key === "Enter") {
      e.preventDefault();
      setDir((d) => (d === "across" ? "down" : "across"));
    }
  }

  function onCellClick(r: number, c: number) {
    if (focus.r === r && focus.c === c) {
      setDir((d) => (d === "across" ? "down" : "across"));
    }
    focusCell(r, c);
  }

  function check() {
    const allFilled = cells.every((row) => row.every((c) => c.length === 1));
    if (!allFilled) { setFeedback("wrong"); return; }
    const correct = cells.every((row, r) => row.every((c, ci) => c === puzzle.grid[r][ci]));
    if (correct) {
      setSolved(true);
      saveProgress(puzzle.id, { cells, completedAt: Date.now() });
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  function reveal() {
    const next = puzzle.grid.map((row) => row.map((c) => c ?? ""));
    setCells(next);
    setSolved(true);
    saveProgress(puzzle.id, { cells: next, completedAt: Date.now(), revealed: true });
  }

  function clear() {
    setCells(emptyGrid());
    setSolved(false);
    clearProgress(puzzle.id);
    setFeedback(null);
    focusCell(0, 0);
  }

  // active clue
  const activeClue = useMemo(() => {
    if (dir === "across") return puzzle.across[focus.r];
    return puzzle.down[focus.c];
  }, [dir, focus, puzzle]);

  const inActiveWord = (r: number, c: number) =>
    dir === "across" ? r === focus.r : c === focus.c;

  // Cell numbering for word-square pattern.
  function cellLabel(r: number, c: number): string | null {
    if (r === 0 && c === 0) return "1"; // A1 + D1
    if (r === 0) return String(c + 1); // down N
    if (c === 0) return String(r + 1); // across N
    return null;
  }

  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] aurora-bg -z-10" aria-hidden />
      <div className="mx-auto max-w-5xl px-6 pt-16 md:pt-20 pb-20">
        <header className="text-center mb-10">
          <p className="small-caps text-xs text-muted-foreground">{dateLabel}</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-tight">Daily Stoic Crossword</h1>
          <p className="mt-3 text-muted-foreground italic font-serif text-lg">{puzzle.title}</p>
        </header>

        <div className="grid md:grid-cols-[auto,1fr] gap-10 md:gap-14 items-start justify-center">
          {/* GRID */}
          <div className="mx-auto w-full max-w-[420px]">
            <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
              <div
                className={`grid grid-cols-5 gap-[2px] bg-foreground/80 rounded-lg overflow-hidden select-none ${feedback === "wrong" ? "animate-pulse" : ""}`}
                role="grid"
                aria-label="Crossword grid"
              >
                {puzzle.grid.map((row, r) =>
                  row.map((sol, c) => {
                    const isBlack = sol === null;
                    const focused = focus.r === r && focus.c === c;
                    const inWord = !isBlack && inActiveWord(r, c);
                    const label = cellLabel(r, c);
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`relative aspect-square ${isBlack ? "bg-foreground" : "bg-background"}`}
                      >
                        {!isBlack && (
                          <>
                            {label && (
                              <span className="absolute top-0.5 left-1 text-[10px] leading-none text-muted-foreground font-medium tabular-nums">
                                {label}
                              </span>
                            )}
                            <input
                              ref={(el) => { inputRefs.current[r][c] = el; }}
                              value={cells[r][c] ?? ""}
                              onChange={(e) => onCellChange(r, c, e.target.value)}
                              onKeyDown={(e) => onCellKeyDown(e, r, c)}
                              onFocus={() => setFocus({ r, c })}
                              onClick={() => onCellClick(r, c)}
                              maxLength={2}
                              inputMode="text"
                              autoCapitalize="characters"
                              aria-label={`Row ${r + 1} Column ${c + 1}`}
                              className={`absolute inset-0 w-full h-full text-center font-sans text-2xl md:text-3xl font-medium uppercase tracking-wider outline-none transition-colors caret-transparent
                                ${focused ? "bg-accent/25" : inWord ? "bg-accent/10" : "bg-background"}
                                ${solved ? "text-accent" : "text-foreground"}`}
                            />
                          </>
                        )}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Active clue (mobile-friendly) */}
            <div className="mt-4 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm">
              <span className="small-caps text-[10px] text-muted-foreground mr-2">
                {dir} {activeClue.num}
              </span>
              <span>{activeClue.clue}</span>
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <button onClick={check} className="rounded-full border border-border bg-background px-4 py-1.5 text-xs hover:bg-secondary transition">Check</button>
              <button onClick={reveal} className="rounded-full border border-border bg-background px-4 py-1.5 text-xs hover:bg-secondary transition">Reveal</button>
              <button onClick={clear} className="rounded-full border border-border bg-background px-4 py-1.5 text-xs hover:bg-secondary transition">Clear</button>
            </div>
          </div>

          {/* CLUES */}
          <div className="grid sm:grid-cols-2 gap-8">
            <ClueList title="Across" dir="across" clues={puzzle.across} focus={focus} active={dir === "across"}
              onPick={(i) => { setDir("across"); focusCell(i, 0); }} />
            <ClueList title="Down" dir="down" clues={puzzle.down} focus={focus} active={dir === "down"}
              onPick={(i) => { setDir("down"); focusCell(0, i); }} />
          </div>
        </div>

        {solved && (
          <div className="mt-12 mx-auto max-w-2xl rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center shadow-soft">
            <p className="small-caps text-xs text-accent">Solved</p>
            <h2 className="mt-2 font-display text-3xl">Well done.</h2>
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

function ClueList({
  title, dir, clues, focus, active, onPick,
}: {
  title: string;
  dir: Dir;
  clues: { num: number; clue: string; answer: string }[];
  focus: { r: number; c: number };
  active: boolean;
  onPick: (index: number) => void;
}) {
  const activeIdx = active ? (dir === "across" ? focus.r : focus.c) : -1;
  return (
    <div>
      <h3 className="small-caps text-xs text-muted-foreground mb-2">{title}</h3>
      <ol className="space-y-1.5">
        {clues.map((c, i) => (
          <li key={c.num}>
            <button
              onClick={() => onPick(i)}
              className={`w-full text-left text-sm rounded-md px-2 py-1.5 transition ${activeIdx === i ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <span className="tabular-nums text-foreground/80 mr-2">{c.num}.</span>
              {c.clue}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ShareButton({ puzzle }: { puzzle: Puzzle }) {
  const [copied, setCopied] = useState(false);
  const text = `I solved today's Stoic Crossword — "${puzzle.title}". The Stoic Reference.`;
  const url = typeof window !== "undefined" ? window.location.origin + "/crossword" : "";
  async function share() {
    try {
      if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title: "Daily Stoic Crossword", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }
  return (
    <button onClick={share} className="rounded-full bg-foreground text-background px-4 py-2 hover:opacity-90 transition">
      {copied ? "Copied!" : "Share"}
    </button>
  );
}