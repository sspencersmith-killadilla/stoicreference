import { createFileRoute, Link } from "@tanstack/react-router";
import { PHILOSOPHERS } from "@/data/philosophers";

export const Route = createFileRoute("/philosophers")({
  head: () => ({
    meta: [
      { title: "Philosophers — The Stoic Reference" },
      { name: "description", content: "Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus — the principal Roman Stoics." },
    ],
  }),
  component: PhilosophersIndex,
});

function PhilosophersIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl">Philosophers</h1>
      <p className="text-muted-foreground mt-2 max-w-xl">
        Four voices, one tradition. Each began somewhere different — emperor, statesman, freed slave, exile — and arrived at the same handful of disciplines.
      </p>
      <div className="mt-10 space-y-10">
        {PHILOSOPHERS.map((p) => (
          <Link
            key={p.slug}
            to="/philosophers/$slug"
            params={{ slug: p.slug }}
            className="block group"
          >
            <h2 className="font-serif text-3xl group-hover:text-primary transition">{p.name}</h2>
            <p className="small-caps text-xs text-muted-foreground mt-1">{p.era}</p>
            <p className="mt-3 text-foreground/90 leading-relaxed">{p.bio}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}