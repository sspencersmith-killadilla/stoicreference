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
        className="relative grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-b-2 border-foreground/80 pr-10 focus-within:border-ink transition-colors"
      >
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask the Stoics…"
          className="min-w-0 bg-transparent text-lg md:text-xl py-3 font-display italic focus:outline-none placeholder:text-foreground/30"
          maxLength={500}
        />
        <button
          type="submit"
          className="shrink-0 small-caps text-[10px] text-ink hover:translate-x-1 transition-transform pb-4 cursor-pointer"
        >
          Consult <span aria-hidden>→</span>
        </button>
      </form>
      <ul className="mt-6 space-y-2">
        <li className="small-caps text-[10px] text-foreground/40">Common inquiries</li>
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              onClick={() => submit(s)}
              className="text-left text-[13px] text-foreground/80 hover:text-ink hover:underline decoration-border underline-offset-4 transition-colors"
            >
              · {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
