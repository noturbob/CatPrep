import { Reveal } from "./reveal";

/** A lettered multiple-choice question with its answer behind a disclosure. */
export function Mcq({ n, q, options, answer }: { n: number | string; q: string; options?: string[]; answer: React.ReactNode }) {
  return (
    <li className="flex gap-4 rounded-sm border-2 border-line bg-card p-4">
      <span className="w-8 shrink-0 font-semibold">{n}</span>
      <div className="min-w-0 flex-1">
        <p>{q}</p>
        {options && (
          <ol className="mt-3 space-y-1.5">
            {options.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted">({"abcd"[i]})</span>
                <span>{o}</span>
              </li>
            ))}
          </ol>
        )}
        <Reveal label="answer">{answer}</Reveal>
      </div>
    </li>
  );
}
