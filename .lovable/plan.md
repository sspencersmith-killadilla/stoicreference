## Add six early & middle Stoics

Expand the reference beyond the four Roman Imperial Stoics to cover the Greek founders and the Roman Republican/Middle Stoa figures.

### Philosophers to add

1. **Zeno of Citium** (c. 334–262 BCE) — founder of Stoicism, taught in the Stoa Poikile in Athens.
2. **Cleanthes** (c. 330–230 BCE) — Zeno's successor as head of the Stoa; author of the *Hymn to Zeus*.
3. **Chrysippus** (c. 279–206 BCE) — third head of the Stoa; systematizer ("Without Chrysippus, there would be no Stoa").
4. **Panaetius of Rhodes** (c. 185–110 BCE) — head of the Middle Stoa; brought Stoicism to Rome via the Scipionic Circle.
5. **Posidonius** (c. 135–51 BCE) — polymath student of Panaetius; teacher of Cicero.
6. **Cato the Younger** (95–46 BCE) — Roman senator; Stoic exemplar held up by Seneca as a model of virtue. (Wrote nothing; quotes are reported sayings preserved by Plutarch, Cicero, Seneca.)

### Data changes (`src/data/quotes.ts`)

Extend the `Quote["author"]` union to include the six new names. Add ~3–5 quotes per philosopher drawn from surviving fragments and ancient testimonia (Diogenes Laërtius, Stobaeus, Cicero, Plutarch, Seneca). For figures who left no direct writings (Zeno, Cleanthes mostly, Chrysippus mostly, Cato entirely), cite the reporting source in `work` / `section` (e.g. `work: "Fragments (in Diogenes Laërtius)"`, `section: "Lives 7.87"`) and note this clearly. Cleanthes gets the *Hymn to Zeus* directly.

Tag each quote with existing themes where they fit (virtue, fate, control, death, desire, etc.).

### Data changes (`src/data/philosophers.ts`)

Add six new `Philosopher` entries with slug, name, era, bio (3–5 sentences in the existing voice), and `works` list. Order chronologically in the array: Zeno → Cleanthes → Chrysippus → Panaetius → Posidonius → Cato → Seneca → Musonius → Epictetus → Marcus. Update existing Roman entries' order accordingly.

Extend the `authorSlug()` switch in `src/components/QuoteCard.tsx` to handle the six new author names.

### Display

No new routes needed — `/philosophers`, `/philosophers/$slug`, and the existing quote/permalink routes already render any philosopher in the data. For philosophers with reported (not written) quotes, the existing citation line ("Work · Section · trans. X") already accommodates "Fragments (in Diogenes Laërtius) · Lives 7.87" style sources.

Optionally add a small "Reported by ancient sources" note under the *Selected passages* heading on `philosophers.$slug.tsx` for figures whose quotes are all testimonia (Zeno, Chrysippus, Cato). Low-priority polish.

### Out of scope

- New themes
- Reorganizing into "Early / Middle / Late Stoa" sections (could be a future enhancement)
- AI prompt changes — the `/ask` route already passes the full quotes list, so new quotes are picked up automatically.
