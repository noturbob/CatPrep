// Section 2 of the guide: the 55-day plan, 5 Oct – 28 Nov 2026, exam on 29 Nov.
// Dates are plain "YYYY-MM-DD" strings in IST; string comparison orders them correctly.

export const EXAM = "2026-11-29";
export const START = "2026-10-05";

export const phases = [
  { name: "Basics, %, P&L, SI/CI", from: "2026-10-05", to: "2026-10-10" },
  { name: "Ratio, averages, mixtures", from: "2026-10-12", to: "2026-10-17" },
  { name: "Time-work, TSD, review", from: "2026-10-19", to: "2026-10-24" },
  { name: "Easy algebra", from: "2026-10-26", to: "2026-10-31" },
  { name: "Second pass: real PYQs", from: "2026-11-02", to: "2026-11-14" },
  { name: "Mocks + error-log drills", from: "2026-11-16", to: "2026-11-26" },
  { name: "Light revision only", from: "2026-11-27", to: "2026-11-28" },
];

export const mocks = [
  "2026-10-11", "2026-10-18", "2026-10-25", "2026-11-01",
  "2026-11-08", "2026-11-11", "2026-11-15",
  "2026-11-18", "2026-11-20", "2026-11-22", "2026-11-24", "2026-11-26",
];

/** One study block per date range. `href` points at the guide section to open that day. */
export type Day = { from: string; to: string; task: string; href?: string };

export const days: Day[] = [
  { from: "2026-10-05", to: "2026-10-06", task: "Toolkit: fraction table and squares memorised", href: "/qa/toolkit" },
  { from: "2026-10-07", to: "2026-10-07", task: "Percentages and its real CAT questions", href: "/qa/percentages" },
  { from: "2026-10-08", to: "2026-10-09", task: "Profit, Loss & Discount", href: "/qa/profit-loss-discount" },
  { from: "2026-10-10", to: "2026-10-10", task: "Simple & Compound Interest", href: "/qa/simple-compound-interest" },
  { from: "2026-10-11", to: "2026-10-11", task: "Mock 1 (diagnostic) and analysis; start the error log", href: "/qa/error-log" },
  { from: "2026-10-12", to: "2026-10-13", task: "Ratio, Proportion, Partnership & Variation", href: "/qa/ratio-proportion" },
  { from: "2026-10-14", to: "2026-10-15", task: "Averages", href: "/qa/averages" },
  { from: "2026-10-16", to: "2026-10-17", task: "Mixtures & Alligation", href: "/qa/mixtures-alligation" },
  { from: "2026-10-18", to: "2026-10-18", task: "Mock 2 and analysis", href: "/plan#analyse" },
  { from: "2026-10-19", to: "2026-10-20", task: "Time & Work", href: "/qa/time-work" },
  { from: "2026-10-21", to: "2026-10-23", task: "Time, Speed & Distance", href: "/qa/time-speed-distance" },
  { from: "2026-10-24", to: "2026-10-24", task: "Arithmetic review; redo every error-log question so far", href: "/qa/error-log" },
  { from: "2026-10-25", to: "2026-10-25", task: "Mock 3 and analysis", href: "/plan#analyse" },
  { from: "2026-10-26", to: "2026-10-27", task: "Linear & Quadratic Equations", href: "/qa/linear-quadratic-equations" },
  { from: "2026-10-28", to: "2026-10-29", task: "Indices, Surds & Logarithms", href: "/qa/indices-surds-logarithms" },
  { from: "2026-10-30", to: "2026-10-30", task: "Progressions", href: "/qa/progressions" },
  { from: "2026-10-31", to: "2026-10-31", task: "Inequalities, Modulus & Max-Min", href: "/qa/inequalities-modulus" },
  { from: "2026-11-01", to: "2026-11-01", task: "Mock 4 and analysis", href: "/plan#analyse" },
  { from: "2026-11-02", to: "2026-11-15", task: "One arithmetic and one algebra chapter’s 2021–2025 questions, 3 minutes each; every other day a 40-minute QA section", href: "/qa/error-log#sources" },
  { from: "2026-11-16", to: "2026-11-26", task: "Error-log redos and one 40-minute QA section between mocks", href: "/qa/error-log" },
  { from: "2026-11-27", to: "2026-11-28", task: "Formula pages and the “Fix in one line” column only; no new topics", href: "/qa/error-log" },
];

export const weeks = [
  { title: "Week 1", dates: "5–11 Oct", items: [
    "Mon–Tue: toolkit (Section 4); fraction table and squares memorised",
    "Wed: Percentages (Section 5) and its real CAT questions",
    "Thu–Fri: Profit, Loss & Discount (Section 6)",
    "Sat: Simple & Compound Interest (Section 7)",
    "Sun 11 Oct: Mock 1 (diagnostic) and analysis; start the error log",
  ] },
  { title: "Week 2", dates: "12–18 Oct", items: [
    "Mon–Tue: Ratio, Proportion, Partnership & Variation (Section 8)",
    "Wed–Thu: Averages (Section 9)",
    "Fri–Sat: Mixtures & Alligation (Section 10)",
    "Sun 18 Oct: Mock 2 and analysis",
  ] },
  { title: "Week 3", dates: "19–25 Oct", items: [
    "Mon–Tue: Time & Work (Section 11)",
    "Wed–Fri: Time, Speed & Distance (Section 12)",
    "Sat: arithmetic review; redo every error-log question so far",
    "Sun 25 Oct: Mock 3 and analysis",
  ] },
  { title: "Week 4", dates: "26 Oct–1 Nov", items: [
    "Mon–Tue: Linear & Quadratic Equations (Section 13)",
    "Wed–Thu: Indices, Surds & Logarithms (Section 14)",
    "Fri: Progressions (Section 15)",
    "Sat: Inequalities, Modulus & Max-Min (Section 16)",
    "Sun 1 Nov: Mock 4 and analysis",
  ] },
  { title: "Weeks 5–6", dates: "2–15 Nov", items: [
    "Daily: one arithmetic and one algebra chapter’s 2021–2025 questions, 3 minutes each",
    "Every other day: one 40-minute QA section from a 2023–2025 paper",
    "Mocks 5, 6 and 7 on 8, 11 and 15 Nov, each analysed fully",
    "Sunday error-log review: the two weakest patterns get extra drills",
  ] },
  { title: "Weeks 7–8", dates: "16–28 Nov", items: [
    "Mocks 8–12 on 18, 20, 22, 24 and 26 Nov, analysed the same day",
    "Between mocks: error-log redos and one 40-minute QA section",
    "27–28 Nov: formula pages and the “Fix in one line” column only; no new topics",
    "28 Nov: admit card, photo ID, centre route and reporting time checked; early night",
  ] },
];

/** VARC and DILR run on the same calendar: one weekly focus each (VARC guide §5, DILR guide §12). */
export type Focus = { from: string; to: string; text: string };

export const varcFocus: Focus[] = [
  { from: "2026-10-05", to: "2026-10-18", text: "The reading method on easier passages (science, history, environment); untimed for the first three days, then 9 minutes each" },
  { from: "2026-10-19", to: "2026-11-01", text: "Harder topics (philosophy, arts, economics), timed, plus the 2-minute passage ranking" },
  { from: "2026-11-02", to: "2026-11-15", text: "A full 40-minute VARC section from a CAT 2021–2025 paper every other day" },
  { from: "2026-11-16", to: "2026-11-28", text: "Mocks on the QA calendar; between mocks, error-log review and one VA set a day" },
];

export const dilrFocus: Focus[] = [
  { from: "2026-10-05", to: "2026-10-11", text: "Arrangements and matching grids (Sets 1, 2 and 9)" },
  { from: "2026-10-12", to: "2026-10-18", text: "Scheduling and tournaments (Sets 3 and 4)" },
  { from: "2026-10-19", to: "2026-10-25", text: "DI tables and charts, Venn diagrams (Sets 5, 6, 11 and 12); selection drill twice a week from now" },
  { from: "2026-10-26", to: "2026-11-01", text: "Routes, scores, binary logic and process sets (Sets 7, 8, 10, 13 and 14)" },
  { from: "2026-11-02", to: "2026-11-15", text: "A full 40-minute DILR section from a CAT 2021–2025 paper every other day, opening with the 5-minute scan" },
  { from: "2026-11-16", to: "2026-11-28", text: "Mocks on the QA calendar, with one selection drill on each non-mock day" },
];

export const focusOn = (list: Focus[], date: string) => list.find((f) => f.from <= date && date <= f.to);

/** Admission-season dates from the Admissions guide §7, as of 6 Oct 2026. */
export const deadlines = [
  { date: "2026-11-04", what: "CAT admit card expected" },
  { date: "2026-11-25", what: "SNAP applications close" },
  { date: "2026-11-29", what: "CAT 2026" },
  { date: "2026-12-01", what: "IBSAT applications close" },
  { date: "2026-12-06", what: "XAT applications close" },
  { date: "2026-12-17", what: "NMAT slot booking closes" },
];

/** Today's date in IST as YYYY-MM-DD, whatever the viewer's clock zone. */
export const istDate = (d: Date) =>
  new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);

const dayNum = (s: string) => Date.parse(s + "T00:00:00Z") / 86_400_000;

export const daysBetween = (a: string, b: string) => dayNum(b) - dayNum(a);

export type Today =
  | { kind: "before"; daysToStart: number }
  | { kind: "study"; day: number; task: Day; mock: number | null; daysLeft: number }
  | { kind: "exam" }
  | { kind: "after" };

export function today(date: string): Today {
  if (date < START) return { kind: "before", daysToStart: daysBetween(date, START) };
  if (date === EXAM) return { kind: "exam" };
  if (date > EXAM) return { kind: "after" };
  const mockIdx = mocks.indexOf(date);
  const task = days.find((d) => d.from <= date && date <= d.to)!;
  return {
    kind: "study",
    day: daysBetween(START, date) + 1,
    task,
    mock: mockIdx < 0 ? null : mockIdx + 1,
    daysLeft: daysBetween(date, EXAM),
  };
}
