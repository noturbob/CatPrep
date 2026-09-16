import { daysToCat } from '@/lib/plan';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next = '/' } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-[19rem]">
        <p className="readout text-[64px] text-fg">{daysToCat()}</p>
        <p className="mt-3 text-[13px] text-muted">
          days until CAT, Sunday 29 November
        </p>

        <form action="/api/auth/login" method="post" className="mt-9 space-y-3">
          <input type="hidden" name="next" value={next} />
          <input
            type="password"
            name="password"
            autoFocus
            required
            placeholder="Password"
            aria-label="Password"
            aria-invalid={error ? true : undefined}
            className="w-full rounded-[2px] border border-border bg-panel px-3 py-2 text-[13px] text-fg placeholder:text-faint focus:border-border-hi focus:outline-none"
          />
          {error && (
            <p role="alert" className="settle text-[12px] text-bad">
              That password does not match. Try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-[2px] bg-accent px-3 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
          >
            Start working
          </button>
        </form>
      </div>
    </main>
  );
}
