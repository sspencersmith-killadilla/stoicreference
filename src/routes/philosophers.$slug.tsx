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
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.philosopher.name} — The Stoic Reference` },
          { name: "description", content: loaderData.philosopher.bio.slice(0, 160) },
          { property: "og:title", content: loaderData.philosopher.name },
          { property: "og:description", content: loaderData.philosopher.bio.slice(0, 160) },
        ]
      : [],
  }),
  component: PhilosopherPage,
});

function PhilosopherPage() {
  const { philosopher } = Route.useLoaderData() as { philosopher: Philosopher };
  const quotes = quotesByAuthor(philosopher.name as Quote["author"]);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <Link to="/philosophers" className="text-xs small-caps text-muted-foreground hover:text-foreground">
        ← All philosophers
      </Link>
      <h1 className="mt-4 font-serif text-5xl">{philosopher.name}</h1>
      <p className="small-caps text-xs text-muted-foreground mt-2">{philosopher.era}</p>
      <p className="mt-6 text-lg leading-relaxed font-serif text-foreground/90">{philosopher.bio}</p>

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