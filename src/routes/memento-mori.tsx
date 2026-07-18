import { createFileRoute, Link } from "@tanstack/react-router";
import { QUOTES } from "@/data/quotes";

const URL = "https://askthestoics.org/memento-mori";
const TITLE = "Memento Mori — The Stoic Practice of Remembering Death";
const DESC =
  "Memento Mori — 'remember you will die' — is a central Stoic practice. What it means, where it comes from, and how Marcus Aurelius, Seneca, and Epictetus taught it.";

// A handful of death-tagged passages for the guide.
const HIGHLIGHT_IDS = ["ma-2-11", "ma-4-17", "ma-8-47", "se-ep-1", "se-ep-13", "ep-en-1"];

export const Route = createFileRoute("/memento-mori")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Memento Mori — A Stoic Guide" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Memento Mori — A Stoic Guide" },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Memento Mori — The Stoic Practice of Remembering Death",
          description: DESC,
          url: URL,
          about: "Memento Mori",
          keywords: ["memento mori", "stoicism", "death", "mortality", "Marcus Aurelius", "Seneca"],
        }),
      },
    ],
  }),
  component: MementoMoriPage,
});

function MementoMoriPage() {
  const highlights = HIGHLIGHT_IDS.map((id) => QUOTES.find((q) => q.id === id)).filter(
    (q): q is (typeof QUOTES)[number] => Boolean(q),
  );

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="small-caps text-xs text-muted-foreground">A Stoic guide</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05] tracking-tight italic">
        Memento Mori
      </h1>
      <p className="mt-6 font-serif text-xl leading-relaxed text-foreground/90">
        <em>Memento mori</em> — Latin for &ldquo;remember you will die&rdquo; — is one of the oldest
        and most misunderstood Stoic practices. It is not morbid. It is a way of clarifying life:
        the certainty of death used as a lens to strip away what does not matter and press us to
        act well now.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl italic">Origins of the phrase</h2>
        <p className="mt-4 leading-relaxed text-foreground/90">
          Roman tradition holds that a servant would whisper <em>memento mori</em> to a victorious
          general during his triumphal procession — a reminder that the crown was borrowed and the
          man beneath it mortal. Whether or not the anecdote is historical, the phrase captures
          something the Stoics practiced daily long before it was formalized in Christian
          contemplative traditions and later in Renaissance art.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-3xl italic">How the Stoics practiced it</h2>
        <p className="mt-4 leading-relaxed text-foreground/90">
          Marcus Aurelius reminds himself to &ldquo;do every act of your life as if it were the
          last.&rdquo; Seneca, in his letters to Lucilius, teaches that we are not given a short
          life — we make it short. Epictetus tells students to keep death daily before their eyes,
          not to become gloomy, but to burn away pettiness. The point in each case is the same:
          contemplating the end reorders the middle.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-3xl italic">Anchor passages</h2>
        <div className="mt-6 space-y-10">
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
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl italic">A practical exercise</h2>
        <p className="mt-4 leading-relaxed text-foreground/90">
          Once a day — the Stoics recommended morning — pause and consider that this could be your
          last. Not as dread, but as focus. Notice how quickly resentment, procrastination, and
          minor grievances lose their weight. What remains is what mattered all along: to act
          well, to be just, to be useful.
        </p>
      </section>

      <div className="mt-16 border-t border-border pt-8 flex flex-wrap gap-4">
        <Link
          to="/themes/$slug"
          params={{ slug: "death" }}
          className="rounded-full bg-foreground text-background px-5 py-2 text-sm hover:opacity-90 transition"
        >
          More on mortality →
        </Link>
        <Link
          to="/ask"
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary transition"
        >
          Ask the Stoics
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