import type { Quote } from "@/data/quotes";
import { Link } from "@tanstack/react-router";
import { ShareQuote } from "./ShareQuote";

export function QuoteCard({
  quote,
  footer,
  share = true,
  interpretation,
}: {
  quote: Quote;
  footer?: React.ReactNode;
  share?: boolean;
  interpretation?: string;
}) {
  const slug = authorSlug(quote.author);
  const source = `${quote.work}, ${quote.section}`;
  return (
    <figure className="group relative rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-soft hover:shadow-pop transition-shadow">
      <div className="absolute top-0 left-6 md:left-8 -translate-y-1/2 px-2 bg-card font-display text-4xl leading-none text-accent select-none">
        &ldquo;
      </div>
      <blockquote className="pullquote text-2xl md:text-[1.7rem] text-foreground">
        {quote.text}
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link
          to="/philosophers/$slug"
          params={{ slug }}
          className="font-medium text-foreground hover:text-accent transition"
        >
          {quote.author}
        </Link>
        <span className="opacity-40">·</span>
        <span className="italic">{quote.work}</span>
        <span className="opacity-40">·</span>
        <Link
          to="/q/$id"
          params={{ id: quote.id }}
          className="small-caps text-[11px] hover:text-foreground transition"
        >
          {quote.section}
        </Link>
        {quote.translator ? (
          <>
            <span className="opacity-40">·</span>
            <span className="text-xs">trans. {quote.translator}</span>
          </>
        ) : null}
      </figcaption>
      {footer ? <div className="mt-5 pt-5 border-t border-border/70">{footer}</div> : null}
      {share ? (
        <ShareQuote
          text={quote.text}
          author={quote.author}
          source={source}
          permalinkPath={`/q/${quote.id}`}
          interpretation={interpretation}
        />
      ) : null}
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