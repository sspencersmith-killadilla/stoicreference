const KEY = "stoic.wordsearch.v1";

export type WSProgress = {
  found: string[]; // words found
  completedAt?: number;
};

type Store = Record<string, WSProgress>;

function readAll(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function writeAll(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function loadProgress(id: string): WSProgress | undefined {
  return readAll()[id];
}

export function saveProgress(id: string, progress: WSProgress) {
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
