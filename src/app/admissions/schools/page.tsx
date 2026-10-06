import type { Metadata } from "next";
import { SchoolTable } from "@/components/school-table";
import { DataTable, PageHeader, Part } from "@/components/ui";
import { fees, seats, tracks, unranked } from "@/content/admissions";

export const metadata: Metadata = { title: "Admissions: schools" };

export default function SchoolsPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="Admissions guide, sections 5–6" title="The top 50, what they cost, and where they lead">
        NIRF 2025 is still the latest official ranking: the 2026 list had not been published as of 6 October 2026. Of its
        top 50, 37 accept CAT, 29 of them as their main route; XLRI, SIBM, NMIMS and IBS rely on other exams (XAT, SNAP,
        NMAT, IBSAT).
      </PageHeader>

      <Part title="NIRF 2025 top 50, with the main exam and expected general-category call range">
        <SchoolTable />
        <p className="mt-4 text-caption text-muted">
          Ranks from the NIRF 2025 management list as reported by iQuanta; call ranges from Cracku. A dash means no
          published estimate or a non-CAT exam.
        </p>
      </Part>

      <Part title="Top schools NIRF does not rank (they do not take part)">
        <DataTable head={["School", "Exam and call range"]} rows={unranked} firstBold />
      </Part>

      <Part title="Fees and packages for the 16 schools with comparable data">
        <DataTable
          head={["Institute", "Exam", "Total fees (₹ lakh)", "Average package (₹ LPA)", "Median package (₹ LPA)", "Average package ÷ fees"]}
          rows={fees.map(([n, e, f, a, m]) => [n, e, f.toFixed(2), a.toFixed(2), m === null ? "—" : m.toFixed(2), `${(a / f).toFixed(1)}×`])}
          highlight={(i) => fees[i][0].startsWith("FMS") || fees[i][0].startsWith("JBIMS")}
          firstBold
          caption="Sorted by average package. The last column is first-year average package divided by total fees, a rough return-on-investment check."
        />
        <p className="mt-4 max-w-[76ch]">
          FMS Delhi and JBIMS stand out because their fees are a fraction of the others’. Source: Cracku, Top 10 MBA
          colleges in India 2026, from the latest placement reports.
        </p>
      </Part>

      <Part title="Seats in leading non-IIM programmes">
        <p className="max-w-[76ch]">{seats}</p>
      </Part>

      <Part id="tracks" title="Best programmes by career track">
        <p className="mb-6 max-w-[70ch]">
          Your career goal should shape the shortlist as much as rank does. Several programmes outside the IIM top tier
          lead their niche: XLRI and TISS in HR, IRMA in rural management, IIFT in international business and IIM
          Ahmedabad’s FABM in agribusiness.
        </p>
        <DataTable head={["Career track", "Programmes to look at (exam)", "What to know"]} rows={tracks} firstBold />
        <p className="mt-4 max-w-[76ch] text-caption text-muted">
          This reflects each school’s established reputation rather than a single ranking. Before applying, open each
          programme’s latest final placement report and check which roles and recruiters actually hired.
        </p>
      </Part>
    </main>
  );
}
