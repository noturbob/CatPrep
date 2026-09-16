import { daysToCat } from '@/lib/plan';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next = '/' } = await searchParams;
  const left = daysToCat();

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-[320px]">
        <div className="mb-8">
          <h1 className="text-[15px] font-semibold tracking-tight">catprep</h1>
          <p className="mt-1 text-[13px] text-muted">
            <span className="nums text-accent">{left}</span> days to CAT 2026
          </p>
        </div>

        <form action="/api/auth/login" method="post" className="space-y-3">
          <input type="hidden" name="next" value={next} />
          <input
            type="password"
            name="password"
            autoFocus
            required
            placeholder="password"
            aria-label="Password"
            className="w-full rounded-[4px] border border-border bg-panel px-3 py-2 text-[13px] text-fg placeholder:text-faint focus:border-border-hi focus:outline-none"
          />
          {error && (
            <p role="alert" className="text-[12px] text-bad">
              Wrong password.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-[4px] bg-accent px-3 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
