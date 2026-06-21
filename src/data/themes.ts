import { QUOTES, type Quote } from "./quotes";

export type Theme = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export const THEMES: Theme[] = [
  { slug: "control", title: "What's in Your Control", description: "The dichotomy of control — the single hinge on which Epictetus rests almost everything. Some things depend on us; most do not. Freedom and serenity follow from telling them apart.", tags: ["control","dichotomy-of-control"] },
  { slug: "death", title: "Mortality", description: "Stoics return to death not from morbidity but to clarify life. To remember that you will die is to stop postponing being good.", tags: ["death"] },
  { slug: "anger", title: "Anger", description: "Seneca calls anger 'a brief madness.' The Stoic remedy is to interrupt the judgment that fuels it before it hardens into action.", tags: ["anger"] },
  { slug: "adversity", title: "Adversity", description: "Hardship as the gymnasium of virtue. What stands in the way becomes the way.", tags: ["adversity"] },
  { slug: "virtue", title: "Virtue", description: "For the Stoics there is only one good — virtue — and only one evil — vice. Everything else is preferred or dispreferred, but not decisive.", tags: ["virtue"] },
  { slug: "desire", title: "Desire & Wealth", description: "Train wanting itself. Possessions, status, and pleasure are weather, not weight.", tags: ["desire","wealth"] },
  { slug: "time", title: "Time", description: "The only thing that is wholly ours is time — and the only thing we throw away most freely.", tags: ["time"] },
  { slug: "fear", title: "Fear & Anxiety", description: "Most suffering is rehearsal. The Stoic looks at the worst plainly, and finds it smaller than the dread.", tags: ["fear","anxiety"] },
  { slug: "others", title: "Other People", description: "Begin the day expecting difficult people. Respond from your own character, not theirs.", tags: ["others"] },
  { slug: "fate", title: "Fate & Acceptance", description: "Amor fati — to love what happens. Not passivity, but consent to reality as the ground for action.", tags: ["fate"] },
];

export function getTheme(slug: string) {
  return THEMES.find((t) => t.slug === slug);
}

export function quotesForTheme(theme: Theme): Quote[] {
  return QUOTES.filter((q) => q.themes.some((t) => theme.tags.includes(t)));
}