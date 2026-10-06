import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { dilrChapters, type DSet } from "@/content/dilr";

export const metadata: Metadata = { title: "DILR: worked sets" };

const PENCILS = ["#f38e84", "#f5b161", "#38c1b0", "#b291de", "#b3c419", "#7597ee", "#84a6bc"];

export default function SetsIndex() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="DILR guide, sections 5–11" title="Fourteen worked sets">
        One for every set type, each followed by a practice set with answers. Attempt each set first, timed at 15
        minutes, then open the solution.
      </PageHeader>
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dilrChapters.map((c, i) => {
          const sets = c.items.filter((x): x is DSet => "n" in x);
          return (
            <li key={c.slug}>
              <Link href={`/dilr/sets/${c.slug}`} style={{ borderColor: PENCILS[i] }} className="btn flex h-full flex-col items-start bg-card px-5 py-4 text-ink">
                <span className="text-caption text-muted">Section {c.n}</span>
                <span className="text-body-lg font-semibold">{c.title}</span>
                <span className="mt-auto pt-3 text-caption text-muted">
                  {sets.map((s) => `Set ${s.n}: ${s.title.toLowerCase()} (${s.level})`).join("; ")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
