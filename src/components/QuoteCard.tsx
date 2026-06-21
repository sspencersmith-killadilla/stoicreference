import type { Quote } from "@/data/quotes";
import { Link } from "@tanstack/react-router";

export function QuoteCard({ quote, footer }: { quote: Quote; footer?: React.ReactNode }) {
  const slug = authorSlug(quote.author);
  return (
    <figure className="border-l-2 border-primary/60 pl-5 py-1">
      <blockquote className="pullquote text-xl md:text-2xl text-foreground">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        <Link to="/philosophers/$slug" params={{ slug }} className="text-foreground hover:underline">
          {quote.author}
        </Link>
        <span className="mx-2">·</span>
        <span className="italic">{quote.work}</span>
        <span className="mx-2">·</span>
        <span className="small-caps">{quote.section}</span>
        {quote.translator ? (
          <>
            <span className="mx-2">·</span>
            <span>trans. {quote.translator}</span>
          </>
        ) : null}
      </figcaption>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </figure>
  );
}

function authorSlug(name: Quote["author"]): string {
  switch (name) {
    case "Marcus Aurelius":
      return "marcus-aurelius";
    case "Seneca":
      return "seneca";
    case "Epictetus":
      return "epictetus";
    case "Musonius Rufus":
      return "musonius-rufus";
  }
}