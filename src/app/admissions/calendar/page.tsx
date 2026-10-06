import type { Metadata } from "next";
import { Bullets, DataTable, PageHeader, Part } from "@/components/ui";
import { afterCat, doThisMonth, exams, sources } from "@/content/admissions";

export const metadata: Metadata = { title: "Admissions: other exams and dates" };

export default function CalendarPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="Admissions guide, section 7" title="Other exams and the 2026–27 calendar">
        Register for at least one backup exam now: XAT, SNAP and NMAT registrations close between late November and
        mid-December, and several non-IIM applications close before CAT results arrive.
      </PageHeader>

      <Part title="Do this month">
        <ul className="max-w-[76ch] space-y-3">
          {doThisMonth.map((d) => (
            <li key={d} className="rounded-sm border-2 border-line bg-card px-4 py-3">{d}</li>
          ))}
        </ul>
      </Part>

      <Part title="Exams and the schools they open">
        <DataTable head={["Exam", "Main schools it opens", "2026–27 window", "Notes"]} rows={exams} firstBold />
        <p className="mt-4 max-w-[76ch] text-caption text-muted">
          CAT, XAT, SNAP, NMAT and IBSAT dates from Careers360. The other timings are typical patterns from past years, so
          confirm them on each official site.
        </p>
      </Part>

      <Part title="What usually happens after CAT">
        <ol className="max-w-[76ch] divide-y divide-faint rounded-sm border-2 border-line bg-card">
          {afterCat.map(([when, what], i) => (
            <li key={when} className="grid gap-1 px-4 py-3 sm:grid-cols-[220px_1fr]">
              <span className="font-semibold">{i + 1}. {when}</span>
              <span>{what}</span>
            </li>
          ))}
        </ol>
      </Part>

      <Part title="Sources">
        <p className="mb-4 max-w-[76ch]">
          All figures are as of 6 October 2026. Cutoffs, fees and packages change every year, and coaching-site figures
          are estimates or compilations, so confirm on each institute’s official admission page before you apply.
        </p>
        <div className="max-w-[76ch] text-muted"><Bullets items={sources} /></div>
      </Part>
    </main>
  );
}
