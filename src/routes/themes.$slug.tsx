import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTheme, quotesForTheme, type Theme } from "@/data/themes";
import { QuoteCard } from "@/components/QuoteCard";

export const Route = createFileRoute("/themes/$slug")({
  loader: ({ params }) => {
    const t = getTheme(params.slug);
    if (!t) throw notFound();
    return { theme: t };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const t = loaderData.theme;
    const url = `https://askthestoics.org/themes/${params.slug}`;
    const title = `Stoicism on ${t.title} — Quotes & Teachings`;
    const desc = t.description.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: `Stoicism on ${t.title}` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: `Stoicism on ${t.title}` },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Stoicism on ${t.title}`,
            description: t.description,
            url,
            about: t.title,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://askthestoics.org/" },
              { "@type": "ListItem", position: 2, name: "Themes", item: "https://askthestoics.org/themes" },
              { "@type": "ListItem", position: 3, name: t.title, item: url },
            ],
          }),
        },
      ],
    };
  },
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