import Link from "next/link";
import { chapters } from "@/content/qa";

// The rainbow-outline palette, handed out in order like pencils from a cup.
const PENCILS = ["#f38e84", "#f5b161", "#38c1b0", "#b291de", "#b3c419", "#7597ee", "#84a6bc", "#e1c427"];

export function ChapterGrid() {
  let i = 0;
  return (
    <div className="space-y-12">
      {(["Arithmetic", "Algebra"] as const).map((group) => (
        <div key={group}>
          <h3 className="mb-5 text-sub font-semibold">
            {group === "Arithmetic" ? "Arithmetic, about 9 questions a paper" : "Easy algebra, about 6–7 questions a paper"}
          </h3>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chapters
              .filter((c) => c.group === group)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/qa/${c.slug}`}
                    style={{ borderColor: PENCILS[i++ % PENCILS.length] }}
                    className="btn flex h-full flex-col items-start bg-card px-5 py-4 text-ink"
                  >
                    <span className="text-caption text-muted">Section {c.n}</span>
                    <span className="text-body-lg font-semibold">{c.title}</span>
                    <span className="mt-auto pt-3 text-caption text-muted">
                      {c.examples.length} worked examples, {c.practice.length} practice questions
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
