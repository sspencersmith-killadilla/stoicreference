import { QUOTES } from "./quotes";

export type Philosopher = {
  slug: string;
  name: string;
  era: string;
  bio: string;
  works: { title: string; note: string }[];
};

export const PHILOSOPHERS: Philosopher[] = [
  {
    slug: "marcus-aurelius",
    name: "Marcus Aurelius",
    era: "121–180 CE · Rome",
    bio: "Roman emperor from 161 to 180 CE and the last of the so-called Five Good Emperors. His private notebook, written in Greek during military campaigns on the northern frontier, was never intended for publication. It survives as the Meditations — twelve short books of self-address by a man trying, daily, to live according to Stoic principle while ruling an empire.",
    works: [
      { title: "Meditations", note: "Personal journal in 12 books; reminders to himself on duty, mortality, and self-mastery." },
    ],
  },
  {
    slug: "seneca",
    name: "Seneca the Younger",
    era: "c. 4 BCE – 65 CE · Rome",
    bio: "Statesman, playwright, and tutor to the emperor Nero. Seneca is the most literary of the Stoics: his letters and essays are full of practical advice on grief, anger, friendship, wealth, and the use of time. He was eventually forced by Nero to take his own life — an end he met, by ancient accounts, with composure.",
    works: [
      { title: "Letters to Lucilius", note: "124 letters of moral guidance — Stoicism made portable." },
      { title: "On the Shortness of Life", note: "Essay arguing life is long enough if not squandered." },
      { title: "On Anger", note: "Three books diagnosing anger and prescribing remedies." },
      { title: "On Providence", note: "Why bad things happen to good people, in a Stoic frame." },
    ],
  },
  {
    slug: "epictetus",
    name: "Epictetus",
    era: "c. 50 – 135 CE · Rome & Nicopolis",
    bio: "Born a slave in Phrygia, Epictetus studied Stoicism while still enslaved, was freed, taught in Rome, and after expulsion by Domitian founded a school in Nicopolis. He wrote nothing himself; his pupil Arrian preserved the lectures as the Discourses and the brief handbook called the Enchiridion. His core teaching: distinguish absolutely between what is and is not in our power.",
    works: [
      { title: "Enchiridion", note: "The 'handbook' — a short, severe distillation of the Discourses." },
      { title: "Discourses", note: "Four surviving books of classroom talks recorded by Arrian." },
    ],
  },
  {
    slug: "musonius-rufus",
    name: "Musonius Rufus",
    era: "c. 20 – 100 CE · Rome",
    bio: "A Roman Stoic teacher, exiled twice for his philosophical influence. Musonius taught Epictetus and argued — unusually for his time — that women should study philosophy on the same terms as men. His surviving lectures are practical: on food, clothing, marriage, exile, and how to live consistently with virtue.",
    works: [
      { title: "Lectures", note: "Fragments preserved by his student Lucius; everyday Stoic practice." },
    ],
  },
];

export function getPhilosopher(slug: string) {
  return PHILOSOPHERS.find((p) => p.slug === slug);
}

export function quotesByAuthor(name: Philosopher["name"]) {
  return QUOTES.filter((q) => q.author === name);
}