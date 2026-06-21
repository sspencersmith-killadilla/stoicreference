import { createFileRoute, Link } from "@tanstack/react-router";
import { THEMES } from "@/data/themes";

export const Route = createFileRoute("/themes")({
  head: () => ({
    meta: [
      { title: "Themes — The Stoic Reference" },
      { name: "description", content: "Stoic teachings organized by subject: control, death, anger, virtue, time, and more." },
    ],
  }),
  component: ThemesIndex,
});

function ThemesIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl">Themes</h1>
      <p className="text-muted-foreground mt-2 max-w-xl">
        The same questions return in every age. Here are the ones the Stoics gave the most attention.
      </p>
      <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {THEMES.map((t) => (
          <Link
            key={t.slug}
            to="/themes/$slug"
            params={{ slug: t.slug }}
            className="group"
          >
            <h2 className="font-serif text-2xl group-hover:text-primary transition">{t.title}</h2>
            <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}