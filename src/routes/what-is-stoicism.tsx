import { createFileRoute, Link } from "@tanstack/react-router";

const URL = "https://askthestoics.org/what-is-stoicism";
const TITLE = "What Is Stoicism? A Plain-English Guide to the Philosophy";
const DESC =
  "Stoicism is a Greco-Roman philosophy practiced as a way of life. A clear, sourced guide to its founders, core ideas, daily practices, and common misconceptions.";

const FAQS = [
  {
    q: "What is Stoicism in simple terms?",
    a: "Stoicism is a practical philosophy that teaches one central distinction: some things are in our control (our judgments, intentions, actions) and most things are not (other people, outcomes, the body). Freedom and tranquility come from focusing on the first and accepting the second. Virtue — wisdom, justice, courage, temperance — is the only true good.",
  },
  {
    q: "Who founded Stoicism?",
    a: "Stoicism was founded around 300 BCE by Zeno of Citium, a Phoenician merchant who, by legend, lost his cargo in a shipwreck and discovered philosophy in an Athenian bookshop. He taught in the Stoa Poikile (Painted Porch), from which the school takes its name. Cleanthes and Chrysippus succeeded him; later Roman Stoics — Seneca, Epictetus, Musonius Rufus, and Marcus Aurelius — wrote the texts most read today.",
  },
  {
    q: "What are the four Stoic virtues?",
    a: "Wisdom (sophia) — knowing what is good, bad, and indifferent. Justice (dikaiosyne) — treating others fairly and acting for the common good. Courage (andreia) — endurance in the face of hardship, including the courage to do right. Temperance (sophrosyne) — self-discipline and moderation in pleasure, desire, and action.",
  },
  {
    q: "What is the dichotomy of control?",
    a: "Epictetus opens the Enchiridion with it: 'Some things are up to us, and some are not up to us.' Up to us are opinion, desire, aversion, and our own actions. Not up to us are body, property, reputation, office — anything mediated by other people or chance. Suffering comes from confusing the two; freedom comes from telling them apart.",
  },
  {
    q: "How do you practice Stoicism daily?",
    a: "Common Stoic practices include morning preparation (Marcus Aurelius's reminders of the day's difficult people), evening review (examining what you did well and badly), negative visualization (premeditatio malorum — imagining loss to defuse fear of it), voluntary discomfort (mild fasting, cold, simple food), and journaling. The point is not asceticism for its own sake but training the judgments behind your reactions.",
  },
  {
    q: "Is Stoicism a religion?",
    a: "No. Stoicism is a philosophy with a metaphysics (the universe is rational and providential), an ethics (virtue is the only good), and a logic. Many Stoics spoke of God or Zeus, but the school is compatible with theism, pantheism, and modern secular practice. What matters is the ethical core, which stands on its own.",
  },
  {
    q: "What's the difference between Stoicism and being stoic?",
    a: "Capital-S Stoicism is the philosophical school. Lowercase 'stoic,' as in 'she's very stoic,' just means emotionally unexpressive — often a stereotype of suppressing feeling. Real Stoicism does not require suppression. It asks you to examine and correct the judgments that produce destructive emotions, not to bottle them up.",
  },
  {
    q: "What should I read to start learning Stoicism?",
    a: "Start with Epictetus's Enchiridion (short, severe, foundational), then Marcus Aurelius's Meditations (a private journal of self-counsel), then a selection of Seneca's Letters to Lucilius (practical and literary). All three are available in good public-domain translations and are short enough to re-read.",
  },
];

export const Route = createFileRoute("/what-is-stoicism")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          url: URL,
          author: { "@type": "Organization", name: "The Stoic Reference" },
          publisher: { "@type": "Organization", name: "The Stoic Reference" },
          mainEntityOfPage: URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: WhatIsStoicismPage,
});

function WhatIsStoicismPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="small-caps text-xs text-muted-foreground">A guide</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05] tracking-tight">
        What Is Stoicism?
      </h1>
      <p className="mt-6 font-serif text-xl leading-relaxed text-foreground/90">
        Stoicism is a Greco-Roman philosophy practiced as a way of life. Its central claim is severe
        and freeing: virtue is the only good, vice the only evil, and everything else — health,
        wealth, reputation, even our bodies — is borrowed. Founded around 300 BCE by{" "}
        <Link
          to="/philosophers/$slug"
          params={{ slug: "zeno-of-citium" }}
          className="underline decoration-border underline-offset-4"
        >
          Zeno of Citium
        </Link>{" "}
        in Athens, it became the dominant philosophy of the educated Roman world and survives in the
        writings of{" "}
        <Link
          to="/philosophers/$slug"
          params={{ slug: "marcus-aurelius" }}
          className="underline decoration-border underline-offset-4"
        >
          Marcus Aurelius
        </Link>
        ,{" "}
        <Link
          to="/philosophers/$slug"
          params={{ slug: "seneca" }}
          className="underline decoration-border underline-offset-4"
        >
          Seneca
        </Link>
        ,{" "}
        <Link
          to="/philosophers/$slug"
          params={{ slug: "epictetus" }}
          className="underline decoration-border underline-offset-4"
        >
          Epictetus
        </Link>
        , and{" "}
        <Link
          to="/philosophers/$slug"
          params={{ slug: "musonius-rufus" }}
          className="underline decoration-border underline-offset-4"
        >
          Musonius Rufus
        </Link>
        .
      </p>

      <h2 className="font-display text-3xl italic mt-14">The Core Claim</h2>
      <p className="mt-4 leading-relaxed">
        Everything that happens to you is either <em>up to you</em> or it isn't. Your judgments,
        intentions, and chosen actions are up to you. Your body, your reputation, the behavior of
        other people, and the outcomes of your projects are not. Stoicism rests almost entirely on
        the discipline of telling these two categories apart and putting all of your moral attention
        on the first.
      </p>
      <p className="mt-4 leading-relaxed">
        From this single move flow the famous results: emotional disturbance is not caused by events
        but by our judgments about events; therefore disturbance can be corrected by correcting the
        judgment, not by changing the world. As Epictetus puts it:{" "}
        <Link
          to="/q/$id"
          params={{ id: "ep-en-5" }}
          className="italic underline decoration-border underline-offset-4"
        >
          "Men are disturbed not by the things which happen, but by the opinions about the things."
        </Link>
      </p>

      <h2 className="font-display text-3xl italic mt-14">The Four Virtues</h2>
      <p className="mt-4 leading-relaxed">
        The Stoics inherited from Plato a fourfold scheme of virtue and made it their entire ethical
        content. There is no other good.
      </p>
      <ul className="mt-6 space-y-4">
        <li>
          <strong className="font-display italic">Wisdom</strong> — knowing what is good, bad, and
          indifferent, and acting on it.
        </li>
        <li>
          <strong className="font-display italic">Justice</strong> — treating others fairly,
          honoring obligations, working for the common good.
        </li>
        <li>
          <strong className="font-display italic">Courage</strong> — endurance in the face of
          hardship, including the courage to do what is right.
        </li>
        <li>
          <strong className="font-display italic">Temperance</strong> — discipline and moderation in
          pleasure, desire, and action.
        </li>
      </ul>

      <h2 className="font-display text-3xl italic mt-14">A Brief History</h2>
      <p className="mt-4 leading-relaxed">
        Stoicism unfolds in three stages. The <em>Early Stoa</em> in Athens (Zeno, Cleanthes,
        Chrysippus, c. 300–150 BCE) worked out the technical system: logic, physics, ethics, each
        interlocked. The <em>Middle Stoa</em> (Panaetius, Posidonius, c. 150–50 BCE) softened the
        early rigor and carried the school into Roman public life. The <em>Late Stoa</em> in Rome
        (Seneca, Musonius, Epictetus, Marcus Aurelius, c. 1–180 CE) is what survives in continuous
        text and is where most modern readers begin. See the{" "}
        <Link to="/history" className="underline decoration-border underline-offset-4">
          full timeline
        </Link>{" "}
        for a sequential view, or the{" "}
        <Link to="/philosophers" className="underline decoration-border underline-offset-4">
          philosophers index
        </Link>{" "}
        for individual biographies.
      </p>

      <h2 className="font-display text-3xl italic mt-14">How to Practice</h2>
      <p className="mt-4 leading-relaxed">
        Stoicism is not a creed to be believed but a discipline to be exercised. The classical
        practices are still the best place to begin:
      </p>
      <ul className="mt-6 space-y-4 list-disc pl-6">
        <li>
          <strong>Morning preparation.</strong> Anticipate the day's difficulties. Marcus Aurelius
          opens Book 2 of the Meditations this way.
        </li>
        <li>
          <strong>Evening review.</strong> At the end of the day, examine what you did, what you
          said, and where you fell short — without flattery or self-pity.
        </li>
        <li>
          <strong>
            Negative visualization (<em>premeditatio malorum</em>).
          </strong>{" "}
          Imagine the loss of what you value. Not to dread it, but to defuse the dread.
        </li>
        <li>
          <strong>The view from above.</strong> Step back imaginatively to see your concerns in the
          scale of a whole life, a whole city, a whole world.
        </li>
        <li>
          <strong>Voluntary discomfort.</strong> Mild fasting, cold, plain food — small rehearsals
          for adversity that loosen your grip on comfort.
        </li>
        <li>
          <strong>Journaling.</strong> Read the Meditations: it is a journal. The point is not
          literature but slow attention to your own judgments.
        </li>
      </ul>

      <h2 className="font-display text-3xl italic mt-14">Common Misconceptions</h2>
      <p className="mt-4 leading-relaxed">
        Stoicism is <em>not</em> emotional suppression. The Stoics never asked you to bottle
        feeling; they asked you to examine the judgments that produce destructive feeling. It is not
        passivity — Marcus governed an empire, Seneca a Senate, Cato died resisting a tyrant. It is
        not a religion, though it has a metaphysics. And it is not the same as being "stoic" in
        modern English, which usually just means unexpressive.
      </p>

      <h2 className="font-display text-3xl italic mt-14">Frequently Asked Questions</h2>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {FAQS.map((f) => (
          <div key={f.q} className="py-6">
            <h3 className="font-display italic text-xl">{f.q}</h3>
            <p className="mt-3 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 border-t border-border pt-8 flex flex-wrap gap-4">
        <Link
          to="/ask"
          className="rounded-full bg-foreground text-background px-5 py-2 text-sm hover:opacity-90 transition"
        >
          Ask the Stoics a question →
        </Link>
        <Link
          to="/stoic-quotes"
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary transition"
        >
          Browse Stoic quotes
        </Link>
      </div>
    </article>
  );
}
