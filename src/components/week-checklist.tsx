"use client";

import { useStored } from "@/lib/stored";
import { weeks } from "@/content/plan";

/** The guide's week-by-week checklist. Ticks are saved in this browser only. */
export function WeekChecklist() {
  const [done, setDone] = useStored<Record<string, boolean>>("plan-checks", {});

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {weeks.map((w) => {
        const count = w.items.filter((it) => done[it]).length;
        return (
          <fieldset key={w.title} className="rounded-sm border-2 border-line bg-card p-5">
            <legend className="sr-only">{w.title}</legend>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold">
                {w.title} <span className="font-normal text-muted">({w.dates})</span>
              </h3>
              <span className="text-caption text-muted">{count}/{w.items.length}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {w.items.map((it) => (
                <li key={it}>
                  <label className="flex cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={!!done[it]}
                      onChange={(e) => setDone({ ...done, [it]: e.target.checked })}
                      className="mt-1 size-4 shrink-0 accent-[#6fc2ff]"
                    />
                    <span className={done[it] ? "text-muted line-through" : ""}>{it}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        );
      })}
    </div>
  );
}
