import type { Metadata } from "next";
import { ErrorLog } from "@/components/error-log";
import { qaLog } from "@/content/logs";

export const metadata: Metadata = { title: "QA error log" };

const sources = [
  ["Cracku CAT Questions hub", "One page per QA topic, sorted by year, with solutions, video solutions and a free PDF. The Time, Speed & Distance page covers CAT 2017–2025 plus the 1990–2008 papers and lists 99+ questions.", "https://cracku.in"],
  ["Cracku CAT previous papers", "Full slot-wise papers. Use their QA sections as timed 40-minute tests in the last three weeks.", "https://cracku.in"],
  ["Cracku: 100+ most important CAT arithmetic questions", "A curated set if time runs short.", "https://cracku.in"],
  ["Careers360 CAT Quant PYQs 2021–2025 question bank (PDF)", "All 330 recent QA questions in one file.", "https://www.careers360.com"],
  ["McGraw Hill: Chapter-wise Solved Previous Years’ Papers for CAT", "A paid book with 2001–2008 and 2017–2025 questions sorted by chapter, if you prefer paper.", null],
] as const;

export default function ErrorLogPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <p className="text-caption text-muted">Section 17</p>
      <h1 className="mt-2 text-h1 font-light">Real CAT questions and your error log</h1>
      <p className="mt-4 max-w-[66ch] text-sub">
        Use Cracku’s free topic-wise pages for the actual CAT 2017–2025 questions, add the older 1990–2008 papers for
        volume, and log every miss in one line. That is how you reach roughly 100 questions per major chapter.
      </p>

      <section className="mt-14">
        <h2 className="mb-6 text-h3 font-normal">Your error log</h2>
        <ErrorLog config={qaLog} />
        <ul className="mt-8 max-w-[70ch] space-y-2 text-muted">
          <li>Redo every logged question 3 days later and again 10 days later, without looking at the solution.</li>
          <li>Every Sunday, count misses by chapter and pattern. The top two get extra practice the next week.</li>
          <li>In the last five days, read only the “Fix in one line” column.</li>
        </ul>
      </section>

      <section id="sources" className="mt-20 scroll-mt-6">
        <h2 className="text-h3 font-normal">The real questions, sorted by topic</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {sources.map(([name, what, href]) => (
            <li key={name} className="rounded-sm border-2 border-line bg-card p-5">
              <p className="font-semibold">
                {href ? <a href={href} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4 hover:bg-wash">{name}</a> : name}
              </p>
              <p className="mt-2">{what}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 max-w-[70ch] rounded-sm border-2 border-line bg-card p-6">
          <h3 className="font-semibold">Solve in this order, within each chapter</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>The 1990–2008 questions first: easier, good for building the method.</li>
            <li>Then 2017–2020.</li>
            <li>Then 2021–2025 under a 3-minute timer, since those are closest to what you will face.</li>
          </ol>
          <p className="mt-4 text-muted">
            Take the official mock on{" "}
            <a href="https://iimcat.ac.in" target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4">iimcat.ac.in</a>{" "}
            once it is released, to learn the interface, the calculator and the TITA box.
          </p>
        </div>
      </section>
    </main>
  );
}
