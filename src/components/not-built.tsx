import Link from 'next/link';

export function NotBuilt({
  title, blurb, bullets,
}: { title: string; blurb: string; bullets: string[] }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-[14px] font-semibold">{title}</h1>
      <p className="mt-2 text-[13px] text-muted">{blurb}</p>
      <ul className="mt-4 space-y-1.5 text-[12px] text-faint">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-border-hi">—</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[12px]">
        <Link href="/practice" className="text-accent underline underline-offset-2">
          Today&apos;s practice
        </Link>
        <span className="text-faint"> is ready now.</span>
      </p>
    </main>
  );
}
