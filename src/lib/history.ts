import type { AskResult } from "./ask-types";

const KEY = "stoic.history.v1";
const MAX = 50;

export type HistoryEntry = {
  id: string;
  question: string;
  answeredAt: number;
  result: AskResult;
};

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveEntry(entry: HistoryEntry) {
  if (typeof window === "undefined") return;
  const current = loadHistory().filter((e) => e.id !== entry.id);
  const next = [entry, ...current].slice(0, MAX);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function deleteEntry(id: string) {
  if (typeof window === "undefined") return;
  const next = loadHistory().filter((e) => e.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function getEntry(id: string): HistoryEntry | undefined {
  return loadHistory().find((e) => e.id === id);
}