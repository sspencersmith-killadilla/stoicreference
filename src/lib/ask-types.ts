import type { Quote } from "@/data/quotes";

export type CuratedPick = {
  quote: Quote;
  interpretation: string;
  relevance: string;
};

export type AdditionalPick = {
  text: string;
  author: string;
  source: string;
  interpretation: string;
};

export type AskResult = {
  question: string;
  synthesis: string;
  picks: CuratedPick[];
  additional: AdditionalPick[];
};