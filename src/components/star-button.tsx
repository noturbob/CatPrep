"use client";

import { useEffect, useState } from "react";

const REPO = "noturbob/CatPrep";

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : String(n));

/** Links to the repo with its live star count. Without the count (offline, rate-limited) it still works as a link. */
export function StarButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.github.com/repos/${REPO}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => typeof d?.stargazers_count === "number" && setStars(d.stargazers_count))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Star catprep on GitHub${stars !== null ? `, ${stars} stars` : ""}`}
      className="flex h-9 items-center rounded-sm border-2 border-line bg-card text-caption font-semibold transition-colors hover:bg-canary hover:text-charcoal"
    >
      <span className="flex h-full items-center gap-1.5 px-2.5">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden fill="currentColor">
          <path d="M8 .9l2.2 4.5 4.9.7-3.6 3.5.9 4.9L8 12.2l-4.4 2.3.9-4.9L.9 6.1l4.9-.7z" />
        </svg>
        <span className="max-sm:hidden">Star</span>
      </span>
      {stars !== null && <span className="flex h-full items-center border-l-2 border-line px-2.5">{compact(stars)}</span>}
    </a>
  );
}
