import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { QUOTES, type Quote } from "@/data/quotes";
import { THEMES, quotesForTheme } from "@/data/themes";

export const Route = createFileRoute("/coverage")({
  head: () => ({
    meta: [
      { title: "Corpus Coverage — Which Stoic Themes Are Comprehensive" },
      {
        name: "description",
        content:
          "A live audit of the Stoic quote corpus: how comprehensive each theme is, which philosophers and works are covered, and which canonical passages are still missing.",
      },
      { property: "og:title", content: "Corpus Coverage" },
      {
        property: "og:description",
        content: "How comprehensive each Stoic theme is, and what's still missing.",
      },
      { property: "og:url", content: "https://askthestoics.org/coverage" },
    ],
    links: [{ rel: "canonical", href: "https://askthestoics.org/coverage" }],
  }),
  component: CoveragePage,
});

const CORE_AUTHORS = ["Marcus Aurelius", "Seneca", "Epictetus", "Musonius Rufus"] as const;

// Canonical works we consider "in scope" for the current corpus. Used to
// surface which primary texts are represented and which are still thin.
const CANONICAL_WORKS: Array<{ author: string; work: string; target: number }> = [
  { author: "Marcus Aurelius", work: "Meditations", target: 150 },
  { author: "Seneca", work: "Letters to Lucilius", target: 124 },
  { author: "Seneca", work: "On the Shortness of Life", target: 15 },
  { author: "Seneca", work: "On Anger", target: 20 },
  { author: "Seneca", work: "On Tranquility of Mind", target: 15 },
  { author: "Seneca", work: "On Providence", target: 10 },
  { author: "Seneca", work: "Consolation to Marcia", target: 10 },
  { author: "Seneca", work: "Consolation to Helvia", target: 10 },
  { author: "Seneca", work: "On the Happy Life", target: 10 },
  { author: "Seneca", work: "On Clemency", target: 5 },
  { author: "Seneca", work: "On Benefits", target: 5 },
  { author: "Epictetus", work: "Enchiridion", target: 53 },
  { author: "Epictetus", work: "Discourses", target: 160 },
  { author: "Musonius Rufus", work: "Lectures", target: 21 },
  { author: "Cicero", work: "Tusculan Disputations", target: 15 },
  { author: "Cicero", work: "De Officiis", target: 10 },
  { author: "Diogenes Laertius", work: "Lives of Eminent Philosophers", target: 20 },
  { author: "Hierocles", work: "Elements of Ethics", target: 10 },
];

// Additional passages the editors have flagged as "should exist eventually".
// This is a curated wishlist — not a scraped list — so citations stay honest.
const WISHLIST: Array<{ author: string; work: string; section: string; note: string }> = [
  { author: "Marcus Aurelius", work: "Meditations", section: "8.17", note: "on the death of a friend and the proper limit of grief" },
  { author: "Marcus Aurelius", work: "Meditations", section: "9.38", note: "on the impermanence of praise and blame" },
  { author: "Seneca", work: "Letters to Lucilius", section: "Letter 54", note: "on a weak constitution and the uses of illness" },
  { author: "Seneca", work: "Letters to Lucilius", section: "Letter 82", note: "the difference between a wise and a merely learned man" },
  { author: "Seneca", work: "Consolation to Polybium", section: "chs. 4–9", note: "consolation on the death of a brother" },
  { author: "Epictetus", work: "Discourses", section: "II.22", note: "on friendship and choosing companions wisely" },
  { author: "Epictetus", work: "Discourses", section: "IV.9", note: "on how to approach the desire for freedom" },
  { author: "Musonius Rufus", work: "Lectures", section: "XII", note: "on enduring hard work and toil" },
  { author: "Cicero", work: "Tusculan Disputations", section: "III.34", note: "on the nature and cure of grief" },
  { author: "Hierocles", work: "Elements of Ethics", section: "col. 5.28", note: "on the proper treatment of the body" },
];

// Suggested new theme pages, based on tags already used inside quotes but
// without a dedicated /themes/<slug> landing page yet.
const SUGGESTED_THEMES: Record<string, string> = {
  tranquility: "Tranquility",
  contentment: "Contentment",
  character: "Character",
  perception: "Perception & Judgement",
  action: "Action",
  present: "The Present Moment",
  gratitude: "Gratitude",
};

type ThemeRow = {
  slug: string;
  title: string;
  quotes: Quote[];
  authors: string[];
  works: string[];
  missingAuthors: string[];
  rating: "Sparse" | "Moderate" | "Solid" | "Comprehensive";
};

function rate(count: number, authorCount: number): ThemeRow["rating"] {
  if (count >= 20 && authorCount >= 3) return "Comprehensive";
  if (count >= 10 && authorCount >= 2) return "Solid";
  if (count >= 5) return "Moderate";
  return "Sparse";
}

function CoveragePage() {
  const { rows, workRows, emergingTags, totals } = useMemo(() => {
    const rows: ThemeRow[] = THEMES.map((t) => {
      const quotes = quotesForTheme(t);
      const authors = Array.from(new Set(quotes.map((q) => q.author)));
      const works = Array.from(new Set(quotes.map((q) => q.work)));
      const missingAuthors = CORE_AUTHORS.filter((a) => !authors.includes(a));
      return {
        slug: t.slug,
        title: t.title,
        quotes,
        authors,
        works,
        missingAuthors,
        rating: rate(quotes.length, authors.length),
      };
    }).sort((a, b) => b.quotes.length - a.quotes.length);

    const workRows = CANONICAL_WORKS.map((w) => {
      const have = QUOTES.filter((q) => q.author === w.author && q.work === w.work).length;
      return { ...w, have, pct: Math.min(100, Math.round((have / w.target) * 100)) };
    });

    // Tags in the corpus that don't map to any current theme page.
    const themeTags = new Set(THEMES.flatMap((t) => t.tags));
    const tagCounts = new Map<string, number>();
    for (const q of QUOTES) {
      for (const tag of q.themes) {
        if (themeTags.has(tag)) continue;
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }
    const emergingTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count, label: SUGGESTED_THEMES[tag] ?? null }));

    const totals = {
      quotes: QUOTES.length,
      authors: new Set(QUOTES.map((q) => q.author)).size,
      works: new Set(QUOTES.map((q) => `${q.author}::${q.work}`)).size,
      themes: THEMES.length,
    };

    return { rows, workRows, emergingTags, totals };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <p className="small-caps text-xs text-muted-foreground">Editorial audit</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Corpus coverage</h1>
      <p className="mt-4 text-lg text-foreground/80 font-serif leading-relaxed max-w-2xl">
        A live view of what the library holds — every theme measured by quote count,
        author diversity, and canonical breadth — and, more importantly, what it still lacks.
      </p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Quotes" value={totals.quotes} />
        <Stat label="Philosophers" value={totals.authors} />
        <Stat label="Distinct works" value={totals.works} />
        <Stat label="Themes" value={totals.themes} />
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl">Themes by depth</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Rating combines quote count with author diversity. A theme leaning on one philosopher is not yet solid.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left small-caps text-xs text-muted-foreground border-b border-border">
                <th className="py-2 pr-4">Theme</th>
                <th className="py-2 pr-4">Quotes</th>
                <th className="py-2 pr-4">Authors</th>
                <th className="py-2 pr-4">Works</th>
                <th className="py-2 pr-4">Missing</th>
                <th className="py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4">
                    <Link to="/themes/$slug" params={{ slug: r.slug }} className="text-ink hover:underline">
                      {r.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{r.quotes.length}</td>
                  <td className="py-3 pr-4 tabular-nums">{r.authors.length}</td>
                  <td className="py-3 pr-4 tabular-nums">{r.works.length}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    {r.missingAuthors.length === 0 ? (
                      <span className="text-foreground/60">—</span>
                    ) : (
                      r.missingAuthors.join(", ")
                    )}
                  </td>
                  <td className="py-3">
                    <RatingBadge rating={r.rating} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl">Canonical works</h2>
        <p className="text-sm text-muted-foreground mt-1">
          How much of each primary text is represented. Targets are approximate — the aim is
          representative coverage, not exhaustive transcription.
        </p>
        <div className="mt-6 space-y-4">
          {workRows.map((w) => (
            <div key={`${w.author}-${w.work}`} className="space-y-1">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <div>
                  <span className="text-foreground/90">{w.author}</span>
                  <span className="text-muted-foreground"> — </span>
                  <span className="italic">{w.work}</span>
                </div>
                <div className="tabular-nums text-xs text-muted-foreground">
                  {w.have} / {w.target}
                </div>
              </div>
              <div className="h-1.5 bg-muted overflow-hidden rounded">
                <div className="h-full bg-foreground/70" style={{ width: `${w.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl">Themes worth adding</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tags that already appear on quotes but don't yet have a landing page.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {emergingTags.map((t) => (
            <span
              key={t.tag}
              className="inline-flex items-center gap-2 border border-border bg-paper px-3 py-1.5 text-xs"
            >
              <span className="text-foreground/90">{t.label ?? t.tag}</span>
              <span className="text-muted-foreground tabular-nums">{t.count}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mt-16 mb-8">
        <h2 className="font-serif text-2xl">Editor's wishlist</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Canonical passages flagged for inclusion — each verified against a printed edition before adding.
        </p>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {WISHLIST.map((w, i) => (
            <li key={i} className="py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="small-caps text-[11px] text-ink">{w.author}</span>
              <span className="italic text-sm">{w.work}</span>
              <span className="text-xs text-muted-foreground">§ {w.section}</span>
              <span className="text-sm text-foreground/80 basis-full md:basis-auto md:ml-2">— {w.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-paper p-4">
      <div className="text-3xl font-serif tabular-nums">{value}</div>
      <div className="small-caps text-[10px] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function RatingBadge({ rating }: { rating: ThemeRow["rating"] }) {
  const styles: Record<ThemeRow["rating"], string> = {
    Comprehensive: "bg-foreground text-background",
    Solid: "bg-foreground/80 text-background",
    Moderate: "border border-border text-foreground/80",
    Sparse: "border border-dashed border-border text-muted-foreground",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] small-caps ${styles[rating]}`}>
      {rating}
    </span>
  );
}