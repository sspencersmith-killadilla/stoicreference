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
    <figure className="group relative border border-border bg-paper p-8 md:p-12">
      <div className="absolute top-6 left-6 md:top-8 md:left-8 font-display text-2xl leading-none text-foreground/20 select-none transition-opacity group-hover:text-foreground/40">
        &#10033;
      </div>
      <blockquote className="pullquote text-2xl md:text-[1.85rem] pl-8 md:pl-10">
        {quote.text}
      </blockquote>
      <div className="mt-6 flex items-center gap-4 pl-8 md:pl-10">
        <span className="h-px w-8 bg-foreground/50" />
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/70">
        <Link
          to="/philosophers/$slug"
          params={{ slug }}
          className="small-caps text-[11px] text-ink hover:underline decoration-border underline-offset-4"
        >
          {quote.author}
        </Link>
        <span className="opacity-30">·</span>
        <span className="italic">{quote.work}</span>
        <span className="opacity-30">·</span>
        <Link
          to="/q/$id"
          params={{ id: quote.id }}
          className="small-caps text-[10px] hover:text-ink transition"
        >
          {quote.section}
        </Link>
        {quote.translator ? (
          <>
            <span className="opacity-30">·</span>
            <span className="text-xs">trans. {quote.translator}</span>
          </>
        ) : null}
      </figcaption>
      </div>
      {footer ? <div className="mt-6 pt-6 border-t border-border pl-8 md:pl-10">{footer}</div> : null}
      {share ? (
        <div className="pl-8 md:pl-10">
        <ShareQuote
          text={quote.text}
          author={quote.author}
          source={source}
          permalinkPath={`/q/${quote.id}`}
          interpretation={interpretation}
        />
        </div>
      ) : null}
    </figure>
  );
}

function authorSlug(name: Quote["author"]): string {
  switch (name) {
    case "Zeno of Citium":
      return "zeno-of-citium";
    case "Cleanthes":
      return "cleanthes";
    case "Chrysippus":
      return "chrysippus";
    case "Panaetius of Rhodes":
      return "panaetius-of-rhodes";
    case "Posidonius":
      return "posidonius";
    case "Cato the Younger":
      return "cato-the-younger";
    case "Marcus Aurelius":
      return "marcus-aurelius";
    case "Seneca":
      return "seneca";
    case "Epictetus":
      return "epictetus";
    case "Musonius Rufus":
      return "musonius-rufus";
    case "Cicero":
      return "cicero";
    case "Diogenes Laertius":
      return "diogenes-laertius";
    case "Hierocles":
      return "hierocles";
  }
}