import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTheme, quotesForTheme, type Theme } from "@/data/themes";
import { QuoteCard } from "@/components/QuoteCard";

export const Route = createFileRoute("/themes/$slug")({
  loader: ({ params }) => {
    const t = getTheme(params.slug);
    if (!t) throw notFound();
    return { theme: t };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.theme.title} — The Stoic Reference` },
          { name: "description", content: loaderData.theme.description.slice(0, 160) },
          { property: "og:title", content: loaderData.theme.title },
          { property: "og:description", content: loaderData.theme.description.slice(0, 160) },
        ]
      : [],
  }),
  component: ThemePage,
});

function ThemePage() {
  const { theme } = Route.useLoaderData() as { theme: Theme };
  const quotes = quotesForTheme(theme);
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <Link to="/themes" className="text-xs small-caps text-muted-foreground hover:text-foreground">
        ← All themes
      </Link>
      <h1 className="mt-4 font-serif text-5xl">{theme.title}</h1>
      <p className="mt-6 text-lg leading-relaxed font-serif text-foreground/90">{theme.description}</p>
      <section className="mt-12 space-y-10">
        {quotes.length === 0 ? (
          <p className="text-muted-foreground">No passages curated yet for this theme.</p>
        ) : (
          quotes.map((q) => <QuoteCard key={q.id} quote={q} />)
        )}
      </section>
    </article>
  );
}