import type { Section } from '@/db/schema';

export type TopicSeed = {
  section: Section;
  area: string;
  name: string;
  slug: string;
  catWeightAvg: number; // average questions per CAT paper
  inScope: boolean;
  priority: number; // 1 = study first
  conceptNotes?: string;
};

/**
 * QA whitelist. Arithmetic + Algebra only — together ~16 of the 22 QA
 * questions. Everything else is seeded with inScope:false so it still shows
 * in mock analysis as "out of scope, skipped by design" rather than as a loss.
 */
export const TOPICS: TopicSeed[] = [
  /* ------------------------- QA · Arithmetic ------------------------- */
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Time, Speed & Distance',
    slug: 'tsd',
    catWeightAvg: 1.8,
    inScope: true,
    priority: 1,
    conceptNotes: `**Core:** d = s x t. Hold one of the three constant and the other two are in direct or inverse proportion — most CAT questions are a proportion question wearing a costume.

- Speed constant -> d proportional to t. Time constant -> d proportional to s. Distance constant -> s inversely proportional to t (so if speeds are in ratio a:b, times are b:a).
- **Average speed** for equal *distances* = harmonic mean = 2ab/(a+b). For equal *times* = arithmetic mean = (a+b)/2. Mixing these up is the single most common error in this topic.
- **Relative speed:** opposite directions add, same direction subtract.
- **Trains:** crossing a pole = own length; crossing a platform = own length + platform length.
- **Boats:** downstream = b + s, upstream = b - s. So b = (down + up)/2 and s = (down - up)/2.
- **Races:** "A beats B by 20 m" means when A finishes, B is 20 m behind. "Beats by 5 s" is a time gap — convert one into the other using B's speed.
- **Circular tracks:** first meeting time = L/(relative speed). Meetings at the start point use L/s1 and L/s2 and their LCM.

**Trap:** a question that gives you a distance you never need. Check what is actually asked before computing.`,
  },
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Time & Work',
    slug: 'time-work',
    catWeightAvg: 1.5,
    inScope: true,
    priority: 2,
    conceptNotes: `**Core:** work rate = 1/time. Rates add. Never work with fractions here — use the **LCM method**: set total work = LCM of the given times, then each worker's rate is a clean integer.

- A in 12 d, B in 18 d -> total work = 36 units, A = 3/day, B = 2/day, together 5/day -> 36/5 = 7.2 days.
- **Efficiency is inversely proportional to time.** "A is twice as efficient as B" -> A takes half the time.
- **M1 D1 H1 / W1 = M2 D2 H2 / W2** for the men-days-hours-work family.
- **Pipes & cisterns** is the same topic with an outlet pipe as a negative rate.
- **Wages** split in the ratio of work done, which is the ratio of rates when time is shared.

**Trap:** alternating-day problems. Compute work per *cycle* (2 days), find how many full cycles fit, then handle the remainder day by day — do not divide straight through.`,
  },
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Percentages',
    slug: 'percentages',
    catWeightAvg: 1.2,
    inScope: true,
    priority: 3,
    conceptNotes: `**Core:** percentages are multipliers. A 20% rise is x1.2, a 20% fall is x0.8. Chain them by multiplying, never by adding.

- **Successive change** a% then b% = net (a + b + ab/100)%. Up 20 then down 20 = -4%, not 0.
- **Fraction equivalents** — memorise these, they convert ugly arithmetic into one-step work: 1/2=50, 1/3=33.33, 1/4=25, 1/5=20, 1/6=16.67, 1/7=14.28, 1/8=12.5, 1/9=11.11, 1/11=9.09, 1/12=8.33, 1/16=6.25.
- **A is x% more than B** -> B is 100x/(100+x)% less than A. The asymmetry is deliberately exploited in CAT.
- To keep a product constant, if one factor rises x%, the other must fall 100x/(100+x)%.

**Trap:** "percentage" vs "percentage point". A rise from 20% to 25% is 5 percentage points but a 25% increase.`,
  },
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Profit, Loss & Discount',
    slug: 'profit-loss',
    catWeightAvg: 1.4,
    inScope: true,
    priority: 4,
    conceptNotes: `**Core:** profit% is always on **CP**; discount% is always on **MP**. Almost every wrong answer in this topic comes from using the wrong base.

- SP = CP(1 + p/100), SP = MP(1 - d/100).
- Chain: MP -> discount -> SP -> compare to CP for profit.
- **Two articles sold at the same price**, one at +x% and one at -x%: always a net **loss** of x^2/100 %. The answer does not depend on the price.
- **False weights:** gain% = (true weight - false weight)/false weight x 100.
- Markup m% then discount d% -> net profit = m - d - md/100.

**Trap:** questions that give CP for one item and SP for a different quantity. Normalise to per-unit before anything else.`,
  },
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Ratio, Proportion & Variation',
    slug: 'ratio-proportion',
    catWeightAvg: 1.3,
    inScope: true,
    priority: 5,
    conceptNotes: `**Core:** introduce k. If a:b = 3:4, write a = 3k, b = 4k and the problem becomes linear.

- **Componendo-dividendo:** if a/b = c/d then (a+b)/(a-b) = (c+d)/(c-d). Saves a full page of algebra when the question hands you a sum and a difference.
- Combining a:b and b:c -> scale so b matches, then a:b:c.
- **Direct variation** a = kb; **inverse** ab = k; **joint** a = kbc.
- Partnership profit splits in the ratio of (capital x time).

**Trap:** "the ratio becomes 5:6 after adding 4 to each" — the added amount is *not* in the ratio. Set up 3k+4 : 4k+4 = 5 : 6 and solve for k.`,
  },
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Averages, Mixtures & Alligation',
    slug: 'averages-mixtures',
    catWeightAvg: 1.4,
    inScope: true,
    priority: 6,
    conceptNotes: `**Core:** average = sum/count, so sum = average x count. Convert every average statement into a *sum* statement immediately.

- **Deviation method:** pick a convenient base, average the deviations, add back. Far faster than summing large numbers.
- **Alligation:** (cheap) --- (mean) --- (dear); ratio of quantities = (dear - mean) : (mean - cheap). Works for any weighted average — price, concentration, speed, marks.
- **Repeated replacement:** removing x from a vessel of volume V and topping up, n times, leaves pure quantity V(1 - x/V)^n.
- Adding pure solvent keeps the *solute* constant — track the thing that does not change.

**Trap:** weighted averages where the weights are not the obvious numbers. For average speed the weights are times, not distances.`,
  },
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Simple & Compound Interest',
    slug: 'si-ci',
    catWeightAvg: 1.0,
    inScope: true,
    priority: 7,
    conceptNotes: `**Core:** SI = PRT/100 (linear). CI: A = P(1 + r/100)^n (multiplicative — treat it as successive percentages).

- **CI - SI for 2 years = P(r/100)^2.** For 3 years = P(r/100)^2 (3 + r/100). The 2-year form appears constantly.
- SI is an AP; CI is a GP. If a sum doubles in n years at CI, it quadruples in 2n.
- Half-yearly: rate/2, periods x2. Quarterly: rate/4, periods x4.
- **Rule of 72:** doubling time is roughly 72/r — good enough to eliminate options.

**Trap:** "amount" vs "interest". Read which one the question wants.`,
  },
  {
    section: 'QA',
    area: 'Arithmetic',
    name: 'Linear Word Problems & Ages',
    slug: 'word-problems',
    catWeightAvg: 0.6,
    inScope: true,
    priority: 8,
    conceptNotes: `**Core:** the skill is translation, not algebra. Name the unknown as the thing the question asks for, write one equation per sentence, then solve.

- Ages: if the difference is constant, use it. Present age x; n years ago = x - n; n years hence = x + n.
- For two unknowns you need two independent statements — if you only have one, something is a ratio.
- **Back-substitute the options.** With 4 numeric choices this is often faster than solving, especially for TITA-adjacent MCQs.

**Trap:** "in 5 years' time" applies to *everyone* in the problem, not just the subject.`,
  },

  /* --------------------------- QA · Algebra --------------------------- */
  {
    section: 'QA',
    area: 'Algebra',
    name: 'Linear & Quadratic Equations',
    slug: 'equations',
    catWeightAvg: 1.8,
    inScope: true,
    priority: 9,
    conceptNotes: `**Core:** for ax^2 + bx + c = 0 — sum of roots = -b/a, product = c/a. Most CAT questions ask about the roots, not for the roots, so you rarely need the quadratic formula.

- **Discriminant** D = b^2 - 4ac: D>0 distinct real, D=0 equal, D<0 complex. "Real and distinct" is a D>0 constraint on a parameter.
- Common root of two quadratics: subtract the equations to get a linear one, solve, substitute back.
- **Symmetric expressions:** a^2+b^2 = (a+b)^2 - 2ab, a^3+b^3 = (a+b)^3 - 3ab(a+b). Express everything in sum and product.
- Linear systems: unique if a1/a2 != b1/b2; infinite if all three ratios equal; none if the first two are equal but differ from the third.

**Trap:** a "quadratic" whose leading coefficient contains the parameter — if that coefficient can be zero, the linear case is a separate answer branch.`,
  },
  {
    section: 'QA',
    area: 'Algebra',
    name: 'Inequalities & Modulus',
    slug: 'inequalities',
    catWeightAvg: 0.9,
    inScope: true,
    priority: 10,
    conceptNotes: `**Core:** multiplying or dividing an inequality by a negative flips it. Never multiply by a variable of unknown sign — this is the number one error here.

- **Wavy curve:** factorise, mark roots on the line, sign alternates from the rightmost positive interval, and does *not* alternate at an even-power root.
- **|x - a| < b** means a - b < x < a + b (distance reading). **|x - a| > b** splits into two rays.
- For modulus equations, break at every point where an expression inside bars changes sign, and solve on each interval — then check each solution lies in its own interval.
- |a| + |b| >= |a + b|, with equality when a and b share a sign.

**Trap:** squaring both sides introduces extraneous roots. Always substitute back.`,
  },
  {
    section: 'QA',
    area: 'Algebra',
    name: 'Functions & Graphs',
    slug: 'functions',
    catWeightAvg: 1.0,
    inScope: true,
    priority: 11,
    conceptNotes: `**Core:** f(g(x)) means apply g first. Composition is not commutative.

- **Transformations:** f(x)+a shifts up, f(x+a) shifts **left**, -f(x) reflects in the x-axis, f(-x) in the y-axis, |f(x)| folds the part below the axis upward.
- **Even** f(-x)=f(x), symmetric about the y-axis. **Odd** f(-x)=-f(x), symmetric about the origin.
- **Inverse** exists only if f is one-to-one; swap x and y and solve. The graph reflects in y = x.
- If f(x+a) = f(x) the function is periodic with period a — CAT loves chained substitution to expose a period.

**Trap:** domain restrictions. Under a square root the argument must be >= 0; inside a log it must be > 0; a denominator must be non-zero.`,
  },
  {
    section: 'QA',
    area: 'Algebra',
    name: 'Logarithms & Exponents',
    slug: 'logarithms',
    catWeightAvg: 0.9,
    inScope: true,
    priority: 12,
    conceptNotes: `**Core:** log_a(b) = c means a^c = b. Every log question is an index question in disguise — if you are stuck, rewrite it as a power.

- log(mn) = log m + log n; log(m/n) = log m - log n; log(m^p) = p log m.
- **Base change:** log_a(b) = log(b)/log(a) = 1/log_b(a).
- log_a(b) x log_b(c) = log_a(c) — chains collapse.
- a^log_a(x) = x. Valid domain: base > 0, base != 1, argument > 0.
- **Direction flips for a fractional base:** for 0 < a < 1, log_a is decreasing, so inequalities reverse.

**Trap:** forgetting that the argument must be positive. Solve, then discard roots that make any log undefined.`,
  },
  {
    section: 'QA',
    area: 'Algebra',
    name: 'Progressions & Series',
    slug: 'progressions',
    catWeightAvg: 1.1,
    inScope: true,
    priority: 13,
    conceptNotes: `**Core:** AP: t_n = a + (n-1)d, S_n = n/2 (2a + (n-1)d) = n x (average of first and last).

- **GP:** t_n = ar^(n-1), S_n = a(r^n - 1)/(r - 1). **Infinite GP** sums to a/(1-r), valid only when |r| < 1.
- **HP:** reciprocals form an AP. Never attack an HP directly — flip it.
- AM >= GM >= HM for positive numbers, equality only when all terms are equal.
- Sums worth knowing: 1..n = n(n+1)/2; squares = n(n+1)(2n+1)/6; cubes = [n(n+1)/2]^2.
- **Telescoping:** terms like 1/(n(n+1)) split into 1/n - 1/(n+1) and the middle cancels.

**Trap:** for a symmetric AP, centre your variables (a-d, a, a+d) — it kills the linear term and halves the work.`,
  },
  {
    section: 'QA',
    area: 'Algebra',
    name: 'Maxima & Minima',
    slug: 'maxima-minima',
    catWeightAvg: 0.5,
    inScope: true,
    priority: 14,
    conceptNotes: `**Core:** no calculus needed for CAT.

- **Quadratic:** vertex at x = -b/2a. Opens up (a>0) -> minimum there; opens down -> maximum.
- **AM-GM:** for positive numbers the sum is minimised when they are equal. x + k/x has minimum 2*sqrt(k) at x = sqrt(k).
- With a fixed **sum**, the product is maximised when terms are equal. With a fixed **product**, the sum is minimised when terms are equal.
- For modulus sums like |x-a| + |x-b| + |x-c|, the minimum is at the **median** of the points.

**Trap:** AM-GM requires positive terms. Check the domain before applying it.`,
  },
  {
    section: 'QA',
    area: 'Algebra',
    name: 'Polynomials (Remainder & Factor)',
    slug: 'polynomials',
    catWeightAvg: 0.4,
    inScope: true,
    priority: 15,
    conceptNotes: `**Core:** remainder of p(x) divided by (x - a) is p(a). If p(a) = 0 then (x - a) is a factor.

- A degree-n polynomial has n roots counted with multiplicity.
- **Vieta:** for ax^3+bx^2+cx+d, sum of roots = -b/a, sum of pairwise products = c/a, product = -d/a.
- Sum of coefficients = p(1). Alternating sum = p(-1). Constant term = p(0). These three shortcuts answer most CAT polynomial questions outright.

**Trap:** dividing by a quadratic leaves a remainder that is *linear* (ax+b), not a constant. Set up two equations.`,
  },

  /* ------------------ QA · deliberately out of scope ------------------ */
  { section: 'QA', area: 'Geometry', name: 'Geometry', slug: 'geometry', catWeightAvg: 2.0, inScope: false, priority: 90 },
  { section: 'QA', area: 'Geometry', name: 'Mensuration', slug: 'mensuration', catWeightAvg: 0.8, inScope: false, priority: 91 },
  { section: 'QA', area: 'Geometry', name: 'Coordinate Geometry', slug: 'coordinate-geometry', catWeightAvg: 0.4, inScope: false, priority: 92 },
  { section: 'QA', area: 'Number System', name: 'Number System', slug: 'number-system', catWeightAvg: 1.5, inScope: false, priority: 93 },
  { section: 'QA', area: 'Modern Math', name: 'Permutations & Combinations', slug: 'pnc', catWeightAvg: 0.8, inScope: false, priority: 94 },
  { section: 'QA', area: 'Modern Math', name: 'Probability', slug: 'probability', catWeightAvg: 0.5, inScope: false, priority: 95 },
  { section: 'QA', area: 'Modern Math', name: 'Set Theory', slug: 'set-theory', catWeightAvg: 0.3, inScope: false, priority: 96 },

  /* ------------------------------ DILR ------------------------------- */
  { section: 'DILR', area: 'LR', name: 'Arrangements & Puzzles', slug: 'lr-arrangements', catWeightAvg: 5, inScope: true, priority: 20 },
  { section: 'DILR', area: 'LR', name: 'Games & Tournaments', slug: 'lr-games', catWeightAvg: 4, inScope: true, priority: 21 },
  { section: 'DILR', area: 'LR', name: 'Venn Diagrams & Grouping', slug: 'lr-venn', catWeightAvg: 3, inScope: true, priority: 22 },
  { section: 'DILR', area: 'LR', name: 'Scheduling & Sequencing', slug: 'lr-scheduling', catWeightAvg: 3, inScope: true, priority: 23 },
  { section: 'DILR', area: 'DI', name: 'Tables & Caselets', slug: 'di-tables', catWeightAvg: 4, inScope: true, priority: 24 },
  { section: 'DILR', area: 'DI', name: 'Bar, Line & Pie Charts', slug: 'di-charts', catWeightAvg: 3, inScope: true, priority: 25 },
  { section: 'DILR', area: 'DI', name: 'Networks, Routes & Flows', slug: 'di-networks', catWeightAvg: 2, inScope: true, priority: 26 },
  { section: 'DILR', area: 'DI', name: 'Quant-based DI', slug: 'di-quant', catWeightAvg: 2, inScope: true, priority: 27 },

  /* ------------------------------ VARC ------------------------------- */
  { section: 'VARC', area: 'RC', name: 'Reading Comprehension', slug: 'rc', catWeightAvg: 16, inScope: true, priority: 30 },
  { section: 'VARC', area: 'VA', name: 'Para Jumbles', slug: 'va-jumbles', catWeightAvg: 3, inScope: true, priority: 31 },
  { section: 'VARC', area: 'VA', name: 'Para Summary', slug: 'va-summary', catWeightAvg: 3, inScope: true, priority: 32 },
  { section: 'VARC', area: 'VA', name: 'Odd One Out', slug: 'va-odd', catWeightAvg: 2, inScope: true, priority: 33 },
];

export const IN_SCOPE_QA_SLUGS = TOPICS.filter(
  (t) => t.section === 'QA' && t.inScope,
).map((t) => t.slug);
