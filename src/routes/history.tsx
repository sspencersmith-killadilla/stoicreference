import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadHistory, deleteEntry, type HistoryEntry } from "@/lib/history";
import { QuoteCard } from "@/components/QuoteCard";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — The Stoic Reference" },
      { name: "description", content: "Questions you've asked the Stoics in this browser." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const open = entries.find((e) => e.id === openId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl">History</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Saved in this browser only. Clearing your site data will remove them.
      </p>

      {entries.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No questions yet.{" "}
          <Link to="/" className="underline">
            Ask something.
          </Link>
        </p>
      ) : (
        <div className="mt-10 grid md:grid-cols-[20rem_1fr] gap-8">
          <ul className="space-y-1">
            {entries.map((e) => (
              <li key={e.id} className="flex items-start gap-1">
                <button
                  onClick={() => setOpenId(e.id)}
                  className={
                    "flex-1 text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition " +
                    (openId === e.id ? "bg-accent text-foreground" : "text-muted-foreground")
                  }
                >
                  <div className="font-serif italic text-base text-foreground line-clamp-2">
                    &ldquo;{e.question}&rdquo;
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(e.answeredAt).toLocaleString()}
                  </div>
                </button>
                <button
                  onClick={() => {
                    deleteEntry(e.id);
                    setEntries(loadHistory());
                    if (openId === e.id) setOpenId(null);
                  }}
                  aria-label="Delete"
                  className="text-xs text-muted-foreground hover:text-destructive px-2 py-2"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <div>
            {open ? (
              <div className="space-y-8">
                <div>
                  <p className="small-caps text-xs text-muted-foreground">Question</p>
                  <h2 className="font-serif text-2xl italic mt-1">&ldquo;{open.question}&rdquo;</h2>
                </div>
                <div>
                  <p className="small-caps text-xs text-muted-foreground mb-2">A reading</p>
                  <p className="font-serif text-lg leading-relaxed">{open.result.synthesis}</p>
                </div>
                <div className="space-y-8">
                  {open.result.picks.map((p, i) => (
                    <QuoteCard
                      key={i}
                      quote={p.quote}
                      footer={<p className="text-sm text-foreground/90">{p.interpretation}</p>}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Select a question to revisit.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
