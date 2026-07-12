import { createFileRoute, Link } from "@tanstack/react-router";
import { QUOTES } from "@/data/quotes";
import { PHILOSOPHERS } from "@/data/philosophers";
import { THEMES } from "@/data/themes";

const URL = "https://askthestoics.org/stoic-quotes";
const TITLE = "Stoic Quotes — Sourced Passages from Marcus Aurelius, Seneca & Epictetus";
const DESC =
  "A curated reference of Stoic quotes from Marcus Aurelius, Seneca, Epictetus, Musonius Rufus, and the founders of the school — every quote sourced to work, section, and translator.";

// Highlight one anchor quote per major philosopher.
const HIGHLIGHT_IDS = [
  "ma-8-47", // Marcus Aurelius
  "se-ep-13", // Seneca
  "ep-en-1", // Epictetus
  "mu-6", // Musonius
  "ze-dl-2", // Zeno
  "cl-hymn-1", // Cleanthes
];

export const Route = createFileRoute("/stoic-quotes")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Stoic Quotes" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Stoic Quotes" },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Stoic Quotes",
          description: DESC,
          url: URL,
        }),
      },
    ],
  }),
  component: StoicQuotesPage,
});

function StoicQuotesPage() {
  const highlights = HIGHLIGHT_IDS.map((id) => QUOTES.find((q) => q.id === id)).filter(
    (q): q is (typeof QUOTES)[number] => Boolean(q),
  );

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="small-caps text-xs text-muted-foreground">A reference</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05] tracking-tight">
        Stoic Quotes
      </h1>
      <p className="mt-6 font-serif text-xl leading-relaxed text-foreground/90">
        A curated archive of {QUOTES.length} passages from the Stoic canon — drawn from Marcus
        Aurelius's <em>Meditations</em>, Seneca's <em>Letters</em> and essays, Epictetus's{" "}
        <em>Enchiridion</em> and <em>Discourses</em>, Musonius Rufus's <em>Lectures</em>, and the
        surviving fragments of the early Greek Stoics. Every quote is sourced to its work, section,
        and translator. For an interpretation in plain English, type a question on the{" "}
        <Link to="/ask" className="underline decoration-border underline-offset-4">
          Ask page
        </Link>
        .
      </p>

      <section className="mt-14">
        <h2 className="small-caps text-xs text-muted-foreground mb-6">Anchor passages</h2>
        <div className="space-y-10">
          {highlights.map((q) => (
            <figure key={q.id} className="border-l-2 border-border pl-6">
              <blockquote className="pullquote text-2xl md:text-3xl">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                <Link
                  to="/q/$id"
                  params={{ id: q.id }}
                  className="text-ink hover:underline decoration-border underline-offset-4"
                >
                  {q.author}
                </Link>{" "}
                ·{" "}
                <span className="italic font-display">
                  {q.work}, {q.section}
                </span>
                {q.translator ? ` · trans. ${q.translator}` : ""}
              </figcaption>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Quotation",
                    text: q.text,
                    spokenByCharacter: q.author,
                    citation: `${q.work}, ${q.section}${q.translator ? `, trans. ${q.translator}` : ""}`,
                    url: `https://askthestoics.org/q/${q.id}`,
                  }),
                }}
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-border pt-10">
        <h2 className="font-display text-3xl italic">By Philosopher</h2>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {PHILOSOPHERS.map((p) => {
            const count = QUOTES.filter((q) => q.author === p.name).length;
            if (count === 0) return null;
            return (
              <li key={p.slug}>
                <Link
                  to="/philosophers/$slug"
                  params={{ slug: p.slug }}
                  className="flex items-baseline justify-between py-4 group"
                >
                  <span className="font-display text-lg group-hover:text-ink">{p.name}</span>
                  <span className="small-caps text-[10px] text-muted-foreground">
                    {count} {count === 1 ? "passage" : "passages"} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-20 border-t border-border pt-10">
        <h2 className="font-display text-3xl italic">By Theme</h2>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {THEMES.map((t) => (
            <li key={t.slug}>
              <Link
                to="/themes/$slug"
                params={{ slug: t.slug }}
                className="font-display italic text-lg text-foreground/80 hover:text-ink hover:underline decoration-border underline-offset-4"
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16 border-t border-border pt-8 flex flex-wrap gap-4">
        <Link
          to="/ask"
          className="rounded-full bg-foreground text-background px-5 py-2 text-sm hover:opacity-90 transition"
        >
          Ask the Stoics a question →
        </Link>
        <Link
          to="/what-is-stoicism"
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary transition"
        >
          What is Stoicism?
        </Link>
      </div>
    </article>
  );
}
