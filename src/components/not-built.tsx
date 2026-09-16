import Link from 'next/link';

export function NotBuilt({
  title, blurb, bullets,
}: { title: string; blurb: string; bullets: string[] }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12">
      <h1 className="text-[19px] font-normal text-fg">{title}</h1>
      <p className="mt-3 max-w-[54ch] text-[13px] leading-relaxed text-muted">{blurb}</p>

      <ul className="mt-7 divide-y divide-border border-y border-border">
        {bullets.map((b) => (
          <li key={b} className="py-2.5 text-[12px] leading-relaxed text-faint">{b}</li>
        ))}
      </ul>

      <p className="mt-7 text-[13px] text-muted">
        <Link href="/practice" className="text-accent underline decoration-accent/40 underline-offset-2">
          Today&apos;s practice
        </Link>{' '}
        is ready now.
      </p>
    </main>
  );
}
