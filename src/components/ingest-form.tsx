'use client';

import { useState, useTransition } from 'react';
import { previewDump, stageDump } from '@/app/(app)/admin/ingest/actions';
import type { ParseResult } from '@/lib/ingest-parser';
import { cn } from '@/lib/utils';

const SAMPLE = `1. A train 180 m long crosses a platform 270 m long in 25 seconds. Speed in km/h?
(a) 54   (b) 64.8   (c) 72   (d) 80
Ans: b
Sol: Distance = 180 + 270 = 450 m in 25 s = 18 m/s = 64.8 km/h.

2. Find x if 2x + 6 = 20.
Ans: 7
Difficulty: easy
Sol: 2x = 14, so x = 7.`;

export function IngestForm({
  qaTopics, dilrTopics,
}: {
  qaTopics: { slug: string; name: string }[];
  dilrTopics: { slug: string; name: string }[];
}) {
  const [raw, setRaw] = useState('');
  const [label, setLabel] = useState('');
  const [source, setSource] = useState<'pyq' | 'imported'>('pyq');
  const [year, setYear] = useState('');
  const [slot, setSlot] = useState('');
  const [qaTopic, setQaTopic] = useState(qaTopics[0]?.slug ?? '');
  const [dilrTopic, setDilrTopic] = useState(dilrTopics[0]?.slug ?? '');
  const [preview, setPreview] = useState<ParseResult | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const doPreview = () => {
    setMsg(null);
    start(async () => setPreview(await previewDump(raw)));
  };

  const doImport = () => {
    start(async () => {
      const r = await stageDump({
        raw, label, qaTopicSlug: qaTopic, dilrTopicSlug: dilrTopic,
        source, year: year.trim() ? Number(year) : null, slot: slot.trim() || null,
      });
      if (!r.ok) { setMsg({ ok: false, text: r.error }); return; }
      setMsg({
        ok: true,
        text: `Staged ${r.staged} question${r.staged === 1 ? '' : 's'}`
          + (r.contexts ? ` and ${r.contexts} passage/set${r.contexts === 1 ? '' : 's'}` : '')
          + `. ${r.withWarnings} need${r.withWarnings === 1 ? 's' : ''} a look before approval.`,
      });
      setRaw(''); setPreview(null);
    });
  };

  const warned = preview?.questions.filter((q) => q.warnings.length > 0).length ?? 0;

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-[11px] text-muted">
          Batch label
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="CAT 2023 Slot 1 · Arithmetic"
            className="mt-1 w-full rounded border border-border bg-panel-2 px-2 py-1.5 text-[12px] text-fg placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </label>
        <label className="text-[11px] text-muted">
          Topic for standalone QA questions
          <select
            value={qaTopic}
            onChange={(e) => setQaTopic(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-panel-2 px-2 py-1.5 text-[12px] text-fg focus:border-accent focus:outline-none"
          >
            {qaTopics.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-muted">
          Topic for DILR sets
          <select
            value={dilrTopic}
            onChange={(e) => setDilrTopic(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-panel-2 px-2 py-1.5 text-[12px] text-fg focus:border-accent focus:outline-none"
          >
            {dilrTopics.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-[11px] text-muted">
          Source
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as 'pyq' | 'imported')}
            className="mt-1 w-full rounded border border-border bg-panel-2 px-2 py-1.5 text-[12px] text-fg focus:border-accent focus:outline-none"
          >
            <option value="pyq">Real previous-year paper</option>
            <option value="imported">Other material (coaching, book)</option>
          </select>
        </label>
        <label className="text-[11px] text-muted">
          Year <span className="text-faint">(optional)</span>
          <input
            value={year} onChange={(e) => setYear(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
            inputMode="numeric" placeholder="2023"
            className="nums mt-1 w-full rounded border border-border bg-panel-2 px-2 py-1.5 text-[12px] text-fg placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </label>
        <label className="text-[11px] text-muted">
          Slot <span className="text-faint">(optional)</span>
          <input
            value={slot} onChange={(e) => setSlot(e.target.value.slice(0, 20))}
            placeholder="Slot 1"
            className="mt-1 w-full rounded border border-border bg-panel-2 px-2 py-1.5 text-[12px] text-fg placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      <textarea
        value={raw}
        onChange={(e) => { setRaw(e.target.value); setPreview(null); }}
        rows={14}
        spellCheck={false}
        placeholder={SAMPLE}
        aria-label="Paste questions"
        className="w-full rounded border border-border bg-panel-2 px-3 py-2 font-mono text-[12px] leading-relaxed text-fg placeholder:text-faint focus:border-accent focus:outline-none"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button" onClick={doPreview} disabled={!raw.trim() || pending}
          className="rounded border border-border px-3 py-1.5 text-[12px] text-fg hover:border-border-hi disabled:opacity-40"
        >
          {pending ? 'Working…' : 'Parse preview'}
        </button>
        <button
          type="button" onClick={doImport} disabled={!preview || preview.questions.length === 0 || pending}
          className="rounded bg-accent px-3 py-1.5 text-[12px] font-medium text-bg hover:opacity-90 disabled:opacity-40"
        >
          Import {preview?.questions.length ?? 0} to staging
        </button>
        <button
          type="button" onClick={() => { setRaw(SAMPLE); setPreview(null); }}
          className="text-[11px] text-faint underline underline-offset-2 hover:text-muted"
        >
          load a sample
        </button>
      </div>

      {msg && (
        <p role="status" className={cn('rounded border px-3 py-2 text-[12px]',
          msg.ok ? 'border-ok/40 bg-ok/10 text-ok' : 'border-bad/40 bg-bad/10 text-bad')}>
          {msg.text}
        </p>
      )}

      {preview && (
        <div className="rounded border border-border bg-panel p-3">
          <p className="text-[12px]">
            <span className="nums text-fg">{preview.questions.length}</span>
            <span className="text-muted"> question{preview.questions.length === 1 ? '' : 's'}</span>
            {preview.contexts.length > 0 && (
              <>
                <span className="text-faint"> · </span>
                <span className="nums text-fg">{preview.contexts.length}</span>
                <span className="text-muted"> passage/set{preview.contexts.length === 1 ? '' : 's'}</span>
              </>
            )}
            {warned > 0 && (
              <>
                <span className="text-faint"> · </span>
                <span className="nums text-bad">{warned}</span>
                <span className="text-muted"> with warnings</span>
              </>
            )}
          </p>

          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {preview.questions.map((q, i) => (
              <li key={i} className="rounded border border-border bg-panel-2 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-faint">
                  <span>{q.type}</span><span>·</span><span>{q.difficulty}</span>
                  {q.contextIdx !== null && (
                    <>
                      <span>·</span>
                      <span className="text-varc">
                        {preview.contexts[q.contextIdx].kind === 'rc_passage' ? 'RC' : 'DILR'} set {q.contextIdx + 1}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-[12px] text-fg">{q.stem.slice(0, 160)}{q.stem.length > 160 ? '…' : ''}</p>
                {q.options && (
                  <p className="mt-1 text-[11px] text-muted">{q.options.join('  ·  ')}</p>
                )}
                <p className="mt-1 text-[11px]">
                  <span className="text-faint">answer </span>
                  <span className="nums text-ok">{q.answer ?? '—'}</span>
                  <span className="text-faint"> · solution </span>
                  <span className={q.solution ? 'text-ok' : 'text-bad'}>{q.solution ? 'yes' : 'missing'}</span>
                </p>
                {q.warnings.length > 0 && (
                  <p className="mt-1 text-[11px] text-bad">{q.warnings.join(' · ')}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
