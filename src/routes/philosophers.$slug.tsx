import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getPhilosopher, quotesByAuthor, type Philosopher } from "@/data/philosophers";
import type { Quote } from "@/data/quotes";
import { QuoteCard } from "@/components/QuoteCard";

export const Route = createFileRoute("/philosophers/$slug")({
  loader: ({ params }) => {
    const p = getPhilosopher(params.slug);
    if (!p) throw notFound();
    return { philosopher: p };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const p = loaderData.philosopher;
    const url = `https://askthestoics.org/philosophers/${params.slug}`;
    const title = `${p.name} — Stoic Philosopher | Quotes, Works & Ideas`;
    const desc = p.bio.replace(/\s+/g, " ").slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: `${p.name} — Stoic Philosopher` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: `${p.name} — Stoic Philosopher` },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: p.name,
            description: p.bio,
            jobTitle: "Stoic Philosopher",
            url,
            sameAs: [`https://en.wikipedia.org/wiki/${p.name.replace(/\s+/g, "_")}`],
            knowsAbout: ["Stoicism", "Ethics", "Philosophy", ...p.works.map((w) => w.title)],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://askthestoics.org/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Philosophers",
                item: "https://askthestoics.org/philosophers",
              },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: PhilosopherPage,
});

function PhilosopherPage() {
  const { philosopher } = Route.useLoaderData() as { philosopher: Philosopher };
  const quotes = quotesByAuthor(philosopher.name as Quote["author"]);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <Link
        to="/philosophers"
        className="text-xs small-caps text-muted-foreground hover:text-foreground"
      >
        ← All philosophers
      </Link>
      <h1 className="mt-4 font-serif text-5xl">{philosopher.name}</h1>
      <p className="small-caps text-xs text-muted-foreground mt-2">{philosopher.era}</p>
      <p className="mt-6 text-lg leading-relaxed font-serif text-foreground/90">
        {philosopher.bio}
      </p>

      <section className="mt-10">
        <h2 className="font-serif text-xl mb-3">Key works</h2>
        <ul className="space-y-3">
          {philosopher.works.map((w) => (
            <li key={w.title}>
              <span className="font-serif text-lg italic">{w.title}</span>
              <span className="text-muted-foreground"> — {w.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-xl mb-6">Selected passages</h2>
        <div className="space-y-10">
          {quotes.map((q) => (
            <QuoteCard key={q.id} quote={q} />
          ))}
        </div>
      </section>
    </article>
  );
}
