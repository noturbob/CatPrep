"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { daysBetween, deadlines, istDate } from "@/content/plan";

const noop = () => () => {};
const short = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Admission-season dates with days remaining; past ones drop off. */
export function Deadlines() {
  const today = useSyncExternalStore(noop, () => istDate(new Date()), () => null);
  const upcoming = deadlines.filter((d) => !today || d.date >= today);
  if (upcoming.length === 0) return null;

  return (
    <section aria-label="Upcoming dates" className="rounded-sm border-2 border-line bg-card">
      <h2 className="border-b-2 border-line px-5 py-3 font-semibold">Dates to keep</h2>
      <ul className="divide-y divide-faint">
        {upcoming.map((d) => (
          <li key={d.date} className={`flex items-baseline gap-4 px-5 py-2.5 ${d.what === "CAT 2026" ? "bg-wash font-semibold" : ""}`}>
            <span className="w-14 shrink-0 text-caption text-muted">{short(d.date)}</span>
            <span className="flex-1">{d.what}</span>
            {today && <span className="text-caption text-muted">{daysBetween(today, d.date)} d</span>}
          </li>
        ))}
      </ul>
      <p className="border-t-2 border-line px-5 py-3 text-caption text-muted">
        Register for one backup exam now. <Link href="/admissions/calendar" className="underline">Which ones, and why</Link>.
      </p>
    </section>
  );
}
