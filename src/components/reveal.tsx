import type { ReactNode } from "react";

/** Native disclosure: attempt first, open to compare. Opens slowly where ::details-content is supported. */
export function Reveal({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="reveal group mt-4">
      <summary className="inline-flex items-center gap-2 rounded-sm border-2 border-line bg-chalk px-3 py-1.5 text-caption font-medium hover:bg-wash">
        <svg className="chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="group-open:hidden">Show {label}</span>
        <span className="hidden group-open:inline">Hide {label}</span>
      </summary>
      <div className="mt-3 border-l-4 border-sky pl-4">{children}</div>
    </details>
  );
}

/** Bolds the closing "Answer: …" of a solution so it can be checked at a glance. */
export function Solution({ text }: { text: string }) {
  const i = text.lastIndexOf("Answer:");
  if (i < 0) return <p>{text}</p>;
  return (
    <p>
      {text.slice(0, i)}
      <strong className="font-semibold">{text.slice(i)}</strong>
    </p>
  );
}
