// Daily Stoic word search. Each puzzle is a themed list of words.
// The grid itself is generated deterministically at render time from the
// puzzle id so it's stable across reloads but varies day-to-day.

export type WordSearch = {
  id: string;
  title: string;
  note: string;
  size: number;
  words: string[];
};

export const PUZZLES: WordSearch[] = [
  {
    id: "ws-001",
    title: "The Four Virtues",
    note: "Wisdom, justice, courage, temperance — the cardinal virtues at the heart of Stoic ethics.",
    size: 12,
    words: ["WISDOM", "JUSTICE", "COURAGE", "TEMPERANCE", "VIRTUE", "REASON", "ETHICS", "SAGE"],
  },
  {
    id: "ws-002",
    title: "Voices of the Stoa",
    note: "From Zeno who founded the school to Marcus who wrote in a war camp.",
    size: 12,
    words: ["ZENO", "MARCUS", "SENECA", "EPICTETUS", "MUSONIUS", "CATO", "CHRYSIPPUS", "CLEANTHES"],
  },
  {
    id: "ws-003",
    title: "Marcus at Dawn",
    note: "From the Meditations: the morning vocabulary of a working emperor.",
    size: 12,
    words: ["DUTY", "NATURE", "PRESENT", "RATIONAL", "SILENCE", "MORTAL", "HUMBLE", "WORK"],
  },
  {
    id: "ws-004",
    title: "Amor Fati",
    note: "Love what is. Accept what happens. The Stoic embrace of fate.",
    size: 12,
    words: ["FATE", "ACCEPT", "OBSTACLE", "PATIENCE", "ENDURE", "CALM", "STORM", "PEACE"],
  },
  {
    id: "ws-005",
    title: "The Discipline of Assent",
    note: "Judgments make the man — not the events themselves.",
    size: 12,
    words: ["ASSENT", "JUDGE", "IMPRESSION", "OPINION", "TRUTH", "DOUBT", "PROOF", "LOGIC"],
  },
  {
    id: "ws-006",
    title: "The Inner Citadel",
    note: "Marcus's metaphor for the mind: a fortress no fortune can breach.",
    size: 12,
    words: ["MIND", "SOUL", "FORTRESS", "GUARD", "FOCUS", "QUIET", "STILL", "INWARD"],
  },
  {
    id: "ws-007",
    title: "Memento Mori",
    note: "Remember you must die — therefore live well, now.",
    size: 12,
    words: ["DEATH", "MORTAL", "BRIEF", "TIME", "DUST", "ASHES", "TODAY", "LEGACY"],
  },
  {
    id: "ws-008",
    title: "Cosmopolis",
    note: "We are citizens of one world. The Stoic city has no walls.",
    size: 12,
    words: ["COSMOS", "CITIZEN", "WORLD", "NATURE", "ORDER", "LOGOS", "UNITY", "REASON"],
  },
];

export function pickDailyPuzzle(date: Date = new Date()): WordSearch {
  const dayIdx = Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000,
  );
  return PUZZLES[dayIdx % PUZZLES.length];
}

// --- Grid generation ---------------------------------------------------------

export type Placement = {
  word: string;
  row: number;
  col: number;
  dr: number;
  dc: number;
};

export type GeneratedGrid = {
  letters: string[][];
  placements: Placement[];
};

function seedFromString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DIRECTIONS: [number, number][] = [
  [0, 1], [1, 0], [1, 1], [-1, 1],
  [0, -1], [-1, 0], [1, -1], [-1, -1],
];

export function generateGrid(puzzle: WordSearch): GeneratedGrid {
  const { size, words, id } = puzzle;
  const rand = mulberry32(seedFromString(id));
  const letters: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const placements: Placement[] = [];

  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    let placed = false;
    for (let attempt = 0; attempt < 400 && !placed; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)];
      const len = word.length;
      if (len > size) break;
      const rMin = dr < 0 ? len - 1 : 0;
      const rMax = dr > 0 ? size - len : size - 1;
      const cMin = dc < 0 ? len - 1 : 0;
      const cMax = dc > 0 ? size - len : size - 1;
      const r0 = rMin + Math.floor(rand() * (rMax - rMin + 1));
      const c0 = cMin + Math.floor(rand() * (cMax - cMin + 1));
      let ok = true;
      for (let i = 0; i < len; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        const ex = letters[r][c];
        if (ex && ex !== word[i]) { ok = false; break; }
      }
      if (!ok) continue;
      for (let i = 0; i < len; i++) {
        letters[r0 + dr * i][c0 + dc * i] = word[i];
      }
      placements.push({ word, row: r0, col: c0, dr, dc });
      placed = true;
    }
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const final: string[][] = letters.map((row) =>
    row.map((c) => c ?? alphabet[Math.floor(rand() * 26)]),
  );
  return { letters: final, placements };
}

export function matchSelection(
  placements: Placement[],
  start: { r: number; c: number },
  end: { r: number; c: number },
): Placement | null {
  const dr0 = end.r - start.r;
  const dc0 = end.c - start.c;
  if (dr0 === 0 && dc0 === 0) return null;
  if (dr0 !== 0 && dc0 !== 0 && Math.abs(dr0) !== Math.abs(dc0)) return null;
  const len = Math.max(Math.abs(dr0), Math.abs(dc0)) + 1;
  const dr = Math.sign(dr0);
  const dc = Math.sign(dc0);
  for (const p of placements) {
    if (p.word.length !== len) continue;
    if (p.row === start.r && p.col === start.c && p.dr === dr && p.dc === dc) return p;
    const endR = p.row + p.dr * (p.word.length - 1);
    const endC = p.col + p.dc * (p.word.length - 1);
    if (endR === start.r && endC === start.c && -p.dr === dr && -p.dc === dc) return p;
  }
  return null;
}
