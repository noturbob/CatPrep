// Error-log columns from each guide: QA §17, VARC §5, DILR §12.
import type { LogConfig } from "@/components/error-log";
import { chapters } from "./qa";

export const qaLog: LogConfig = {
  storageKey: "error-log",
  prompt: "Log a question you got wrong, guessed, or solved in over 3 minutes",
  fields: [
    { key: "source", label: "Source", kind: "text", placeholder: "CAT 2020 Slot 1" },
    { key: "chapter", label: "Chapter", kind: "select", options: [...chapters.map((c) => c.short), "Other"] },
    { key: "pattern", label: "Pattern", kind: "text", placeholder: "2", optional: true },
    {
      key: "type", label: "Mistake type", kind: "chips",
      options: ["Concept", "Misread", "Calculation", "Time", "Selection"],
      hints: { Concept: "Did not know the idea", Misread: "Answered a different question", Calculation: "Arithmetic slip", Time: "Right, but over 3 minutes", Selection: "Should have skipped it" },
    },
    { key: "wrong", label: "What went wrong", kind: "text", placeholder: "Applied the discount to CP", wide: true },
    { key: "fix", label: "Fix in one line", kind: "text", placeholder: "Discount is always on MP", wide: true },
  ],
  lessonKey: "fix",
  tallyKeys: ["chapter", "pattern"],
  tallyTitle: "Sunday count: misses by chapter and pattern",
  tallyNote: "The top two get extra practice next week.",
  redo: true,
  examples: [
    { date: "2026-10-09", source: "Section 6 practice, Q2", chapter: "Profit & Loss", pattern: "1 (markup + discount)", type: "Concept", wrong: "Applied the discount to CP", fix: "Discount is always on MP" },
    { date: "2026-10-23", source: "CAT 2020 Slot 1 (TSD page)", chapter: "TSD", pattern: "2 (after-meeting)", type: "Time", wrong: "Solved by algebra in 5 min", fix: "Use t² = t₁ × t₂ directly" },
  ],
};

export const varcLog: LogConfig = {
  storageKey: "varc-error-log",
  prompt: "Log a question you got wrong, and why the right answer was right",
  fields: [
    { key: "source", label: "Source", kind: "text", placeholder: "CAT 2024 paper, passage 3" },
    { key: "qtype", label: "Question type", kind: "select", options: ["Main idea", "Specific detail", "Inference", "Author’s view", "EXCEPT / NOT", "Purpose of a detail", "Tone", "Application", "Para jumble", "Odd one out", "Para summary", "Para completion"] },
    {
      key: "flaw", label: "Flaw in my answer", kind: "chips",
      options: ["Extreme", "Out of scope", "Distorted", "Half-right", "Misread", "Time"],
      hints: { Time: "Right, but too slow" },
    },
    { key: "right", label: "What the right answer did", kind: "text", placeholder: "Restated the final sentence", wide: true },
    { key: "lesson", label: "Lesson in one line", kind: "text", placeholder: "Separate the author’s view from views the author reports", wide: true },
  ],
  lessonKey: "lesson",
  tallyKeys: ["flaw"],
  tallyTitle: "Sunday count: flaw types",
  tallyNote: "The most frequent one becomes next week’s focus.",
  examples: [
    { date: "2026-10-08", source: "Section 3, Q3", qtype: "Author’s view", flaw: "Picked a view the author describes, not one the author holds", right: "Restated the final sentence", lesson: "Separate the author’s view from views the author reports" },
    { date: "2026-10-15", source: "CAT 2024 paper, passage 3", qtype: "Inference", flaw: "Out of scope", right: "Followed from one paragraph alone", lesson: "If it needs outside knowledge, it is wrong" },
  ],
};

export const dilrLog: LogConfig = {
  storageKey: "dilr-error-log",
  prompt: "Log every set you abandoned, got two or more wrong in, or took over 18 minutes on",
  fields: [
    { key: "source", label: "Set (source)", kind: "text", placeholder: "CAT 2025 Slot 1, train movement" },
    { key: "stype", label: "Type", kind: "select", options: ["Arrangement", "Matching", "Numeric distribution", "Scheduling", "Tournament", "Scores and indices", "Venn", "Routes", "DI table", "DI chart", "Binary logic", "Process", "Cubes"] },
    { key: "minutes", label: "Minutes to first placement", kind: "text", placeholder: "4" },
    { key: "outcome", label: "Outcome", kind: "select", options: ["Solved", "Solved, 1 wrong", "Solved, 2+ wrong", "Abandoned", "Over 18 minutes"] },
    {
      key: "cause", label: "Cause", kind: "chips",
      options: ["Missed rule", "Wrong case", "Misread question", "Calculation", "Bad pick", "—"],
      hints: { "Wrong case": "A case dropped too early", "Bad pick": "Should have skipped the set" },
    },
    { key: "lesson", label: "Lesson in one line", kind: "text", placeholder: "Draw the time axis first, then fill the stations", wide: true },
  ],
  lessonKey: "lesson",
  tallyKeys: ["stype", "outcome"],
  tallyTitle: "Sunday count: sets by type and outcome",
  tallyNote: "The type you abandon most gets Set A for the next week.",
  examples: [
    { date: "2026-10-07", source: "Section 5, Set 2", stype: "Numeric distribution", minutes: "4", outcome: "Solved, 1 wrong", cause: "Missed rule", lesson: "Write every “at least one” limit beside the grid" },
    { date: "2026-10-21", source: "CAT 2025 Slot 1, train movement", stype: "Scheduling", minutes: "2", outcome: "Solved", cause: "—", lesson: "Draw the time axis first, then fill the stations" },
  ],
};
