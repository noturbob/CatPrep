'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Today' },
  { href: '/practice', label: 'Practice' },
  { href: '/drill', label: 'Drill' },
  { href: '/bank', label: 'Bank' },
  { href: '/mock', label: 'Mocks' },
  { href: '/tracker', label: 'Progress' },
  { href: '/errors', label: 'Mistakes' },
  { href: '/mail', label: 'Inbox' },
];

export function Nav({ daysLeft }: { daysLeft: number }) {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-5 overflow-x-auto px-5 py-3">
        <Link href="/" className="shrink-0 text-[13px] font-medium tracking-tight text-fg">
          CatPrep
        </Link>
        <ul className="flex items-center gap-4">
          {LINKS.map((l) => {
            const active = l.href === '/' ? path === '/' : path.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block shrink-0 border-b py-0.5 text-[13px] transition-colors',
                    active
                      ? 'border-accent text-fg'
                      : 'border-transparent text-faint hover:text-muted',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <span className="nums ml-auto shrink-0 text-[12px] text-faint">
          {daysLeft}d
        </span>
      </div>
    </nav>
  );
}
