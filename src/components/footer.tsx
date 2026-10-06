import Link from "next/link";

const COLUMNS = [
  { title: "Plan", links: [["Today", "/"], ["55-day plan", "/plan"], ["Exam day (QA)", "/qa/strategy"]] },
  { title: "QA", links: [["Overview", "/qa"], ["Toolkit", "/qa/toolkit"], ["Chapters", "/qa/chapters"], ["Error log", "/qa/error-log"]] },
  { title: "VARC", links: [["Overview", "/varc"], ["Reading", "/varc/reading"], ["Verbal ability", "/varc/verbal"], ["Practice", "/varc/practice"]] },
  { title: "DILR", links: [["Overview", "/dilr"], ["Method", "/dilr/method"], ["Worked sets", "/dilr/sets"], ["Practice", "/dilr/practice"]] },
  { title: "Admissions", links: [["Percentiles", "/admissions"], ["Cutoffs", "/admissions/cutoffs"], ["Schools", "/admissions/schools"], ["Other exams", "/admissions/calendar"]] },
];

const REPO = "https://github.com/noturbob/CatPrep";

export function Footer() {
  return (
    <footer className="border-t-2 border-line bg-card">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h2 className="font-semibold">{c.title}</h2>
              <ul className="mt-3 space-y-2">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-muted hover:text-ink hover:underline">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-12 border-t border-faint pt-8 text-caption text-muted">
          <p>
            Data from Careers360, Cracku, IMS and iQuanta, as of 6 October 2026. Cutoffs and dates move every year, so
            confirm on each institute’s site before applying. Not affiliated with the IIMs or the CAT conducting body.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-caption">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span aria-hidden className="grid size-6 place-items-center rounded-sm border-2 border-charcoal bg-canary text-[11px] text-charcoal">95</span>
            catprep
          </Link>
          <p className="text-muted">
            © 2026 noturbob. Code released under the{" "}
            <a href={`${REPO}/blob/main/LICENSE`} className="underline underline-offset-4 hover:text-ink">MIT licence</a>.{" "}
            <a href={REPO} className="underline underline-offset-4 hover:text-ink">Source on GitHub</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
