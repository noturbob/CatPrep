"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const SECTIONS = [
  { href: "/", label: "Today" },
  { href: "/plan", label: "Plan" },
  {
    href: "/qa", label: "QA", pages: [
      { href: "/qa", label: "Overview" },
      { href: "/qa/strategy", label: "Exam day" },
      { href: "/qa/toolkit", label: "Toolkit" },
      { href: "/qa/chapters", label: "Chapters" },
      { href: "/qa/error-log", label: "Error log" },
    ],
  },
  {
    href: "/varc", label: "VARC", pages: [
      { href: "/varc", label: "Overview" },
      { href: "/varc/reading", label: "Reading" },
      { href: "/varc/verbal", label: "Verbal ability" },
      { href: "/varc/practice", label: "Practice & error log" },
    ],
  },
  {
    href: "/dilr", label: "DILR", pages: [
      { href: "/dilr", label: "Overview" },
      { href: "/dilr/method", label: "Method & set types" },
      { href: "/dilr/sets", label: "Worked sets" },
      { href: "/dilr/practice", label: "Practice & error log" },
    ],
  },
  {
    href: "/admissions", label: "Admissions", pages: [
      { href: "/admissions", label: "Percentiles" },
      { href: "/admissions/cutoffs", label: "Weightage & cutoffs" },
      { href: "/admissions/schools", label: "Schools" },
      { href: "/admissions/calendar", label: "Other exams" },
    ],
  },
];

// Pages under /qa that aren't listed above are chapters.
const inSection = (path: string, href: string) => href === "/" ? path === "/" : path === href || path.startsWith(href + "/");

export function Nav() {
  const path = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const section = SECTIONS.find((s) => s.pages && inSection(path, s.href));
  const pageActive = (href: string) => {
    if (path === href) return true;
    if (href === "/qa/chapters") return path.startsWith("/qa/") && !section!.pages!.some((p) => p.href !== href && path === p.href);
    if (href === "/dilr/sets") return path.startsWith("/dilr/sets/");
    return false;
  };

  return (
    <header className="border-b border-line bg-card">
      <nav aria-label="Sections" className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-body-lg font-semibold">
          <span aria-hidden className="grid size-6 place-items-center rounded-sm border-2 border-charcoal bg-canary text-[11px] font-semibold text-charcoal">
            95
          </span>
          catprep
        </Link>
        <ul className="flex flex-1 gap-1 text-caption font-medium uppercase max-md:hidden">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                aria-current={inSection(path, s.href) ? "page" : undefined}
                className="block whitespace-nowrap rounded-sm px-2.5 py-1.5 hover:bg-wash aria-[current=page]:bg-sky aria-[current=page]:text-charcoal"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpenOn(open ? null : path)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex h-9 items-center gap-2 rounded-sm border-2 border-line bg-card px-3 text-caption font-semibold uppercase md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" />
              ) : (
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <nav id="site-menu" aria-label="All pages" className="border-t-2 border-line md:hidden">
          <ul className="mx-auto max-w-[1200px] divide-y divide-faint px-4 pb-3">
            {SECTIONS.map((s) => (
              <li key={s.href} className="py-3">
                <Link
                  href={s.href}
                  aria-current={inSection(path, s.href) ? "page" : undefined}
                  className="inline-block rounded-sm px-2 py-1 text-body-lg font-semibold aria-[current=page]:bg-sky aria-[current=page]:text-charcoal"
                >
                  {s.label}
                </Link>
                {s.pages && (
                  <ul className="mt-1 grid grid-cols-2 gap-1 pl-2">
                    {s.pages.map((p) => (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          aria-current={path === p.href ? "page" : undefined}
                          className="block rounded-sm px-2 py-1.5 text-muted hover:bg-wash aria-[current=page]:font-semibold aria-[current=page]:text-ink"
                        >
                          {p.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      {section && (
        <nav aria-label={`${section.label} pages`} className="border-t border-faint">
          <ul className="mx-auto flex max-w-[1200px] flex-wrap gap-1 px-4 py-2 text-caption sm:px-6">
            {section.pages!.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={pageActive(p.href) ? "page" : undefined}
                  className="block whitespace-nowrap rounded-sm border-2 border-transparent px-2.5 py-1 hover:bg-wash aria-[current=page]:border-line aria-[current=page]:font-semibold"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
