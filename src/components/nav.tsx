'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/practice', label: 'Practice' },
  { href: '/drill', label: 'Drill' },
  { href: '/bank', label: 'Bank' },
  { href: '/mock', label: 'Mocks' },
  { href: '/tracker', label: 'Tracker' },
  { href: '/errors', label: 'Errors' },
  { href: '/mail', label: 'Inbox' },
];

export function Nav({ daysLeft }: { daysLeft: number }) {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2">
        <Link href="/" className="mr-2 shrink-0 text-[13px] font-semibold tracking-tight">
          catprep
        </Link>
        {LINKS.map((l) => {
          const active = l.href === '/' ? path === '/' : path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'shrink-0 rounded px-2.5 py-1 text-[12px] transition-colors',
                active ? 'bg-panel-2 text-fg' : 'text-muted hover:text-fg',
              )}
            >
              {l.label}
            </Link>
          );
        })}
        <span className="nums ml-auto shrink-0 pl-3 text-[12px] text-muted">
          <span className="text-accent">{daysLeft}</span>
          <span className="text-faint"> days left</span>
        </span>
      </div>
    </nav>
  );
}
