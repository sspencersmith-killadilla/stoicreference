import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { QUOTES } from "@/data/quotes";
import { QuoteCard } from "@/components/QuoteCard";
import { THEMES } from "@/data/themes";

export const Route = createFileRoute("/q/$id")({
  loader: ({ params }) => {
    const quote = QUOTES.find((q) => q.id === params.id);
    if (!quote) throw notFound();
    return { quote };
  },
  head: ({ loaderData, params }) => {
    const q = loaderData?.quote;
    if (!q) {
      return { meta: [{ title: "Quote not found — Stoic.ref" }] };
    }
    const title = `${q.author} on ${q.work} ${q.section} — Stoic.ref`;
    const desc = `"${q.text}" — ${q.author}, ${q.work} ${q.section}`;
    const ogImage = `https://askthestoics.org/api/public/og/q/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: `${q.author} — ${q.work} ${q.section}` },
        { property: "og:description", content: `"${q.text}"` },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://askthestoics.org/q/${params.id}` },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: `"${q.text}" — ${q.author}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${q.author} — ${q.work} ${q.section}` },
        { name: "twitter:description", content: `"${q.text}"` },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: `https://askthestoics.org/q/${params.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quotation",
            text: q.text,
            spokenByCharacter: q.author,
            citation: `${q.work}, ${q.section}${q.translator ? `, trans. ${q.translator}` : ""}`,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="small-caps text-xs text-muted-foreground">Not found</p>
      <h1 className="font-display text-4xl mt-3">That quote isn't in the reference.</h1>
      <Link to="/" className="mt-6 inline-block text-accent hover:underline">Return home →</Link>
    </div>
  ),
  component: QuotePage,
});

function QuotePage() {
  const { quote } = Route.useLoaderData();
  const related = QUOTES.filter(
    (q) => q.id !== quote.id && q.themes.some((t) => quote.themes.includes(t)),
  ).slice(0, 3);
  const themes = THEMES.filter((t) => quote.themes.includes(t.slug));

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] aurora-bg -z-10" aria-hidden />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="small-caps text-xs text-muted-foreground text-center">
          A passage from {quote.author}
        </p>
        <h1 className="sr-only">{quote.author}, {quote.work} {quote.section}</h1>
        <div className="mt-6">
          <QuoteCard quote={quote} />
        </div>

        {themes.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2 justify-center">
            {themes.map((t) => (
              <Link
                key={t.slug}
                to="/themes/$slug"
                params={{ slug: t.slug }}
                className="text-xs rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition"
              >
                {t.title}
              </Link>
            ))}
          </div>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-16">
            <p className="small-caps text-xs text-muted-foreground mb-5">Related passages</p>
            <div className="space-y-6">
              {related.map((r) => (
                <QuoteCard key={r.id} quote={r} share={false} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}