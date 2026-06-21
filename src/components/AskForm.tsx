import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const SUGGESTIONS = [
  "How do I handle anxiety about the future?",
  "What should I do when someone wrongs me?",
  "How can I stop wasting time?",
  "I'm afraid of dying. What would the Stoics say?",
];

export function AskForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    navigate({ to: "/ask", search: { q: trimmed } });
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className="relative flex items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2 py-2 shadow-soft focus-within:ring-2 focus-within:ring-accent/40 transition"
      >
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask the Stoics anything…"
          className="flex-1 bg-transparent text-base md:text-lg focus:outline-none placeholder:text-muted-foreground/70"
          maxLength={500}
        />
        <button
          type="submit"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          Consult <span aria-hidden>→</span>
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => submit(s)}
            className="text-xs text-muted-foreground hover:text-foreground border border-border bg-background rounded-full px-3 py-1.5 hover:bg-secondary transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}