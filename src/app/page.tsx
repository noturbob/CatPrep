import Link from "next/link";
import { Deadlines } from "@/components/deadlines";
import { Marquee } from "@/components/marquee";
import { Strip, cells } from "@/components/strip";
import { TodayCard } from "@/components/today-card";

const SKY = "var(--color-sky)";
const CORAL = "var(--color-coral)";

const sections = [
  {
    name: "VARC", href: "/varc", target: "12 correct of 24, at most 4 wrong MCQs", marks: "32",
    cells: cells([12, SKY], [4, CORAL], [8, "transparent"]),
    line: "Three passages carefully, all eight verbal-ability questions, the hardest passage left alone.",
  },
  {
    name: "DILR", href: "/dilr", target: "2.5 sets: about 11 attempts, 9 correct", marks: "25–27",
    cells: cells([9, SKY], [2, CORAL], [11, "transparent"]),
    line: "Five minutes choosing, then the two easy sets and the first questions of the medium one.",
  },
  {
    name: "QA", href: "/qa", target: "9 correct of 22, one or two wrong", marks: "about 25",
    cells: cells([9, SKY], [1, CORAL], [12, "transparent"]),
    line: "Arithmetic and easy algebra only, in two rounds, never more than 3 minutes on one question.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-[1200px] gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:pt-20">
        <div>
          <h1 className="text-[clamp(30px,9vw,56px)] font-light uppercase leading-none tracking-[0.02em]">
            <span className="blur-in block">95th in every</span>
            <span className="blur-in block [animation-delay:250ms]">section.</span>
          </h1>
          <p className="blur-in mt-8 max-w-[60ch] text-sub [animation-delay:500ms]">
            The 95th percentile in VARC, DILR and QA adds up to about 78–80 marks, which landed near the 97th–98th
            percentile overall. That puts the newer IIMs, MDI, the IIT B-schools and many strong non-IIMs in range.
          </p>

          <ul className="mt-12 space-y-8">
            {sections.map((s) => (
              <li key={s.name}>
                <Link href={s.href} className="group block">
                  <p className="mb-2 flex flex-wrap items-baseline gap-x-3">
                    <span className="text-sub font-semibold group-hover:underline">{s.name}</span>
                    <span className="text-muted">{s.target}</span>
                    <span className="ml-auto font-semibold">{s.marks} marks</span>
                  </p>
                  <Strip label={`${s.name}: ${s.target}`} cells={s.cells} />
                  <p className="mt-2 text-caption text-muted">{s.line}</p>
                </Link>
              </li>
            ))}
          </ul>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-caption">
            <Legend fill={SKY} term="correct, +3" />
            <Legend fill={CORAL} term="wrong MCQ, −1" />
            <Legend fill="transparent" term="skipped or wrong TITA, 0" />
          </dl>
        </div>
        <div className="space-y-10 lg:pt-2">
          <TodayCard />
          <Deadlines />
        </div>
      </section>

      <Marquee items={["VARC 12 correct", "DILR 2.5 sets", "QA 9 correct", "Overall 97th–98th", "Exam 29 November"]} />

      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="text-h2 font-normal">The four guides</h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["VARC", "/varc", "Read for the argument, four VA techniques, four passages and a 13-question VA set.", "#f38e84"],
            ["DILR", "/dilr", "The 5-minute scan, one method for every set, and 14 worked sets with practice.", "#38c1b0"],
            ["QA", "/qa", "Twelve chapters of arithmetic and easy algebra, the toolkit and exam-day rules.", "#7597ee"],
            ["Admissions", "/admissions", "Score to percentile, IIM weightage and cutoffs, the top 50 schools, backup exams.", "#e1c427"],
          ].map(([name, href, body, color]) => (
            <li key={name}>
              <Link href={href} style={{ borderColor: color }} className="btn flex h-full flex-col items-start bg-card px-5 py-4 text-ink">
                <span className="text-body-lg font-semibold">{name}</span>
                <span className="text-muted">{body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Legend({ fill, term }: { fill: string; term: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="size-3 rounded-sm border-2 border-line" style={{ background: fill }} />
      <dt>{term}</dt>
    </div>
  );
}
