// "CAT 2026 DILR Guide: 2.5 Sets to the 95th Percentile", 6 Oct 2026.
// Every worked set is original to the guide, built to mirror a type CAT keeps using.

export type Table = { head: string[]; rows: (string | number)[][] };
/** A solution is prose steps, bullet lists and tables in order. */
export type Block = string | { list: string[] } | { table: Table };

export type DSet = {
  n: number;
  title: string;
  level: string;
  setup: string[];
  clues?: string[];
  data?: Table;
  chart?: "bar" | "scatter";
  questions: string[];
  solution: Block[];
  answers: string;
  takeaway?: string;
};

export type Practice = {
  title: string;
  minutes: number;
  setup: string[];
  clues?: string[];
  data?: Table;
  questions: string[];
  answers: string;
  takeaway?: string;
};

export type Chapter = { n: number; slug: string; title: string; short: string; lede: string; items: (DSet | Practice | { mini: string; body: string[] })[] };

export const dilrPercentiles: [string, string, string][] = [
  ["99", "37.8", "30–34"],
  ["95", "27", "23–26"],
  ["90", "22.5", "17–19"],
  ["85", "19.5", "13–15"],
  ["80", "17", "11–13"],
];

export const inQuestions = [
  "CAT 2025 DILR had 22 questions in 5 sets: two sets of 5 questions and three of 4. Half of them, 11, were TITA.",
  "Marking: +3 for a correct answer, −1 for a wrong MCQ, 0 for a wrong TITA. Half the section carries no penalty, so attempt every TITA you have worked on.",
  "Two full sets give you 8–10 questions; two more from a third set make about 11 attempts. At 85% accuracy that is 9 correct: 27 marks, or 25 if both misses were MCQs.",
];

export const why25 = [
  "IMS rated two of the five sets in every CAT 2025 slot as easy and one as medium; the other two were difficult. Your 2.5 sets are exactly those: the two easy ones and the first questions of the medium one. The whole skill is spotting them in the first five minutes.",
  "The easy sets were not all puzzles. They included import–export data for five countries, trains moving between five stations, authors and books shown in two bar graphs, a ranking set, six friends calling each other and a chart of friends solving puzzles. Six of the fifteen sets that year were data-interpretation style (tables, bar graphs, a scatter plot, trade and currency data), so DI practice is not optional.",
];

export const plan40 = [
  { from: 0, to: 5, title: "Scan all five sets", body: "Give each about a minute: read the opening lines of the setup and glance at its questions. Score it on the signals and rank the five." },
  { from: 5, to: 19, title: "Your best set", body: "Draw the table, place what is certain, answer every question." },
  { from: 19, to: 33, title: "Your second set", body: "Same again." },
  { from: 33, to: 40, title: "The half set", body: "Open your third-ranked set and answer its two easiest questions: usually the ones that read straight off the data, or a TITA. In the last 30 seconds, enter your best reasoned value in any TITA you worked on." },
];

export const pickFirst = [
  "A familiar structure (seating, a grid, a schedule, a table) with 4–6 entities.",
  "Totals that must add up: every total is a free equation.",
  "DI with complete, clean data and straightforward calculation questions.",
  "Several TITA questions, since they carry no penalty.",
  "Questions that read off the finished table (“which of these is true?”).",
];

export const leaveForLater = [
  "Long lists of “if… then…” rules, or games with moves.",
  "Every question asking for a “maximum possible” or “which can be true” across many cases.",
  "Unusual setups: 3-D cubes, abstract processes, a long text for only 4 questions.",
  "Data you cannot organise into one table within 2 minutes.",
];

export const abandonRule =
  "If you are 7 minutes into a set with no grid filled and no question answered, stop and move to your next-ranked set. Come back only if time is left at the end.";

export const questionOrder = [
  "Answer the questions that use only the main grid first.",
  "Questions that add a condition (“If X sits next to Y, then…”) are mini-cases; do them last.",
  "“Must be true”: the option has to hold in every surviving case. “Can be true”: one valid case is enough.",
  "MCQ guessing: only after you have ruled out two options. TITA: always enter your best answer.",
];

export const scan = {
  sets: [
    ["Set A", "Seven employees were rated by three managers on a 1–10 scale. A table shows some of the ratings, and each employee’s final rating is the median of the three. 4 questions, 2 of them TITA."],
    ["Set B", "A bar chart shows the exports and imports of five countries in 2024, and a second chart shows each country’s trade balance in 2025. 5 questions, 3 of them TITA."],
    ["Set C", "Eight players sit in a circle with tokens, and a long list of rules decides who passes tokens to whom in each round. 4 questions, every one asking “which of the following can be true”."],
    ["Set D", "Six people sit around a table with eight chairs, so two are empty. Clues say who sits opposite or next to whom and how many empty chairs lie between pairs. 4 questions."],
    ["Set E", "A large cube built from 27 small cubes is painted in three colours on different faces, and then some small cubes are removed. 5 questions."],
  ],
  ranking: [
    ["B first", "Complete numbers, five questions and three TITAs; the work is the percentage and ratio arithmetic you already practise in QA."],
    ["A second", "One table, seven people and a simple rule (the median of three). Most questions read straight off the completed table."],
    ["D as the half set", "Seating is familiar, but empty chairs multiply the cases, so take only its one or two most direct questions."],
    ["C skipped", "Long rules plus “can be true” questions across many cases is the classic time sink."],
    ["E skipped", "It needs three-dimensional visualisation, which is slow to do reliably under time pressure."],
  ],
  takeaway: "The ranking takes about a minute per set: read the setup’s first lines, glance at the question types and count the TITAs. Practise it with the selection drill.",
};

export const fiveSteps = [
  "Read the whole setup once without solving. List the entities (people, days, teams) and their attributes.",
  "Draw one structure. Seats for arrangements, a grid for matching, a time axis for schedules, a results matrix for tournaments, a completed table for DI.",
  "Place the direct facts first (fixed positions, given numbers, “X is on Tuesday”), then the strongest relative clues (“opposite”, “immediately after”, totals).",
  "Branch into cases only when a clue allows two placements. Write each case as its own row and strike out any case that breaks a rule.",
  "Answer: questions on the main grid first, conditional questions last.",
];

export const notation = [
  "✓ and ✗ in grids; ≠ for “not”; arrows for before and after.",
  "Circular seating: number the seats 1 to n clockwise and fix one person at seat 1. Facing the centre, a person’s left neighbour is the next seat clockwise and the right neighbour is anticlockwise. Facing outward, reverse it.",
  "Keep a checklist of the rules and tick each one as you use it. An unused rule is usually where the answer hides.",
];

export const counting = [
  "Round robin with n teams: n(n − 1)/2 matches. Knockout with n teams: n − 1 matches.",
  "Points: total points = (points for a win) × decisive matches + 2 × (points for a draw) × drawn matches.",
  "Calls, handshakes or messages, one per pair of n people: n(n − 1)/2.",
  "Three-set Venn diagram, when each pair count includes the people in all three:",
];
export const vennTex = String.raw`\text{Total} = A + B + C - (AB + BC + CA) + ABC`;
export const cubeRule =
  "A painted n × n × n cube cut into unit cubes: 8 cubes with three painted faces, 12(n − 2) with two, 6(n − 2)² with one and (n − 2)³ with none.";

export const diShortcuts = [
  "Percentage change = difference ÷ base. Use the fraction–percent table from the QA toolkit (1/8 = 12.5%, 1/7 ≈ 14.3%).",
  "Compare two ratios by cross-multiplying instead of dividing: 37/52 against 45/61 means comparing 37 × 61 with 45 × 52.",
  "Round to two significant figures first; calculate exactly only when the options are close.",
  "Two successive growth rates a and b combine to (1 + a)(1 + b) − 1, not a + b.",
];

// [type, looks like, draw this, key move, skip on first pass if, worked in]
export const setTypes: [string, string, string, string, string, string][] = [
  ["Arrangements (linear, circular, ranking)", "Seats, queues, floors, finishing orders", "Numbered slots; fix one person in a circle", "Place fixed and “opposite” or “immediately next” clues before “not next to” clues", "8+ people and mostly negative clues", "arrangement-distribution"],
  ["Matching (who–what–where)", "People × city × job", "A ✓/✗ grid", "Eliminate; a row or column with one blank left is solved", "5+ attributes per person", "matching-truth"],
  ["Numeric distribution", "Items shared out, with totals", "A table with row and column totals", "Start with the most constrained row; use “at least one” limits", "Several unknowns per row and no totals", "arrangement-distribution"],
  ["Scheduling and movement", "Days, slots, durations, trains between stations", "A time axis or a day × slot grid", "Turn durations into one equation; anchor fixed times", "Overlapping durations with many conditions", "scheduling-tournament"],
  ["Tournaments and games", "Round robin, knockout, points tables", "A results matrix plus a points table", "Use the total-points equation; find who must have won or lost", "Many teams, partial results, only max/min questions", "scheduling-tournament"],
  ["Scores, ratings and indices", "Judges’ marks, ratings, weighted indices", "A table of sorted scores", "Apply the rule (drop high/low, weights), then push unknowns to extremes", "The rule changes from round to round", "routes-scores"],
  ["Sets and Venn", "Surveys, overlapping groups", "A 2- or 3-circle Venn with every region labelled", "Fill from the centre outward; use extra memberships for max/min", "Four or more overlapping sets", "di-table-venn"],
  ["Routes and networks", "Roads, flows, calls, messages", "Nodes and edges", "List paths by their first step; inflow = outflow at each node", "Large one-way networks", "routes-scores"],
  ["Data interpretation", "Tables, bar, line, pie or scatter charts", "The completed table", "Fill cells with one unknown first; approximate", "Heavy calculation with close options", "di-charts"],
  ["Binary logic", "Truth-tellers and liars, yes/no answers", "A case table (T or L per person)", "Assume one case and look for a contradiction", "5+ people with nested statements", "matching-truth"],
  ["Process and rule-based", "Machines, games with moves, elimination rounds", "A step-by-step table", "Simulate step by step; look for a repeating cycle", "Rules you cannot summarise in one line", "process-cubes"],
  ["Cubes and spatial", "Painted cubes, dice, nets", "The counting formulas", "Count by face type", "Anything needing real 3-D visualisation", "process-cubes"],
];

export const maxMin =
  "Max/min questions run across every type. “What is the maximum possible…” means: build the extreme case by pushing everything else to its limit, then check that the case breaks no rule.";

export const barData = [
  { name: "Alpha", r24: 120, r25: 150, p25: 18 },
  { name: "Beta", r24: 200, r25: 210, p25: 42 },
  { name: "Gamma", r24: 80, r25: 100, p25: 15 },
  { name: "Delta", r24: 150, r25: 135, p25: 24 },
  { name: "Epsilon", r24: 60, r25: 90, p25: 9 },
];

export const scatterData: [string, number, number][] = [
  ["A", 20, 29], ["B", 35, 30], ["C", 40, 45], ["D", 25, 25], ["E", 30, 37],
  ["F", 45, 40], ["G", 15, 22], ["H", 36, 43], ["I", 28, 20], ["J", 42, 48],
];

export const dilrChapters: Chapter[] = [
  {
    n: 5, slug: "arrangement-distribution", title: "Arrangement and distribution", short: "Arrangement & distribution",
    lede: "Both sets reward the same habit: place the most constrained item first, then let the remaining slots or totals decide the rest. Time yourself at 15 minutes per set before reading the solution.",
    items: [
      {
        n: 1, title: "Circular arrangement", level: "easy",
        setup: ["Six friends, Asha, Bala, Chirag, Divya, Esha and Farhan, sit around a round table, equally spaced and facing the centre."],
        clues: ["Asha sits directly opposite Divya.", "Bala sits immediately to the left of Asha.", "Esha does not sit next to Divya.", "Farhan does not sit next to Bala."],
        questions: ["Who sits directly opposite Bala?", "(TITA) Counting clockwise from Asha, how many people sit between Asha and Chirag?", "Who sits immediately to the right of Divya?", "(TITA) If clue 4 were removed, how many seating arrangements would satisfy the other clues?"],
        solution: [
          "Number the seats 1–6 clockwise. Facing the centre, a person’s left neighbour is the next seat clockwise. Fix Asha at seat 1.",
          { list: ["Clue 1: Divya at seat 4.", "Clue 2: Bala at seat 2.", "Seats 3, 5 and 6 remain for Chirag, Esha and Farhan. Clue 3: seats 3 and 5 touch Divya, so Esha takes seat 6.", "Clue 4: seat 3 touches Bala, so Farhan takes seat 5 and Chirag seat 3."] },
          { table: { head: ["Seat (clockwise)", "1", "2", "3", "4", "5", "6"], rows: [["Person", "Asha", "Bala", "Chirag", "Divya", "Farhan", "Esha"]] } },
        ],
        answers: "(1) Farhan: seat 5 faces seat 2. (2) 1, namely Bala. (3) Chirag: Divya’s right is anticlockwise, seat 3. (4) 2: Esha stays at seat 6, and Chirag and Farhan can swap seats 3 and 5.",
        takeaway: "Fix one person, then use “opposite” and “immediately left/right” before any “not next to” clue. Question 4 is a typical CAT twist: drop a clue and count the cases.",
      },
      {
        title: "Practice set 1: linear arrangement", minutes: 15,
        setup: ["Seven students, P, Q, R, S, T, U and V, sit in a row of seats numbered 1 to 7 from left to right, all facing forward. “To the right of” means a higher seat number."],
        clues: ["P sits at one end of the row.", "Q sits in the middle seat.", "R sits immediately to the right of Q.", "Exactly two people sit between S and R.", "T sits immediately to the left of P.", "U does not sit next to Q."],
        questions: ["Who sits at the left end?", "(TITA) How many people sit between S and T?", "Who sits immediately to the left of Q?", "(TITA) If clue 6 were removed, how many arrangements would satisfy the other clues?"],
        answers: "(1) U. (2) 3. (3) V. (4) 2. The seating is 1 U, 2 S, 3 V, 4 Q, 5 R, 6 T, 7 P: Q takes seat 4 and R seat 5; S must be in seat 2; T needs a seat to P’s left, so P is 7 and T is 6; U avoids seat 3 (next to Q), so U is 1 and V is 3. Without clue 6, U and V can swap.",
      },
      {
        n: 2, title: "Numeric distribution with cases", level: "medium",
        setup: ["Four friends, A, B, C and D, bought 20 pens in all: 7 red, 8 blue and 5 green. Each bought at least one pen of each colour."],
        clues: ["A bought the most pens in total and D the fewest.", "B bought 3 red pens and equal numbers of blue and green pens.", "C bought exactly 5 pens, with more blue than red.", "D bought exactly 3 pens."],
        questions: ["(TITA) How many pens did B buy?", "Which of these must be true? (a) A bought 4 blue pens (b) C bought 2 green pens (c) A bought 2 red pens (d) C bought 3 blue pens", "(TITA) If A bought more blue pens than C, how many green pens did C buy?", "(TITA) How many different distributions satisfy all four clues?"],
        solution: [
          "Write each person as (red, blue, green).",
          { list: ["D: 3 pens with at least one of each, so D = (1, 1, 1).", "C: 5 pens, at least one of each, blue > red. Only (1, 2, 2) and (1, 3, 1) work.", "Red: A + 3 + 1 + 1 = 7, so A has 2 red pens in every case.", "B = (3, x, x). A’s blue = 8 − x − C’s blue − 1 and A’s green = 5 − x − C’s green − 1, each at least 1."] },
          { table: { head: ["C", "x", "B", "A", "Totals A / B / C / D", "Valid?"], rows: [
            ["(1, 2, 2)", 1, "(3, 1, 1)", "(2, 4, 1)", "7/5/5/3", "Yes"],
            ["(1, 2, 2)", 2, "(3, 2, 2)", "(2, 3, 0)", "—", "No: A has no green"],
            ["(1, 3, 1)", 1, "(3, 1, 1)", "(2, 3, 2)", "7/5/5/3", "Yes"],
            ["(1, 3, 1)", 2, "(3, 2, 2)", "(2, 2, 1)", "5/7/5/3", "No: A is not the most"],
          ] } },
        ],
        answers: "(1) 5, in both valid cases. (2) (c). (3) 2: only the first case has A’s blue (4) above C’s (2). (4) 2.",
        takeaway: "Start with the most constrained person (D, then C), let the totals fix what they can, and list the surviving cases in one table. A question that adds a condition simply picks one of your cases.",
      },
      {
        title: "Practice set 2: numeric distribution", minutes: 15,
        setup: ["Three friends, X, Y and Z, share 18 chocolates: 9 dark and 9 milk. Each gets at least one of each kind."],
        clues: ["X gets twice as many chocolates in total as Z.", "Y gets equal numbers of dark and milk chocolates.", "Z gets more dark than milk chocolates.", "X gets at most 3 dark chocolates."],
        questions: ["(TITA) How many chocolates does Y get?", "(TITA) How many milk chocolates does X get?", "Which of these is true? (a) Z gets 2 milk chocolates (b) X gets 4 dark chocolates (c) Y gets 3 dark chocolates (d) Z gets 5 chocolates in all", "(TITA) What is the largest number of chocolates any one friend gets?"],
        answers: "(1) 6. (2) 5. (3) (c). (4) 8. With Z’s total z, X has 2z and Y has 18 − 3z. Y’s total is even, so z is even; Z needs at least 3 (two dark, one milk) and Y at least 2, so z = 4. Then Y has 6 (3 dark, 3 milk) and Z has 4, which must be 3 dark and 1 milk. That leaves X with 3 dark and 5 milk, which satisfies clue 4.",
      },
    ],
  },
  {
    n: 6, slug: "scheduling-tournament", title: "Scheduling and tournament", short: "Scheduling & tournament",
    lede: "Both sets open with a counting equation that removes most of the guesswork: total hours in the schedule, total points in the tournament. Write that equation before placing anything.",
    items: [
      {
        n: 3, title: "Scheduling with durations", level: "easy to medium",
        setup: ["Arun, Bina, Chetan and Dia share one washing machine on a Sunday from 8 a.m. to 2 p.m. Each uses it once, for a whole number of hours, back to back with no gaps, and together they fill all 6 hours."],
        clues: ["Bina’s wash takes twice as long as Arun’s.", "Chetan starts at 10 a.m.", "Dia uses the machine for exactly 1 hour and is not the first user.", "Arun finishes before Chetan starts."],
        questions: ["Who uses the machine last?", "(TITA) At what hour does Dia finish?", "(TITA) If clue 4 were removed, how many schedules would be possible?", "Without clue 4, which of these is certain? (a) Arun goes first (b) Bina goes last (c) Dia finishes at 10 a.m. (d) Chetan uses the machine for 2 hours"],
        solution: [
          "Durations: Arun a, Bina 2a, Dia 1, Chetan c. So a + 2a + 1 + c = 6, or 3a + c = 5, which forces a = 1 and c = 2.",
          { list: ["Chetan runs 10–12, leaving a 2-hour block before (8–10) and one after (12–2).", "The 8–10 block holds either Bina alone or Arun and Dia together.", "Clue 4 puts Arun before 10, so 8–10 is Arun and Dia. Dia is not first, so Arun runs 8–9 and Dia 9–10. Bina takes 12–2."] },
          { table: { head: ["Time", "8–9", "9–10", "10–12", "12–2"], rows: [["User", "Arun", "Dia", "Chetan", "Bina"]] } },
          "Without clue 4, Bina could also take 8–10, with Arun and Dia filling 12–2 in either order. That gives 3 schedules in all.",
        ],
        answers: "(1) Bina. (2) 10 (a.m.). (3) 3. (4) (d): the durations are fixed whatever the order.",
        takeaway: "One equation from the durations usually leaves only a handful of possibilities. Then place the fixed time (Chetan) and fill the blocks around it.",
      },
      {
        title: "Practice set 3: scheduling", minutes: 12,
        setup: ["Five talks, on AI, Banking, Climate, Design and Economics, fill five consecutive one-hour slots, numbered 1 to 5, at a conference."],
        clues: ["The Climate talk is immediately before the Design talk.", "Banking is in slot 2 or slot 4.", "AI is in neither the first nor the last slot.", "Economics comes after Banking."],
        questions: ["Which talk is in the middle slot?", "Which talk is last?", "(TITA) In which slot is the Design talk?", "(TITA) If clue 3 were removed, how many schedules would be possible?"],
        answers: "(1) AI. (2) Economics. (3) 2. (4) 4. Banking in slot 2 fails: Climate–Design would take 3–4 or 4–5, which either leaves AI only an end slot or pushes Economics into slot 1. So Banking is 4 and Economics 5; Climate–Design must be 1–2 (2–3 would put AI in slot 1), and AI takes 3. Without clue 3, these four work: AI–Banking–Climate–Design–Economics, AI–Banking–Economics–Climate–Design, Climate–Design–AI–Banking–Economics and AI–Climate–Design–Banking–Economics.",
      },
      {
        n: 4, title: "Round-robin tournament", level: "medium",
        setup: ["Four teams, P, Q, R and S, play a round robin: every team plays every other team once. A win earns 3 points, a draw 1 and a loss 0. The final points are P 7, Q 5, R 4 and S 0."],
        questions: ["(TITA) How many matches ended in a draw?", "Which team did P fail to beat?", "Which team or teams did R beat?", "If a win had earned 2 points instead of 3, with the same results, what would each team’s points be?"],
        solution: [
          "Four teams play 4 × 3/2 = 6 matches. With w decisive matches and d draws: w + d = 6 and 3w + 2d = 7 + 5 + 4 + 0 = 16. So w = 4 and d = 2.",
          { list: ["S has 0 points, so S lost all three of its matches.", "Q earned 3 by beating S. Its other 2 points cannot include a win (that would add 3), so Q drew with both P and R.", "P earned 3 (S) + 1 (draw with Q) = 4, so it beat R to reach 7.", "R: 3 (S) + 1 (draw with Q) + 0 (lost to P) = 4, which checks out."] },
          { table: { head: ["Row team vs column team", "P", "Q", "R", "S"], rows: [["P", "—", "Draw", "Won", "Won"], ["Q", "Draw", "—", "Draw", "Won"], ["R", "Lost", "Draw", "—", "Won"], ["S", "Lost", "Lost", "Lost", "—"]] } },
        ],
        answers: "(1) 2. (2) Q (a draw). (3) S only. (4) P 5, Q 4, R 3, S 0, so the order stays the same.",
        takeaway: "The total-points equation tells you how many draws there were before you place a single result. Then start from the extreme team (S with 0 points) and the team whose points allow only one split (Q).",
      },
      {
        title: "Practice set 4: tournament", minutes: 15,
        setup: ["Five teams, A, B, C, D and E, play a round robin. A win earns 3 points, a draw 1 and a loss 0. The final points are A 10, B 7, C 6, D 4 and E 1. E’s only point came from its match against B."],
        questions: ["(TITA) How many matches were drawn?", "Which team did D beat?", "Which of these is true? (a) C beat B (b) A drew with D (c) B lost to C (d) E drew with A", "(TITA) How many matches did A and B lose between them?"],
        answers: "(1) 2. (2) E. (3) (b). (4) 1. There are 10 matches, so w + d = 10 and 3w + 2d = 28, giving 8 wins and 2 draws, which means 4 “draw slots” across teams. A’s 10 points can only be 3 wins and a draw; B’s 7 only 2 wins, a draw and a loss; E’s 1 is a single draw. That is three slots; the fourth must be D’s (1 win, 1 draw, 2 losses), because C’s options give 0 or 3 draws. E drew with B, so the other draw is A–D. Then A beat B, C and E; B beat C and D; C beat D and E; D beat E.",
      },
    ],
  },
  {
    n: 7, slug: "di-table-venn", title: "DI table and Venn diagram", short: "DI table & Venn",
    lede: "These are the two most “mechanical” set types: a missing-data table fills itself if you always attack the cell that is alone in its row or column, and a Venn set falls to one formula plus the extra-memberships idea for max-min questions.",
    items: [
      {
        n: 5, title: "DI table with missing values", level: "easy",
        setup: ["Units sold by four shops from January to March. Some cells are blank."],
        data: { head: ["Shop", "Jan", "Feb", "Mar", "Total"], rows: [["W", 120, "?", 150, 400], ["X", "?", 140, "?", 420], ["Y", 100, 110, "?", "?"], ["Z", "?", "?", 160, "?"], ["Total", 450, 430, "?", "?"]] },
        clues: ["X sold 20 more units in March than in January.", "Y’s three-month total equals W’s.", "Z sold 50 more units in January than in February."],
        questions: ["(TITA) How many units did Y sell in March?", "Which shop had the highest percentage growth from January to March?", "In how many shops did sales fall from January to February?", "(TITA) What percentage of the three-month total came in March, to the nearest whole number?"],
        solution: [
          "Fill one-unknown cells first.",
          { list: ["W’s Feb = 400 − 120 − 150 = 130.", "X: Jan + Mar = 420 − 140 = 280, and Mar = Jan + 20, so Jan = 130 and Mar = 150.", "Y’s total = 400, so Y’s Mar = 400 − 100 − 110 = 190.", "Z’s Jan = 450 − (120 + 130 + 100) = 100. Z’s Feb = 430 − (130 + 140 + 110) = 50, which matches the “50 more” clue.", "March total = 150 + 150 + 190 + 160 = 650. Grand total = 1,530."] },
          { table: { head: ["Shop", "Jan", "Feb", "Mar", "Total"], rows: [["W", 120, 130, 150, 400], ["X", 130, 140, 150, 420], ["Y", 100, 110, 190, 400], ["Z", 100, 50, 160, 310], ["Total", 450, 430, 650, "1,530"]] } },
        ],
        answers: "(1) 190. (2) Y, at 90% (W 25%, X 15.4%, Z 60%). (3) 1, namely Z. (4) 42: 650/1,530 = 0.4248, which rounds to 42%. When a TITA answer sits this close to a rounding boundary, compute to three decimal places.",
        takeaway: "Look for a row or column with exactly one blank; each cell you fill unlocks the next. Use the extra clues only when the totals run out.",
      },
      {
        title: "Practice set 5: DI table with missing values", minutes: 12,
        setup: ["Students in two sections, P and Q, each chose one elective. Some cells are blank."],
        data: { head: ["Elective", "Section P", "Section Q", "Total"], rows: [["Finance", 24, "?", 50], ["Marketing", "?", 30, "?"], ["HR", 12, "?", "?"], ["Operations", "?", "?", 40], ["Total", 80, 90, 170]] },
        clues: ["In Section P, Marketing had twice as many students as HR.", "Operations had the same number of students in both sections."],
        questions: ["(TITA) How many Section Q students chose HR?", "Which elective was the most popular overall?", "(TITA) What percentage of Section P chose Finance?", "In how many electives did Section Q have more students than Section P?"],
        answers: "(1) 14. (2) Marketing, with 54. (3) 30: 24 of 80. (4) 3: Finance, Marketing and HR (Operations is equal). Fill in order: Finance Q = 26; Marketing P = 2 × 12 = 24; Operations P = 80 − 24 − 24 − 12 = 20, so Operations Q is also 20 (total 40, which checks out); HR Q = 90 − 26 − 30 − 20 = 14.",
      },
      {
        n: 6, title: "Venn diagram with max-min", level: "medium",
        setup: ["Each of 100 students studies at least one of French, German and Spanish. 50 study French, 40 German and 35 Spanish. 12 study both French and German, 10 both German and Spanish, and 8 both French and Spanish; each pair count includes the students who study all three."],
        questions: ["(TITA) How many study all three languages?", "(TITA) How many study exactly one language?", "(TITA) How many study only French?", "(TITA) Suppose you knew only the three subject totals and that all 100 study at least one language. What is the largest possible number studying all three?"],
        solution: [
          { list: ["100 = 50 + 40 + 35 − (12 + 10 + 8) + x, so x = 5.", "Exactly two languages: (12 − 5) + (10 − 5) + (8 − 5) = 15.", "Exactly one: 100 − 15 − 5 = 80.", "Only French: 50 − 7 (French and German only) − 3 (French and Spanish only) − 5 (all three) = 35."] },
          "The max-min idea: extra memberships. The subject totals add up to 125, but there are only 100 students, so 25 memberships are “extra”. A student in exactly two languages accounts for 1 extra; a student in all three accounts for 2. To make the all-three group as large as possible, use 2s: 12 students × 2 = 24, plus one student in exactly two languages for the last 1. The maximum is 12 (and the minimum is 0, using 25 students in exactly two).",
          "Check that 12 is achievable: only French 37, only German 27, only Spanish 23, French and German only 1, all three 12. That makes 100 students, with French 37 + 1 + 12 = 50, German 27 + 1 + 12 = 40 and Spanish 23 + 12 = 35.",
        ],
        answers: "(1) 5. (2) 80. (3) 35. (4) 12.",
        takeaway: "Fill a Venn diagram from the centre outward. For maximum or minimum overlaps, count the extra memberships and spend them as 1s or 2s.",
      },
      {
        title: "Practice set 6: Venn diagram", minutes: 12,
        setup: ["In a survey of 200 people, everyone uses at least one of three apps, X, Y and Z. 110 use X, 90 use Y and 70 use Z. 30 use both X and Y, 25 both Y and Z, and 20 both X and Z; each pair count includes those who use all three."],
        questions: ["(TITA) How many people use all three apps?", "(TITA) How many use exactly one app?", "(TITA) How many use only Y?", "(TITA) If you knew only the three app totals and that everyone uses at least one app, what is the largest possible number using all three?"],
        answers: "(1) 5: 200 = 110 + 90 + 70 − (30 + 25 + 20) + x. (2) 135: exactly two = 25 + 20 + 15 = 60, so exactly one = 200 − 60 − 5. (3) 40: 90 − 25 − 20 − 5. (4) 35: the totals add to 270, so there are 70 extra memberships; each all-three user takes 2, giving 35. Check: only X 75, only Y 55, only Z 35 and all three 35 make 200.",
      },
    ],
  },
  {
    n: 8, slug: "routes-scores", title: "Routes and scores, plus two mini-types", short: "Routes & scores",
    lede: "Routes sets reward a systematic list; scoring sets reward testing the unknown at its low end, middle and high end. Both are common sources of TITA questions.",
    items: [
      {
        n: 7, title: "Routes and networks", level: "easy",
        setup: ["Five towns, A to E, are joined by two-way roads with these travel times in minutes: A–B 10, A–C 15, B–C 4, B–D 12, C–D 6, C–E 20, D–E 8. There are no other roads."],
        questions: ["(TITA) What is the fastest time from A to E?", "(TITA) If road B–C is closed, what is the fastest time from A to E?", "(TITA) How many routes from A to E visit no town twice?", "(TITA) What is the fastest time from A to E that avoids town C?"],
        solution: [
          "Draw the five towns and seven roads, then list every route by its first step so none is missed.",
          { table: { head: ["Route", "Time (minutes)"], rows: [["A–B–C–D–E", "10 + 4 + 6 + 8 = 28"], ["A–B–C–E", "10 + 4 + 20 = 34"], ["A–B–D–E", "10 + 12 + 8 = 30"], ["A–B–D–C–E", "10 + 12 + 6 + 20 = 48"], ["A–C–E", "15 + 20 = 35"], ["A–C–D–E", "15 + 6 + 8 = 29"], ["A–C–B–D–E", "15 + 4 + 12 + 8 = 39"]] } },
        ],
        answers: "(1) 28, via A–B–C–D–E. (2) 29, via A–C–D–E. (3) 7. (4) 30, via A–B–D–E.",
        takeaway: "Enumerate routes by first step and never skip a branch. With five or six towns, a complete list takes under two minutes and answers every question at once.",
      },
      {
        title: "Practice set 7: one-way routes", minutes: 12,
        setup: ["Six towns, P, Q, R, S, T and U, are joined by one-way roads with these travel times in minutes: P→Q 5, P→R 8, Q→R 2, Q→S 7, R→S 3, R→T 9, S→T 4, S→U 10 and T→U 3. There are no other roads."],
        questions: ["(TITA) What is the fastest time from P to U?", "(TITA) How many different routes lead from P to U?", "(TITA) If the road R→S is closed, what is the fastest time from P to U?", "(TITA) What is the fastest time from P to U that avoids T?"],
        answers: "(1) 17, via P→Q→R→S→T→U. (2) 8. (3) 19. (4) 20. Work forward one town at a time. Fastest arrival: Q 5, R 7 (via Q), S 10 (via R), T 14 (via S), U 17 (via T). Number of routes: each town’s count is the sum of the counts of the towns with roads into it, so Q 1, R 2, S 3, T 5, U 8. Without R→S: S becomes 12, T 16 and U 19. Avoiding T: U = S + 10 = 20.",
        takeaway: "On one-way networks, never list routes by hand; carry the best time and the route count forward town by town.",
      },
      {
        n: 8, title: "Scores with a drop-high, drop-low rule", level: "medium",
        setup: ["Five judges score each dancer out of 10, in whole numbers. The highest and the lowest scores are dropped (one of each, even if tied), and the result is the average of the middle three. Xena’s known scores are 6, 7, 8 and 9, and her fifth score, m, is unknown. Yash’s known scores are 8, 8, 9 and 10, and his fifth score, n, is unknown."],
        questions: ["What are Xena’s lowest and highest possible results?", "(TITA) If Xena’s result is 23/3, what is m?", "What are Yash’s lowest and highest possible results?", "Can Xena finish ahead of Yash?"],
        solution: [
          "Test the unknown in three bands.",
          { list: ["Xena, m ≤ 6: the middle three are 6, 7, 8, giving 7. For 6 ≤ m ≤ 9: the middle three are 7, 8 and m, giving (15 + m)/3, between 7 and 8. For m ≥ 9: the middle three are 7, 8, 9, giving 8.", "Xena’s result 23/3 means (15 + m)/3 = 23/3, so m = 8.", "Yash, n ≤ 8: the middle three are 8, 8, 9, giving 25/3 ≈ 8.33. For 8 ≤ n ≤ 10: the middle three are 8, 9 and n, giving (17 + n)/3, between 8.33 and 9."] },
        ],
        answers: "(1) 7 and 8. (2) 8. (3) 25/3 (about 8.33) and 9. (4) No: Xena’s best (8) is below Yash’s worst (8.33).",
        takeaway: "With a sorting rule, an unknown can sit below, inside or above the known values. Test all three bands and the extremes appear on their own.",
      },
      {
        title: "Practice set 8: scores with a rule", minutes: 12,
        setup: ["Four judges score each of three singers out of 10, in whole numbers. The highest and lowest scores are dropped (one of each, even if tied) and the middle two are added. Kavya’s known scores are 6, 9 and 7, plus an unknown k. Leela’s scores are 8, 8, 5 and 10. Meher’s known scores are 7, 7 and 8, plus an unknown m."],
        questions: ["(TITA) What is Leela’s final score?", "What are Kavya’s lowest and highest possible final scores?", "Can Meher finish strictly ahead of Leela?", "If both unknown scores are 8, who finishes higher, Kavya or Meher?"],
        answers: "(1) 16: the middle two of 5, 8, 8, 10. (2) 13 and 16: if k ≤ 6 the middle two are 6 and 7; between 6 and 9 they are 7 and k; at 9 or above they are 7 and 9. (3) No: Meher’s middle two are 7 and 7 (m ≤ 7), 7 and m (7 to 8) or 7 and 8 (m ≥ 8), so her best is 15. (4) A tie at 15: Kavya gets 7 + 8 and Meher 7 + 8.",
      },
      {
        mini: "Mini-type: truth-tellers and liars",
        body: [
          "Each of A, B and C either always tells the truth or always lies. A says “B is a liar”. B says “C is a liar”. C says “A and B are both liars”. Who tells the truth?",
          "Solution: assume C is truthful. Then A and B are liars; but A lying means B is truthful, a contradiction. So C lies, and B’s statement “C is a liar” is true: B is truthful. A’s statement “B is a liar” is then false, so A lies. Check: C’s claim that both A and B lie is false, as it should be. Answer: only B tells the truth.",
          "The method: assume one person’s type, follow the chain, and drop the assumption the moment it contradicts itself.",
        ],
      },
      {
        mini: "Mini-type: painted cube",
        body: ["A 4 × 4 × 4 cube is painted on every face and cut into 64 unit cubes. With n = 4: three painted faces 8, two faces 12 × 2 = 24, one face 6 × 2² = 24, and no paint 2³ = 8. Check: 8 + 24 + 24 + 8 = 64."],
      },
    ],
  },
  {
    n: 9, slug: "matching-truth", title: "Matching grid and truth-tellers", short: "Matching & truth-tellers",
    lede: "Both types are pure logic with no numbers. A matching grid falls to elimination, and a truth-teller set falls to turning each statement into a relation between people; set up correctly, each takes under 10 minutes.",
    items: [
      {
        n: 9, title: "Matching grid", level: "easy to medium",
        setup: ["Four friends, Anil, Bela, Chris and Dev, each live in a different city (Chennai, Delhi, Kolkata, Mumbai), do a different job (architect, banker, chef, doctor) and own a different pet (cat, dog, fish, parrot)."],
        clues: ["The banker lives in Delhi.", "Bela owns the parrot.", "Whoever lives in Mumbai owns the fish.", "Anil is the chef and does not live in Chennai.", "Dev lives in Kolkata.", "The doctor owns the dog.", "The architect owns the cat.", "Dev does not own the dog."],
        questions: ["Who lives in Chennai?", "Which pet does the banker own?", "Which of these is true? (a) Dev is the doctor (b) The architect lives in Kolkata (c) Anil lives in Delhi (d) Chris owns the cat", "(TITA) If clue 8 were removed, how many complete assignments would satisfy the other clues?"],
        solution: [
          { list: ["Dev lives in Kolkata (clue 5). Anil is the chef, so he is not the banker and cannot live in Delhi (clue 1); he is not in Chennai either (clue 4). So Anil lives in Mumbai and owns the fish (clue 3).", "Bela owns the parrot, so she is neither the doctor (dog owner) nor the architect (cat owner). She is the banker, in Delhi, which leaves Chennai for Chris.", "Chris and Dev share the doctor and architect jobs and the dog and cat. Clue 8 gives Dev the cat, so Dev is the architect and Chris the doctor with the dog."] },
          { table: { head: ["Person", "City", "Job", "Pet"], rows: [["Anil", "Mumbai", "Chef", "Fish"], ["Bela", "Delhi", "Banker", "Parrot"], ["Chris", "Chennai", "Doctor", "Dog"], ["Dev", "Kolkata", "Architect", "Cat"]] } },
        ],
        answers: "(1) Chris. (2) A parrot. (3) (b). (4) 2: without clue 8, Chris and Dev could swap jobs and pets.",
        takeaway: "A clue that links two attributes (“the doctor owns the dog”) rules out whole rows at once: Bela’s parrot removed two jobs in a single step.",
      },
      {
        title: "Practice set 9: matching grid", minutes: 8,
        setup: ["Three colleagues, Ira, Jai and Kavi, each drive a different-coloured car (red, blue, white), work in a different department (sales, HR, IT) and arrive at a different time (8, 9 or 10 a.m.)."],
        clues: ["The person in IT arrives at 8.", "Jai drives the blue car and is not in sales.", "The red car’s owner arrives at 10.", "Kavi arrives before Ira.", "Ira is in sales.", "The person in HR drives the white car."],
        questions: ["Who arrives at 9?", "What colour is the IT person’s car?", "If clue 6 were removed, who could arrive at 8?"],
        answers: "(1) Kavi. (2) Blue. (3) Jai or Kavi. Ira is in sales, so she cannot arrive at 8 (that is the IT slot), and Kavi arrives before her. Jai’s blue car rules him out of 10, and Kavi cannot be last because he arrives before Ira, so the red car at 10 belongs to Ira. Jai is in HR or IT, and clue 6 rules out HR, so Jai is IT at 8 and Kavi is HR at 9 with the white car. Without clue 6, Kavi could take IT at 8 with Jai in HR at 9.",
      },
      {
        n: 10, title: "Truth-tellers and liars", level: "medium",
        setup: ["Five people, A, B, C, D and E, are each either a knight, who always tells the truth, or a knave, who always lies."],
        clues: ["A says: “B is a knave.”", "B says: “C and D are both knights.”", "C says: “Exactly one of A and E is a knave.”", "D says: “B is a knight.”", "E says: “A and D are of the same type.”"],
        questions: ["(TITA) How many knights are there?", "Which pair are both knights? (a) A and B (b) A and C (c) C and D (d) D and E", "A sixth person, F, says “A is a knave.” What is F?", "Using only A’s and D’s statements, what can you conclude about E?"],
        solution: [
          { list: ["A’s statement makes A and B opposite types. D’s statement makes D the same type as B. So A and D are always opposite, which makes E’s claim false: E is a knave.", "With E a knave, C’s claim (“exactly one of A and E is a knave”) is true exactly when A is a knight, so C is the same type as A.", "C matches A and D is opposite to A, so C and D can never both be knights. B’s claim is false and B is a knave. Then A is a knight, C a knight and D a knave.", "Check every statement: A’s is true, B’s false, C’s true (A is a knight, E a knave), D’s false and E’s false."] },
        ],
        answers: "(1) 2, namely A and C. (2) (b). (3) A knave, because A is a knight. (4) E is a knave, because A and D are always of opposite types.",
        takeaway: "Turn each statement into a relation (“A is opposite to B”, “D matches B”). Chains of relations usually settle most people before you test a single case.",
      },
      {
        title: "Practice set 10: truth-tellers", minutes: 8,
        setup: ["Four people, P, Q, R and S, are each a knight (always truthful) or a knave (always lying)."],
        clues: ["P says: “Q is a knight.”", "Q says: “R is a knave.”", "R says: “P and Q are both knaves.”", "S says: “Exactly one of us four is a knight.”"],
        questions: ["(TITA) How many knights are there?", "Is S a knight or a knave?", "Who are the knights?"],
        answers: "(1) 2. (2) A knave. (3) P and Q. P’s statement makes P and Q the same type, and Q’s makes R the opposite of Q, so either P and Q are knights with R a knave, or the reverse. In the reverse case R is the only knight among P, Q, R, and S breaks it: as a knight, S would be a second knight, making the claim false; as a knave, S would leave exactly one knight, making the claim true. So P and Q are knights, R is a knave, and S is a knave whose claim of “exactly one” is false.",
      },
    ],
  },
  {
    n: 10, slug: "di-charts", title: "DI with charts", short: "DI charts",
    lede: "Chart-based DI is careful reading plus the percentage arithmetic from your QA prep: copy each value you need into your notes once, then compute. Six of the fifteen CAT 2025 sets were DI-style, so treat these as core, not optional.",
    items: [
      {
        n: 11, title: "Bar chart", level: "easy",
        setup: [],
        chart: "bar",
        questions: ["Which company had the highest profit margin (profit ÷ revenue) in 2025?", "(TITA) What was the highest percentage growth in revenue from 2024 to 2025?", "(TITA) What was the total 2025 profit of the five companies, in ₹ crore?", "In how many companies was the 2025 profit margin above 15%?"],
        solution: [
          "Work out the two derived numbers every question needs, one line per company:",
          { list: ["Profit margin in 2025: Alpha 18/150 = 12%, Beta 42/210 = 20%, Gamma 15/100 = 15%, Delta 24/135 ≈ 17.8%, Epsilon 9/90 = 10%.", "Revenue growth: Alpha +25%, Beta +5%, Gamma +25%, Delta −10%, Epsilon +50%."] },
        ],
        answers: "(1) Beta. (2) 50, Epsilon. (3) 108: 18 + 42 + 15 + 24 + 9. (4) 2, Beta and Delta; Gamma’s 15% is not above 15%.",
        takeaway: "“Above 15%” excludes exactly 15%; read the inequality in every DI question before counting.",
      },
      {
        title: "Practice on the same bar chart", minutes: 5,
        setup: ["Use the bar chart above."],
        questions: ["(TITA) By how many crore did Delta’s revenue fall from 2024 to 2025?", "Which company’s 2025 revenue was closest to the five-company average?", "(TITA) What was the combined revenue growth of the five companies, in percent to one decimal place?"],
        answers: "(1) 15. (2) Delta: the average is 685 ÷ 5 = 137. (3) 12.3: revenue rose from 610 to 685, and 75/610 ≈ 0.123.",
      },
      {
        n: 12, title: "Scatter plot", level: "medium",
        setup: [],
        chart: "scatter",
        questions: ["(TITA) How many students scored higher in Test 2 than in Test 1?", "Which student improved the most?", "(TITA) What was the highest combined score across both tests?", "(TITA) How many students scored at least 40 in both tests?"],
        solution: ["The dashed line marks equal scores: points above it improved, points below it fell, and D sits on it. Improvements: A +9, E +7, G +7, H +7, J +6, C +5. Combined scores: J has 90, ahead of C and F at 85 each. At least 40 in both tests: C (40, 45), F (45, 40) and J (42, 48); H misses with 36 in Test 1."],
        answers: "(1) 6: A, C, E, G, H and J. (2) A. (3) 90. (4) 3.",
        takeaway: "On a scatter plot, picture the line y = x first; it turns “who improved” into “which points sit above the line”. CAT also draws lines such as y = 2x to ask about ratios.",
      },
      {
        title: "Practice on the same scatter plot", minutes: 5,
        setup: ["Use the scatter plot above."],
        questions: ["(TITA) What was the average Test 1 score of the ten students?", "(TITA) How many students’ scores fell from Test 1 to Test 2?", "(TITA) What was the largest fall?"],
        answers: "(1) 31.6: the Test 1 scores add to 316. (2) 3: B, F and I. (3) 8, by I (28 to 20).",
      },
    ],
  },
  {
    n: 11, slug: "process-cubes", title: "Process sets and cubes", short: "Process & cubes",
    lede: "Process sets reward simulation: write the state after every step in a table and watch for a repeat. Cube sets reward the counting formulas. Both usually go on the skip list in the first pass, but their simple versions are quick marks.",
    items: [
      {
        n: 13, title: "Process set, a token game", level: "medium",
        setup: ["Four friends, A, B, C and D, start with 9, 7, 5 and 3 tokens. In each round, the person with the most tokens gives one token to each of the other three. If two people tie for the most, the one who comes first alphabetically gives."],
        questions: ["Who has the most tokens after round 3?", "(TITA) How many tokens does A have after round 5?", "After which round does a distribution first repeat an earlier one?", "(TITA) How many tokens does D have after round 10?"],
        solution: [
          "Simulate in a table; the total stays at 24, a free check on every row.",
          { table: { head: ["After round", "A", "B", "C", "D", "Who gave"], rows: [["Start", 9, 7, 5, 3, "—"], [1, 6, 8, 6, 4, "A"], [2, 7, 5, 7, 5, "B"], [3, 4, 6, 8, 6, "A (tied with C)"], [4, 5, 7, 5, 7, "C"], [5, 6, 4, 6, 8, "B (tied with D)"], [6, 7, 5, 7, 5, "D"]] } },
        ],
        answers: "(1) C, with 8. (2) 6. (3) Round 6 repeats round 2. (4) 5: from round 2 the pattern repeats every 4 rounds, so round 10 matches rounds 6 and 2.",
        takeaway: "Once any state repeats, everything after it cycles. Find the cycle length and you can answer “after round 50” in seconds.",
      },
      {
        title: "Practice set 13: process", minutes: 8,
        setup: ["Three jars, X, Y and Z, hold 12, 6 and 2 marbles. In each step, the jar with the most marbles gives 2 marbles to the jar with the fewest. Ties for most or for fewest go to the earlier letter."],
        questions: ["(TITA) How many marbles are in Y after step 3?", "After step 2, which two jars hold equal numbers?", "(TITA) How many marbles are in X after step 20?"],
        answers: "(1) 8. (2) Y and Z, with 6 each. (3) 8. The states run: step 1 (10, 6, 4), step 2 (8, 6, 6), step 3 (6, 8, 6), step 4 (8, 6, 6), step 5 (6, 8, 6). From step 3 the jars alternate, so every even step from 4 onwards gives X 8.",
      },
      {
        n: 14, title: "Painted cube", level: "easy to medium",
        setup: ["A 5 × 5 × 5 cube is painted red on all six faces and cut into 125 unit cubes."],
        questions: ["(TITA) How many unit cubes have exactly two red faces?", "(TITA) How many have exactly one red face?", "(TITA) How many have no red face?", "(TITA) The top layer of 25 cubes is removed, and the remaining 5 × 5 × 4 block is painted blue on all its outer faces. How many of its 100 cubes have no paint at all?"],
        solution: ["With n = 5: three red faces 8 (the corners); two faces 12 × 3 = 36 (edges without corners); one face 6 × 3² = 54; none 3³ = 27. Check: 8 + 36 + 54 + 27 = 125. For question 4, the unpainted cubes are the new block’s interior: 3 along the length, 3 along the width and 2 in height (the block is only 4 layers tall), so 3 × 3 × 2. All of them were inside the original cube, so they never had red either."],
        answers: "(1) 36. (2) 54. (3) 27. (4) 18.",
        takeaway: "For any a × b × c block painted on the outside: 8 corner cubes have three painted faces and (a − 2)(b − 2)(c − 2) have none. Learn those two and get the rest by subtraction.",
      },
      {
        title: "Practice set 14: cubes", minutes: 6,
        setup: [],
        questions: ["(TITA) A 4 × 4 × 4 cube painted on all faces is cut into 64 unit cubes. How many have exactly two painted faces?", "(TITA) In the same cube, how many have exactly one painted face?", "(TITA) A 3 × 4 × 5 cuboid is painted on all faces and cut into 60 unit cubes. How many have no paint?", "(TITA) In that cuboid, how many unit cubes have exactly three painted faces?"],
        answers: "(1) 24: 12 × 2. (2) 24: 6 × 2². (3) 6: 1 × 2 × 3. (4) 8: the corners.",
      },
    ],
  },
];

export const dilrRoutine = [
  "Set A, 15 minutes: this week’s focus type.",
  "Set B, 15 minutes: a mixed type from a real CAT paper.",
  "Analysis, 25–30 minutes: redo every missed question without a timer, write down the rule you misread or the case you missed, and note how long your first placement took.",
];

export const selectionDrill = [
  "Open a past DILR section and give yourself exactly 5 minutes to rank its five sets.",
  "Solve your top two, timed.",
  "Compare your ranking with a published difficulty rating of that paper; IMS’s CAT 2025 analysis rates every set easy, medium or difficult. Note any easy set you ranked low, and why.",
];

export const dilrSources: [string, string][] = [
  ["Cracku CAT previous papers", "Slot-wise papers from 2017 to 2025 with solutions. Use their DILR sections as your Set B and for the full 40-minute sections."],
  ["IMS CAT 2025 analysis", "Set names and difficulty ratings for all 15 sets of CAT 2025, useful for the selection drill."],
  ["Older CAT papers (2008 and earlier)", "Simpler LR sets. They make good warm-ups in Weeks 1–2."],
];
