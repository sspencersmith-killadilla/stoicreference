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
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask the Stoics anything…"
          className="flex-1 bg-card border border-border rounded-md px-4 py-3 text-base font-serif text-lg focus:outline-none focus:ring-2 focus:ring-ring/40"
          maxLength={500}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          Consult
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => submit(s)}
            className="text-xs text-muted-foreground hover:text-foreground border border-border/70 rounded-full px-3 py-1 hover:bg-accent transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}