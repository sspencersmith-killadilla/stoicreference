// 5x5 word-square crosswords for the daily Stoic mini.
// Each puzzle is a true word square — row N equals column N — which keeps
// construction tight and the grid elegant on small screens. Clues differ
// across vs. down so the solver gets ten distinct prompts.

export type Clue = {
  num: number;
  clue: string;
  answer: string;
  row: number; // 0-indexed starting cell
  col: number;
};

export type Puzzle = {
  id: string;
  title: string;
  note: string; // shown after solve
  grid: (string | null)[][]; // solution letters, null = black square (unused for word squares)
  across: Clue[];
  down: Clue[];
};

function square(id: string, title: string, note: string, rows: [string, string, string, string, string], acrossClues: [string, string, string, string, string], downClues: [string, string, string, string, string]): Puzzle {
  const grid = rows.map((r) => r.split("")) as (string | null)[][];
  const across: Clue[] = acrossClues.map((c, i) => ({ num: i + 1, clue: c, answer: rows[i], row: i, col: 0 }));
  const down: Clue[] = downClues.map((c, i) => ({
    num: i + 1,
    clue: c,
    answer: rows.map((r) => r[i]).join(""),
    row: 0,
    col: i,
  }));
  return { id, title, note, grid, across, down };
}

export const PUZZLES: Puzzle[] = [
  square(
    "mini-001",
    "Set apart",
    "The Stoic practices a kind of cheerful solitude — APART from the crowd's verdict, ALONE with reason.",
    ["APART", "POLAR", "ALONE", "RANGE", "TREES"],
    [
      "Separated, as the sage from the mob",
      "Diametrically opposite",
      "By oneself — Marcus's preferred state for self-examination",
      "The full ___ of fortune's gifts and blows",
      "Plane ___, planted by Zeno's Stoa Poikile",
    ],
    [
      "Held at a distance from the crowd",
      "Like Arctic temperatures, or two opposing views",
      "Without companions",
      "Mountain ___; the territory you cover",
      "What the Stoa was named for? No — but the colonnade had them nearby",
    ],
  ),
  square(
    "mini-002",
    "Make amends",
    "Stoicism asks you to AMEND yourself daily — to be AWARE before reacting and to keep the present in RANGE.",
    ["AWARE", "WOMAN", "AMEND", "RANGE", "ENDED"],
    [
      "Conscious; mindful (Epictetus's prescription)",
      "Musonius taught that any ___ could pursue philosophy",
      "Revise; correct, as a flawed judgment",
      "Marcus's ___ of duties as emperor",
      "Concluded, as a life well lived",
    ],
    [
      "Watchful; paying attention",
      "Adult female",
      "To make right",
      "Stove-top burner; or, scope",
      "Finished; closed",
    ],
  ),
  square(
    "mini-003",
    "Inner armor",
    "Marcus called philosophy an ARMOR against fortune — the only one we get to keep through to the end.",
    ["BEAST", "EARTH", "ARMOR", "STONE", "THREE"],
    [
      "Wild creature; what untrained passions resemble",
      "Marcus's 'small clod' he ruled and would soon return to",
      "Protective covering; metaphor for trained reason",
      "Marcus compared the soul to a clear ___",
      "Number of Stoic disciplines: assent, desire, action",
    ],
    [
      "Brute appetite",
      "Our common home, per Stoic cosmopolitanism",
      "Knight's plating",
      "Engraved memorial; also Marcus's image for steadiness",
      "Trio",
    ],
  ),
  square(
    "mini-004",
    "Test of character",
    "Seneca: every difficulty is a TEST. The body is borrowed (we are SLAVES of nothing but virtue) and time keeps moving.",
    ["ASSET", "SLAVE", "SAVES", "EVENT", "TESTS"],
    [
      "Something of value (and virtue is the only true one)",
      "Epictetus was once one — and freer than his master",
      "Rescues, as a Stoic friend in crisis",
      "An occurrence; what Marcus says we judge, not endure",
      "Difficulties Seneca welcomed as training",
    ],
    [
      "Item on a ledger",
      "Bondservant",
      "Stockpiles money",
      "Happening",
      "Trials",
    ],
  ),
  square(
    "mini-005",
    "Common sense",
    "Reasonable assent — using SENSE BASED on evidence — is the foundation of Stoic logic.",
    ["ABUSE", "BASED", "USING", "SENSE", "EDGES"],
    [
      "Misuse, as of power Marcus warned against",
      "Grounded; supported by reason",
      "Employing, as Epictetus says we should — our impressions",
      "Reason, or one of the five",
      "Borders; where calm meets chaos",
    ],
    [
      "Cruel treatment",
      "Foundational",
      "Putting to work",
      "Good judgment",
      "Boundaries; cliff brinks",
    ],
  ),
  square(
    "mini-006",
    "Agree with nature",
    "The Stoic THEME: live in AGREEment with nature. STEEL the mind first; the world will follow.",
    ["BEATS", "EIGHT", "AGREE", "THEME", "STEEL"],
    [
      "Outdoes; or, the heart's rhythm Marcus watched",
      "Roman hours of work, give or take",
      "Consent — Stoic 'assent' to a true impression",
      "Recurring subject (Stoicism's: virtue is the only good)",
      "Strengthen, as nerves before adversity",
    ],
    [
      "Defeats",
      "Octet",
      "Concur",
      "Motif",
      "Hardened alloy",
    ],
  ),
  square(
    "mini-007",
    "Argue well",
    "Chrysippus loved dialectic. To ARGUE under the EARTH's sky is to take part in the rational order.",
    ["BEAST", "EARTH", "ARGUE", "STUFF", "THEFT"],
    [
      "Animal; appetite untrained by reason",
      "Marcus's 'tiny corner of the universe'",
      "Reason it out, Chrysippus-style",
      "Material; what Marcus calls our bodies — borrowed",
      "Taking what's not yours — an offense against the Logos",
    ],
    [
      "Creature of instinct",
      "Third planet",
      "Quarrel productively",
      "Substance",
      "Larceny",
    ],
  ),
  square(
    "mini-008",
    "Gauge the gauge",
    "A Stoic keeps a steady GAUGE on the soul, AHEAD of impulse — the BADGE of the philosopher.",
    ["BADGE", "AHEAD", "DEBUG", "GAUGE", "EDGES"],
    [
      "Emblem of office, as Marcus wore",
      "In front; what foresight keeps you",
      "Fix flaws, as Stoic self-review fixes the day's errors",
      "Measure carefully (as Seneca did each evening)",
      "Slim margins; brinks of the precipice",
    ],
    [
      "Worn insignia",
      "Out in front",
      "Clean code (or character) of bugs",
      "Pressure dial",
      "Knife blades' working sides",
    ],
  ),
];

export function pickDailyPuzzle(date: Date = new Date()): Puzzle {
  const dayIdx = Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000,
  );
  return PUZZLES[dayIdx % PUZZLES.length];
}

export function getPuzzle(id: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}