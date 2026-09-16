'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Replica of the TCS on-screen calculator used in the CAT exam.
 *
 * Deliberately keeps the exam's light chrome even inside the dark app: the
 * entire point is muscle memory, so it must look and behave on 29 Nov the
 * way it looks in practice.
 */

type Op = '+' | '-' | '*' | '/' | null;

function fmt(n: number): string {
  if (!Number.isFinite(n)) return 'Error';
  const s = Number(n.toPrecision(12)).toString();
  return s.length > 16 ? n.toExponential(9) : s;
}

function compute(a: number, b: number, op: Exclude<Op, null>): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
  }
}

export function useCalculatorState() {
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [overwrite, setOverwrite] = useState(true);
  const [memory, setMemory] = useState(0);

  const digit = useCallback((d: string) => {
    setDisplay((cur) => {
      if (overwrite) return d;
      if (cur === '0') return d;
      if (cur.replace(/[-.]/g, '').length >= 15) return cur;
      return cur + d;
    });
    setOverwrite(false);
  }, [overwrite]);

  const dot = useCallback(() => {
    if (overwrite) { setDisplay('0.'); setOverwrite(false); return; }
    setDisplay((c) => (c.includes('.') ? c : c + '.'));
  }, [overwrite]);

  const applyOp = useCallback((next: Exclude<Op, null>) => {
    const cur = parseFloat(display);
    if (acc !== null && op && !overwrite) {
      const r = compute(acc, cur, op);
      setAcc(r);
      setDisplay(fmt(r));
    } else {
      setAcc(cur);
    }
    setOp(next);
    setOverwrite(true);
  }, [acc, display, op, overwrite]);

  const equals = useCallback(() => {
    if (acc === null || !op) { setOverwrite(true); return; }
    const r = compute(acc, parseFloat(display), op);
    setDisplay(fmt(r));
    setAcc(null);
    setOp(null);
    setOverwrite(true);
  }, [acc, display, op]);

  /** Matches a physical four-function calculator: +/- takes a share of the
   *  accumulator, x// takes a plain hundredth. */
  const percent = useCallback(() => {
    const cur = parseFloat(display);
    const r = acc !== null && (op === '+' || op === '-') ? (acc * cur) / 100 : cur / 100;
    setDisplay(fmt(r));
    setOverwrite(true);
  }, [acc, display, op]);

  const unary = useCallback((f: (n: number) => number) => {
    setDisplay((c) => fmt(f(parseFloat(c))));
    setOverwrite(true);
  }, []);

  const clearAll = useCallback(() => {
    setDisplay('0'); setAcc(null); setOp(null); setOverwrite(true);
  }, []);

  const clearEntry = useCallback(() => { setDisplay('0'); setOverwrite(true); }, []);

  const backspace = useCallback(() => {
    if (overwrite) return;
    setDisplay((c) => (c.length <= 1 || (c.length === 2 && c.startsWith('-')) ? '0' : c.slice(0, -1)));
  }, [overwrite]);

  const negate = useCallback(() => {
    setDisplay((c) => (c === '0' ? c : c.startsWith('-') ? c.slice(1) : '-' + c));
  }, []);

  return {
    display, memory, op, hasMemory: memory !== 0,
    digit, dot, applyOp, equals, percent, unary, clearAll, clearEntry, backspace, negate,
    memClear: () => setMemory(0),
    memRecall: () => { setDisplay(fmt(memory)); setOverwrite(true); },
    memAdd: () => { setMemory((m) => m + parseFloat(display)); setOverwrite(true); },
    memSub: () => { setMemory((m) => m - parseFloat(display)); setOverwrite(true); },
  };
}

type BtnProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'num' | 'fn' | 'op' | 'eq' | 'mem';
  className?: string;
  label?: string;
};

function Btn({ children, onClick, variant = 'num', className, label }: BtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'h-9 rounded-[3px] border text-[13px] font-medium leading-none',
        'transition-colors select-none active:translate-y-px',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600',
        variant === 'num' && 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100',
        variant === 'fn' && 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        variant === 'mem' && 'border-neutral-300 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 text-[11px]',
        variant === 'op' && 'border-neutral-300 bg-neutral-200 text-neutral-900 hover:bg-neutral-300',
        variant === 'eq' && 'border-blue-700 bg-blue-600 text-white hover:bg-blue-700',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function CatCalculator({ onClose }: { onClose?: () => void }) {
  const c = useCalculatorState();
  // null until dragged: the resting position is pure CSS, so there is no
  // setState-in-effect and no first-paint jump.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragRef.current) return;
      setPos({
        x: Math.min(Math.max(0, e.clientX - dragRef.current.dx), window.innerWidth - 60),
        y: Math.min(Math.max(0, e.clientY - dragRef.current.dy), window.innerHeight - 40),
      });
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  // Keyboard entry, scoped so it never steals keys from a TITA input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        if (!rootRef.current?.contains(t)) return;
      }
      const k = e.key;
      if (/^[0-9]$/.test(k)) { c.digit(k); e.preventDefault(); }
      else if (k === '.') { c.dot(); e.preventDefault(); }
      else if (k === '+' || k === '-' || k === '*' || k === '/') { c.applyOp(k); e.preventDefault(); }
      else if (k === 'Enter' || k === '=') { c.equals(); e.preventDefault(); }
      else if (k === 'Backspace') { c.backspace(); e.preventDefault(); }
      else if (k === 'Escape') { c.clearAll(); e.preventDefault(); }
      else if (k === 'Delete') { c.clearEntry(); e.preventDefault(); }
      else if (k === '%') { c.percent(); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [c]);

  return (
    <div
      ref={rootRef}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      className={cn(
        'fixed z-50 w-[272px] rounded-[4px] border border-neutral-400 bg-neutral-200 shadow-2xl',
        !pos && 'right-2 top-24',
      )}
      role="dialog"
      aria-label="On-screen calculator"
    >
      <div
        onPointerDown={(e) => {
          const r = e.currentTarget.parentElement!.getBoundingClientRect();
          dragRef.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
        }}
        className="flex cursor-grab items-center justify-between rounded-t-[3px] bg-neutral-700 px-2 py-1.5 text-[11px] font-semibold tracking-wide text-white active:cursor-grabbing"
      >
        <span>Calculator</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close calculator"
            className="rounded px-1.5 leading-none hover:bg-neutral-600"
          >
            x
          </button>
        )}
      </div>

      <div className="px-2 pt-2">
        <div className="relative rounded-[3px] border border-neutral-400 bg-white px-2 py-1.5">
          <div className="absolute left-2 top-1 text-[9px] font-bold text-neutral-500">
            {c.hasMemory ? 'M' : ''}
          </div>
          <div className="truncate text-right font-mono text-[22px] leading-7 text-neutral-900 tabular-nums">
            {c.display}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 p-2">
        <Btn variant="mem" onClick={c.memClear} label="Memory clear">MC</Btn>
        <Btn variant="mem" onClick={c.memRecall} label="Memory recall">MR</Btn>
        <Btn variant="mem" onClick={c.memAdd} label="Memory add">M+</Btn>
        <Btn variant="mem" onClick={c.memSub} label="Memory subtract">M-</Btn>
        <Btn variant="fn" onClick={c.backspace} label="Backspace">&larr;</Btn>

        <Btn variant="fn" onClick={c.clearEntry} label="Clear entry">CE</Btn>
        <Btn variant="fn" onClick={c.clearAll} label="Clear all">C</Btn>
        <Btn variant="fn" onClick={c.negate} label="Negate">&plusmn;</Btn>
        <Btn variant="fn" onClick={c.percent} label="Percent">%</Btn>
        <Btn variant="op" onClick={() => c.applyOp('/')} label="Divide">&divide;</Btn>

        <Btn onClick={() => c.digit('7')}>7</Btn>
        <Btn onClick={() => c.digit('8')}>8</Btn>
        <Btn onClick={() => c.digit('9')}>9</Btn>
        <Btn variant="fn" onClick={() => c.unary(Math.sqrt)} label="Square root">&radic;</Btn>
        <Btn variant="op" onClick={() => c.applyOp('*')} label="Multiply">&times;</Btn>

        <Btn onClick={() => c.digit('4')}>4</Btn>
        <Btn onClick={() => c.digit('5')}>5</Btn>
        <Btn onClick={() => c.digit('6')}>6</Btn>
        <Btn variant="fn" onClick={() => c.unary((n) => n * n)} label="Square">x&sup2;</Btn>
        <Btn variant="op" onClick={() => c.applyOp('-')} label="Subtract">&minus;</Btn>

        <Btn onClick={() => c.digit('1')}>1</Btn>
        <Btn onClick={() => c.digit('2')}>2</Btn>
        <Btn onClick={() => c.digit('3')}>3</Btn>
        <Btn variant="fn" onClick={() => c.unary((n) => (n === 0 ? NaN : 1 / n))} label="Reciprocal">1/x</Btn>
        <Btn variant="op" onClick={() => c.applyOp('+')} label="Add">+</Btn>

        <Btn className="col-span-2" onClick={() => c.digit('0')}>0</Btn>
        <Btn onClick={c.dot}>.</Btn>
        <Btn variant="eq" className="col-span-2" onClick={c.equals} label="Equals">=</Btn>
      </div>
    </div>
  );
}
