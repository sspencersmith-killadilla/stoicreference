import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Stoic Reference" },
      { name: "description", content: "What Stoicism is, how this reference works, and how to read its answers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12 md:py-16 prose prose-stone">
      <h1 className="font-serif text-5xl">About</h1>
      <p className="font-serif text-xl leading-relaxed text-foreground/90 mt-6">
        Stoicism is a Greco-Roman philosophy practiced as a way of life. Its central claim
        is severe and freeing: virtue is the only good, vice the only evil, and everything
        else — health, wealth, reputation, even our bodies — is borrowed.
      </p>
      <p className="mt-6">
        This site is a working reference. Browse passages by{" "}
        <a href="/philosophers" className="underline">philosopher</a> or{" "}
        <a href="/themes" className="underline">theme</a>, or type a question and let the
        Stoics answer.
      </p>
      <h2 className="font-serif text-2xl mt-10">How the Ask feature works</h2>
      <p>
        We keep a curated corpus of canonical passages with their author, work, section,
        and translator. When you ask a question, a language model selects the most
        relevant entries from that corpus by id, then writes a modern reading in plain
        English. Citations on those quotes come from the corpus itself, not from the model.
      </p>
      <p>
        The model may occasionally add a &ldquo;further passage&rdquo; outside the corpus.
        Those are clearly labeled. Treat them as suggestions to verify, not as scholarship.
      </p>
      <h2 className="font-serif text-2xl mt-10">Translations</h2>
      <p>
        Quoted translations are drawn from public-domain editions (George Long, Thomas
        Higginson, Elizabeth Carter, Richard Gummere, John Basore, Aubrey Stewart) and
        more recent named translators where indicated. For Musonius Rufus the source is
        the modern edition by Cynthia King.
      </p>
      <h2 className="font-serif text-2xl mt-10">Privacy</h2>
      <p>
        Your past questions are stored only in this browser&rsquo;s local storage. There
        are no accounts and nothing is synced.
      </p>
    </article>
  );
}