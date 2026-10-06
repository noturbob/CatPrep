"use client";

import { useState, useSyncExternalStore } from "react";
import { useStored } from "@/lib/stored";
import { istDate } from "@/content/plan";

export type Field = {
  key: string;
  label: string;
  kind: "text" | "select" | "chips";
  options?: string[];
  hints?: Record<string, string>;
  placeholder?: string;
  optional?: boolean;
  wide?: boolean;
};

export type LogConfig = {
  storageKey: string;
  prompt: string;
  fields: Field[];
  /** The one-line takeaway column, read alone in the last five days. */
  lessonKey: string;
  /** Fields whose combined value is counted every Sunday. */
  tallyKeys: string[];
  tallyTitle: string;
  tallyNote: string;
  /** QA only: redo 3 and 10 days later. */
  redo?: boolean;
  examples: Record<string, string>[];
};

type Entry = Record<string, string> & { id: string; date: string; redone?: string };

const addDays = (d: string, n: number) => istDate(new Date(Date.parse(d + "T12:00:00+05:30") + n * 86_400_000));
const redoDates = (e: Entry) => [addDays(e.date, 3), addDays(e.date, 10)];
const short = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const noop = () => () => {};
const input = "w-full rounded-sm border-2 border-line bg-card px-3 py-2 focus:border-sky focus:outline-none";

/** One-line-per-miss log from the guides. Entries live in this browser's localStorage. */
export function ErrorLog({ config }: { config: LogConfig }) {
  const [entries, setEntries] = useStored<Entry[]>(config.storageKey, []);
  const today = useSyncExternalStore(noop, () => istDate(new Date()), () => null);
  const chipFields = config.fields.filter((f) => f.kind === "chips");
  const [chips, setChips] = useState<Record<string, string>>(
    Object.fromEntries(chipFields.map((f) => [f.key, f.options![0]])),
  );

  function add(form: FormData) {
    const entry: Entry = { id: crypto.randomUUID(), date: String(form.get("date") || today || istDate(new Date())) };
    for (const f of config.fields) entry[f.key] = f.kind === "chips" ? chips[f.key] : String(form.get(f.key) ?? "").trim();
    if (config.redo) entry.redone = "0";
    setEntries([entry, ...entries]);
  }

  const update = (id: string, patch: Partial<Entry>) =>
    setEntries(entries.map((e) => (e.id === id ? ({ ...e, ...patch } as Entry) : e)));

  const due = config.redo && today
    ? entries.filter((e) => +(e.redone ?? 0) < 2 && redoDates(e)[+(e.redone ?? 0)] <= today)
    : [];

  const tally = Object.entries(
    entries.reduce<Record<string, number>>((acc, e) => {
      const k = config.tallyKeys.map((t) => e[t]).filter(Boolean).join(", ");
      if (k) acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const columns = ["Date", ...config.fields.map((f) => f.label), ...(config.redo ? ["Redo on"] : []), ""];

  return (
    <div className="space-y-12">
      <form action={add} className="lift rounded-sm border-2 border-line bg-card p-6">
        <h3 className="font-semibold">{config.prompt}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1">
            <span className="text-caption text-muted">Date</span>
            <input name="date" type="date" defaultValue={today ?? undefined} key={today} className={input} />
          </label>
          {config.fields.filter((f) => f.kind !== "chips" && !f.wide).map((f) => (
            <FieldInput key={f.key} f={f} />
          ))}
        </div>
        {chipFields.map((f) => (
          <fieldset key={f.key} className="mt-5">
            <legend className="text-caption text-muted">{f.label}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {f.options!.map((o) => (
                <label key={o} className="cursor-pointer rounded-sm border-2 border-line px-3 py-1.5 has-checked:bg-sky has-checked:text-charcoal">
                  <input type="radio" name={f.key} value={o} checked={chips[f.key] === o} onChange={() => setChips({ ...chips, [f.key]: o })} className="sr-only" />
                  {o}
                </label>
              ))}
            </div>
            {f.hints?.[chips[f.key]] && <p className="mt-2 text-caption text-muted">{f.hints[chips[f.key]]}</p>}
          </fieldset>
        ))}
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {config.fields.filter((f) => f.wide).map((f) => <FieldInput key={f.key} f={f} />)}
        </div>
        <button className="btn btn-primary mt-6">Add to error log</button>
        <p className="mt-4 text-caption text-muted">
          Saved in this browser only.{config.redo && " Each entry gets two redo dates: 3 and 10 days later."}
        </p>
      </form>

      {due.length > 0 && (
        <section className="rounded-sm border-2 border-charcoal bg-canary p-6 text-charcoal">
          <h3 className="font-semibold">Redo today, without looking at the solution ({due.length})</h3>
          <ul className="mt-4 space-y-3">
            {due.map((e) => {
              const n = +(e.redone ?? 0);
              return (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 border-charcoal bg-white px-4 py-3">
                  <span>
                    <span className="font-semibold">{e.source}</span>
                    {config.tallyKeys.map((k) => e[k] && `, ${e[k]}`)}
                    <span className="ml-2 text-caption">redo {n + 1} of 2</span>
                  </span>
                  <button onClick={() => update(e.id, { redone: String(n + 1) })} className="rounded-sm border-2 border-charcoal bg-sky px-3 py-1 text-caption font-semibold">
                    Mark redo {n + 1} done
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <h3 className="font-semibold">Your log ({entries.length})</h3>
        <div className="mt-4 rounded-sm border-2 border-line bg-card">
          <table className="stack-lg w-full text-left">
            <thead className="border-b-2 border-line text-caption">
              <tr>{columns.map((h, i) => <th key={i} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {entries.length === 0 &&
                config.examples.map((e, i) => <Row key={i} e={{ id: `ex${i}`, ...e } as Entry} config={config} example />)}
              {entries.map((e) => (
                <Row key={e.id} e={e} config={config} onDelete={() => setEntries(entries.filter((x) => x.id !== e.id))} />
              ))}
            </tbody>
          </table>
        </div>
        {entries.length === 0 && (
          <p className="mt-3 text-caption text-muted">The greyed rows are the guide’s examples of a good entry. Add your first one above.</p>
        )}
      </section>

      {entries.length > 0 && (
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-semibold">{config.tallyTitle}</h3>
            <p className="mt-1 text-caption text-muted">{config.tallyNote}</p>
            <ol className="mt-4 space-y-2">
              {tally.slice(0, 6).map(([k, n], i) => (
                <li key={k} className={`flex justify-between rounded-sm border-2 border-line px-4 py-2 ${i === 0 ? "bg-wash" : "bg-card"}`}>
                  <span>{k}</span>
                  <span className="font-semibold">{n}</span>
                </li>
              ))}
            </ol>
          </div>
          <details className="reveal self-start rounded-sm border-2 border-line bg-card p-5">
            <summary className="flex items-center gap-2 font-semibold">
              <svg className="chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              Last five days: read only the “{config.fields.find((f) => f.key === config.lessonKey)?.label}” column
            </summary>
            <ul className="mt-4 space-y-2">
              {entries.map((e) => <li key={e.id}>{e[config.lessonKey]}</li>)}
            </ul>
          </details>
        </section>
      )}
    </div>
  );
}

function FieldInput({ f }: { f: Field }) {
  return (
    <label className="space-y-1">
      <span className="text-caption text-muted">{f.label}{f.optional && " (optional)"}</span>
      {f.kind === "select" ? (
        <select name={f.key} className={input}>
          {f.options!.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input name={f.key} required={!f.optional} placeholder={f.placeholder} className={input} />
      )}
    </label>
  );
}

function Row({ e, config, example, onDelete }: { e: Entry; config: LogConfig; example?: boolean; onDelete?: () => void }) {
  const n = +(e.redone ?? 0);
  return (
    <tr className={`border-b border-faint align-top last:border-0 ${example ? "text-muted" : ""}`}>
      <td className="whitespace-nowrap px-3 py-2">{short(e.date)}</td>
      {config.fields.map((f) => (
        <td key={f.key} data-label={f.label} className={`px-3 py-2 ${f.key === config.lessonKey ? "font-medium" : ""}`}>{e[f.key]}</td>
      ))}
      {config.redo && (
        <td data-label="Redo on" className="whitespace-nowrap px-3 py-2">
          <span>
            {redoDates(e).map((d, i) => (
              <span key={d}>
                {i > 0 && ", "}
                <span className={n > i ? "line-through" : ""}>{short(d)}</span>
              </span>
            ))}
          </span>
        </td>
      )}
      <td data-label="" className="px-3 py-2">
        {onDelete && (
          <button onClick={onDelete} aria-label="Delete entry" className="rounded-sm px-2 text-muted hover:bg-wash hover:text-ink">
            ✕
          </button>
        )}
      </td>
    </tr>
  );
}
