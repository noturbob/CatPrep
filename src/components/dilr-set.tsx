import type { Block, DSet, Practice, Table } from "@/content/dilr";
import { BarChart, ScatterPlot } from "./di-charts";
import { Reveal } from "./reveal";
import { Bullets, DataTable } from "./ui";

function SimpleTable({ t }: { t: Table }) {
  return <DataTable head={t.head} rows={t.rows.map((r) => r.map(String))} firstBold />;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) =>
        typeof b === "string" ? <p key={i}>{b}</p> : "list" in b ? <Bullets key={i} items={b.list} /> : <SimpleTable key={i} t={b.table} />,
      )}
    </div>
  );
}

function Body({ s }: { s: DSet | Practice }) {
  return (
    <>
      {s.setup.map((p) => <p key={p}>{p}</p>)}
      {s.data && <div className="mt-4"><SimpleTable t={s.data} /></div>}
      {"chart" in s && s.chart === "bar" && <div className="mt-4"><BarChart /></div>}
      {"chart" in s && s.chart === "scatter" && <div className="mt-4"><ScatterPlot /></div>}
      {s.clues && (
        <ol className="mt-4 space-y-2">
          {s.clues.map((c, i) => (
            <li key={c} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-sm border-2 border-line text-caption font-semibold">{i + 1}</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      )}
      <h4 className="mt-6 font-semibold">Questions</h4>
      <ol className="mt-2 list-decimal space-y-2 pl-6">
        {s.questions.map((q) => <li key={q}>{q}</li>)}
      </ol>
    </>
  );
}

export function WorkedSet({ s }: { s: DSet }) {
  return (
    <article id={`set-${s.n}`} className="lift scroll-mt-6 rounded-sm border-2 border-line bg-card p-6">
      <p className="text-caption text-muted">Worked set {s.n}, {s.level}. Attempt it in 15 minutes first.</p>
      <h3 className="mt-1 text-h3 font-normal">{s.title}</h3>
      <div className="mt-4"><Body s={s} /></div>
      <Reveal label="solution">
        <Blocks blocks={s.solution} />
        <p className="mt-4"><strong className="font-semibold">Answers.</strong> {s.answers}</p>
      </Reveal>
      {s.takeaway && (
        <p className="mt-6 rounded-sm border-2 border-charcoal bg-canary p-4 text-charcoal">
          <span className="font-semibold">Takeaway. </span>{s.takeaway}
        </p>
      )}
    </article>
  );
}

export function PracticeSet({ s }: { s: Practice }) {
  return (
    <article className="rounded-sm border-2 border-dashed border-line bg-chalk p-6">
      <p className="text-caption text-muted">{s.minutes} minutes, timed</p>
      <h3 className="mt-1 font-semibold">{s.title}</h3>
      <div className="mt-4"><Body s={s} /></div>
      <Reveal label="answers"><p>{s.answers}</p></Reveal>
      {s.takeaway && <p className="mt-4"><span className="font-semibold">Takeaway. </span>{s.takeaway}</p>}
    </article>
  );
}

export function Mini({ title, body }: { title: string; body: string[] }) {
  return (
    <article className="rounded-sm border-2 border-line bg-card p-6">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 space-y-3">{body.map((p) => <p key={p}>{p}</p>)}</div>
    </article>
  );
}
