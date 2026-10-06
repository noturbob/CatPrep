"use client";

import { useCallback, useSyncExternalStore } from "react";

// Per-browser state in localStorage. Same-tab writes fire a custom event so every
// hook reading the key re-renders; other tabs arrive through "storage".
const EVENT = "stored";

function subscribe(cb: () => void) {
  addEventListener("storage", cb);
  addEventListener(EVENT, cb);
  return () => {
    removeEventListener("storage", cb);
    removeEventListener(EVENT, cb);
  };
}

function read(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}

/** JSON value at `key`; `fallback` on the server, on first paint and when unset or unreadable. */
export function useStored<T>(key: string, fallback: T): [T, (next: T) => void] {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null);
  let value = fallback;
  if (raw) {
    try { value = JSON.parse(raw) as T; } catch {}
  }
  const set = useCallback(
    (next: T) => {
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [value, set];
}
