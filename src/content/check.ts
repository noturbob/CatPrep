// Run with `pnpm test`. Guards the plan's date maths and the transcribed content's shape.
import assert from "node:assert/strict";
import { chapters } from "./qa.ts";
import { days, istDate, mocks, today, EXAM, START, daysBetween } from "./plan.ts";

// Every study day from start to the day before the exam maps to exactly one block.
for (let d = START; d < EXAM; d = istDate(new Date(Date.parse(d + "T00:00:00+05:30") + 86_400_000))) {
  assert.equal(days.filter((b) => b.from <= d && d <= b.to).length, 1, `day ${d}`);
}
assert.equal(daysBetween(START, EXAM), 55);

const t = today("2026-10-06");
assert.ok(t.kind === "study" && t.day === 2 && t.daysLeft === 54 && t.mock === null);
const m = today("2026-11-26");
assert.ok(m.kind === "study" && m.mock === 12);
assert.equal(mocks.length, 12);
assert.equal(today("2026-10-01").kind, "before");
assert.equal(today(EXAM).kind, "exam");

// 23:30 UTC on 5 Oct is already 6 Oct in IST.
assert.equal(istDate(new Date("2026-10-05T23:30:00Z")), "2026-10-06");

// Chapters 5–16, in order, each with the parts every chapter page renders.
assert.deepEqual(chapters.map((c) => c.n), [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
for (const c of chapters) {
  assert.ok(c.examples.length >= 6 && c.practice.length >= 6, c.slug);
  for (const p of c.practice) assert.ok(p.q && p.a, c.slug);
}

// VARC and DILR weekly focus cover every study day exactly once, and deadlines are in date order.
import { varcFocus, dilrFocus, deadlines } from "./plan.ts";
for (let d = START; d < EXAM; d = istDate(new Date(Date.parse(d + "T00:00:00+05:30") + 86_400_000))) {
  for (const list of [varcFocus, dilrFocus]) assert.equal(list.filter((f) => f.from <= d && d <= f.to).length, 1, `focus ${d}`);
}
assert.deepEqual(deadlines.map((x) => x.date), [...deadlines.map((x) => x.date)].sort());

// Percentile lookup interpolates inside a curve and refuses to extrapolate outside it.
import { curves, percentileFor } from "./admissions.ts";
const varc24 = curves[0].y2024;
assert.deepEqual(percentileFor(varc24, 30), { kind: "at", p: 95 });
assert.equal(percentileFor(varc24, 27).kind === "at" && Math.round((percentileFor(varc24, 27) as { p: number }).p * 10) / 10, 92.5);
assert.equal(percentileFor(varc24, 10).kind, "below");
assert.equal(percentileFor(varc24, 60).kind, "above");
for (const c of curves) for (const y of [c.y2024, c.y2025]) for (let i = 1; i < y.length; i++) assert.ok(y[i][0] > y[i - 1][0] && y[i][1] > y[i - 1][1], c.name);

// The DI charts are drawn from data; the guide's printed answers must follow from that data.
import { barData, scatterData, dilrChapters } from "./dilr.ts";
assert.equal(barData.reduce((s, d) => s + d.p25, 0), 108);
assert.equal(barData.reduce((s, d) => s + d.r24, 0), 610);
assert.equal(barData.reduce((s, d) => s + d.r25, 0), 685);
assert.equal(scatterData.reduce((s, d) => s + d[1], 0), 316);
assert.equal(scatterData.filter(([, a, b]) => b > a).length, 6);
assert.deepEqual(dilrChapters.flatMap((c) => c.items).filter((i) => "n" in i).map((i) => (i as { n: number }).n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

import { passages, vaPractice } from "./varc.ts";
assert.equal(passages.length, 4);
for (const p of passages) for (const q of p.questions) assert.ok(q.options.length === 4 && "abcd".includes(q.answer), p.slug);
assert.equal(vaPractice.length, 13);

console.log("ok");
