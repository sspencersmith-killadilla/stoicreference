const KEY = "stoic.crossword.v1";

export type PuzzleProgress = {
  cells: string[][]; // 5x5 letters entered ("" for empty)
  completedAt?: number;
  revealed?: boolean;
};

type Store = Record<string, PuzzleProgress>;

function readAll(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object") ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function writeAll(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // quota or disabled storage — ignore
  }
}

export function loadProgress(id: string): PuzzleProgress | undefined {
  return readAll()[id];
}

export function saveProgress(id: string, progress: PuzzleProgress) {
  const all = readAll();
  all[id] = progress;
  writeAll(all);
}

export function clearProgress(id: string) {
  const all = readAll();
  delete all[id];
  writeAll(all);
}

export function isSolved(id: string): boolean {
  const p = readAll()[id];
  return !!(p && p.completedAt);
}