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
    slug: "zeno-of-citium",
    name: "Zeno of Citium",
    era: "c. 334 – 262 BCE · Athens",
    bio: "A Phoenician merchant from Citium on Cyprus who, according to legend, lost his cargo in a shipwreck and discovered philosophy by chance in an Athenian bookshop. He studied under the Cynic Crates and others before founding his own school around 300 BCE, teaching in the Stoa Poikile (Painted Porch) from which Stoicism takes its name. None of his writings survive intact; we know him through fragments and reports preserved chiefly by Diogenes Laërtius.",
    works: [
      { title: "Republic", note: "A vision of an ideal community; survives only in fragments." },
      {
        title: "On Human Nature",
        note: "Reportedly the first work to define the goal of life as 'living in agreement with nature.'",
      },
    ],
  },
  {
    slug: "cleanthes",
    name: "Cleanthes",
    era: "c. 330 – 230 BCE · Athens",
    bio: "Zeno's successor as head of the Stoa, and by ancient accounts a man of austere habits who supported himself by hauling water at night. Where Zeno was incisive, Cleanthes was devotional: his Hymn to Zeus, the longest continuous early Stoic text to reach us, treats Stoic providence with the cadence of prayer.",
    works: [
      {
        title: "Hymn to Zeus",
        note: "A 39-line philosophical hymn — the fullest surviving statement of early Stoic theology.",
      },
      {
        title: "Various treatises",
        note: "On the gods, on virtue, on pleasure; survive in fragments.",
      },
    ],
  },
  {
    slug: "chrysippus",
    name: "Chrysippus",
    era: "c. 279 – 206 BCE · Athens",
    bio: "Third head of the Stoa and the system's great architect. Ancient critics quipped: 'Without Chrysippus, there would be no Stoa.' He reputedly wrote more than 700 books on logic, physics, and ethics, working out the technical machinery — propositional logic, the theory of fate, the doctrine of mixture — that the later Romans inherited as common sense. Only fragments survive.",
    works: [
      {
        title: "On Fate",
        note: "Defended a Stoic compatibilism: events are determined, yet assent remains 'up to us.'",
      },
      {
        title: "Logical Investigations",
        note: "Founded the propositional logic that later medieval and modern logicians would rediscover.",
      },
      {
        title: "On Passions",
        note: "Analyzed the emotions as mistaken judgements that can be corrected.",
      },
    ],
  },
  {
    slug: "panaetius-of-rhodes",
    name: "Panaetius of Rhodes",
    era: "c. 185 – 110 BCE · Rhodes & Rome",
    bio: "Head of the Middle Stoa and the figure who carried Stoicism from the Greek schools into Roman public life. A member of the Scipionic Circle in Rome, he softened the early school's severity — admitting that wealth, health, and reputation, while indifferent, were preferable — and shifted its focus toward practical ethics. His lost treatise On Duties is the direct source of Cicero's De Officiis.",
    works: [
      {
        title: "On Duties (Peri tou kathekontos)",
        note: "Lost; reconstructed through Cicero's De Officiis, which adapts its first two books.",
      },
      {
        title: "On Providence",
        note: "Fragments only; argued for divine governance with greater caution than the early Stoa.",
      },
    ],
  },
  {
    slug: "posidonius",
    name: "Posidonius",
    era: "c. 135 – 51 BCE · Rhodes",
    bio: "Student of Panaetius and the most universally learned of the Stoics — astronomer, geographer, historian, ethnographer, and head of the school at Rhodes, where Cicero and Pompey both came to hear him lecture. He revised orthodox Stoic psychology by re-admitting irrational forces in the soul, anticipating Galen's later critique. Almost all of his vast output is lost; quotations survive in Cicero, Seneca, Galen, and Strabo.",
    works: [
      {
        title: "Histories",
        note: "Continued Polybius; survives only in fragments cited by later authors.",
      },
      {
        title: "On the Passions",
        note: "Argued against Chrysippus that the soul contains genuinely non-rational drives.",
      },
      {
        title: "On the Ocean",
        note: "Geographical and physical treatise; reportedly measured the size of the Earth.",
      },
    ],
  },
  {
    slug: "cato-the-younger",
    name: "Cato the Younger",
    era: "95 – 46 BCE · Rome",
    bio: "Roman senator, great-grandson of Cato the Censor, and the most famous Stoic exemplar of the late Republic. He wrote nothing; his philosophy was his conduct — incorruptible, austere, openly opposed to Caesar. After Caesar's victory at Thapsus he took his own life at Utica rather than live under one-man rule. Seneca and later Stoics held him up as proof that Stoic virtue was livable, not merely teachable.",
    works: [
      {
        title: "No writings",
        note: "Known only through reports — Plutarch's Life of Cato Minor, Cicero, and Seneca.",
      },
    ],
  },
  {
    slug: "marcus-aurelius",
    name: "Marcus Aurelius",
    era: "121–180 CE · Rome",
    bio: "Roman emperor from 161 to 180 CE and the last of the so-called Five Good Emperors. His private notebook, written in Greek during military campaigns on the northern frontier, was never intended for publication. It survives as the Meditations — twelve short books of self-address by a man trying, daily, to live according to Stoic principle while ruling an empire.",
    works: [
      {
        title: "Meditations",
        note: "Personal journal in 12 books; reminders to himself on duty, mortality, and self-mastery.",
      },
    ],
  },
  {
    slug: "seneca",
    name: "Seneca the Younger",
    era: "c. 4 BCE – 65 CE · Rome",
    bio: "Statesman, playwright, and tutor to the emperor Nero. Seneca is the most literary of the Stoics: his letters and essays are full of practical advice on grief, anger, friendship, wealth, and the use of time. He was eventually forced by Nero to take his own life — an end he met, by ancient accounts, with composure.",
    works: [
      {
        title: "Letters to Lucilius",
        note: "124 letters of moral guidance — Stoicism made portable.",
      },
      {
        title: "On the Shortness of Life",
        note: "Essay arguing life is long enough if not squandered.",
      },
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
      {
        title: "Enchiridion",
        note: "The 'handbook' — a short, severe distillation of the Discourses.",
      },
      { title: "Discourses", note: "Four surviving books of classroom talks recorded by Arrian." },
    ],
  },
  {
    slug: "musonius-rufus",
    name: "Musonius Rufus",
    era: "c. 20 – 100 CE · Rome",
    bio: "A Roman Stoic teacher, exiled twice for his philosophical influence. Musonius taught Epictetus and argued — unusually for his time — that women should study philosophy on the same terms as men. His surviving lectures are practical: on food, clothing, marriage, exile, and how to live consistently with virtue.",
    works: [
      {
        title: "Lectures",
        note: "Fragments preserved by his student Lucius; everyday Stoic practice.",
      },
    ],
  },
  {
    slug: "cicero",
    name: "Cicero",
    era: "106 – 43 BCE · Rome",
    bio: "Roman statesman, orator, and philosopher who did more than any Roman to make Greek philosophy accessible to Latin readers. Though an Academic skeptic by school affiliation, his ethical writings — especially the Tusculan Disputations and De Officiis — are deeply Stoic in spirit, often adapting Panaetius and Posidonius directly. He is not a Stoic himself, but a primary source for the Stoic tradition as it entered Roman thought.",
    works: [
      {
        title: "Tusculan Disputations",
        note: "Five dialogues on death, pain, grief, emotion, and the happy life; Stoic-influenced.",
      },
      {
        title: "De Officiis",
        note: "On duties — largely an adaptation of Panaetius's lost treatise on ethical conduct.",
      },
      {
        title: "De Finibus",
        note: "Survey of Hellenistic ethical theories; Book III expounds Stoicism at length.",
      },
      {
        title: "De Legibus",
        note: "On laws and natural law, grounded in Stoic ideas of universal reason.",
      },
    ],
  },
  {
    slug: "diogenes-laertius",
    name: "Diogenes Laertius",
    era: "c. 3rd century CE · unknown",
    bio: "A compiler of ancient Greek biography and doxography whose Lives of Eminent Philosophers is the single most important source for the lives and doctrines of the Greek philosophers. His Book 7 preserves hundreds of Stoic fragments and summaries that would otherwise be lost. He is a source, not a Stoic teacher, but his reports are indispensable for the early school.",
    works: [
      {
        title: "Lives of Eminent Philosophers",
        note: "Book 7 is devoted to the Stoics: Zeno, Cleanthes, Chrysippus, and their successors.",
      },
    ],
  },
  {
    slug: "hierocles",
    name: "Hierocles",
    era: "c. 2nd century CE · unknown",
    bio: "A Stoic ethicist whose work survives chiefly in papyrus fragments discovered in Egypt. His Elements of Ethics develops the Stoic doctrine of oikeiosis — the gradual extension of self-love from oneself to family, community, and ultimately all humanity. His famous 'circles of concern' image remains influential in discussions of moral identity and cosmopolitanism.",
    works: [
      {
        title: "Elements of Ethics",
        note: "Papyrus fragments on oikeiosis and the expanding circles of moral concern.",
      },
    ],
  },
];

export function getPhilosopher(slug: string) {
  return PHILOSOPHERS.find((p) => p.slug === slug);
}

export function quotesByAuthor(name: Philosopher["name"]) {
  return QUOTES.filter((q) => q.author === name);
}
