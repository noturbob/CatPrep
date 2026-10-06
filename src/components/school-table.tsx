"use client";

import { useState } from "react";
import { top50 } from "@/content/admissions";

/** The NIRF top 50 with a CAT-only filter, since most of the list is irrelevant without CAT. */
export function SchoolTable() {
  const [catOnly, setCatOnly] = useState(false);
  const rows = catOnly ? top50.filter(([, , exam]) => exam.includes("CAT")) : top50;
  return (
    <div>
      <label className="mb-4 inline-flex cursor-pointer items-center gap-3">
        <input type="checkbox" checked={catOnly} onChange={(e) => setCatOnly(e.target.checked)} className="size-4 accent-[#6fc2ff]" />
        Only schools that accept CAT ({top50.filter(([, , e]) => e.includes("CAT")).length})
      </label>
      <div className="rounded-sm border-2 border-line bg-card">
        <table className="stack w-full text-left">
          <thead className="border-b-2 border-line text-caption">
            <tr>{["Institute", "NIRF rank", "Main exam", "Expected general call (CAT %ile)"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(([rank, name, exam, call]) => (
              <tr key={name} className="border-b border-faint last:border-0">
                <td className="px-3 py-2 font-semibold">{name}</td>
                <td data-label="NIRF rank" className="px-3 py-2">{rank}</td>
                <td data-label="Main exam" className="px-3 py-2">{exam}</td>
                <td data-label="Expected call" className="px-3 py-2">{call}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
