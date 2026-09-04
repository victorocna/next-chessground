import type { Prefs } from '../board/types';
import { DEFAULT_PREFS } from './options';

export const STORAGE_KEY = 'next-chessground';

const listeners = new Set<() => void>();
let cache: Prefs | null = null;

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readStorage = (): Partial<Prefs> => {
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Prefs>) : {};
  } catch {
    return {};
  }
};

/** Stable snapshot: the same object until the next write, as useSyncExternalStore requires. */
export const readPrefs = (): Prefs => {
  if (!cache) {
    cache = { ...DEFAULT_PREFS, ...readStorage() };
  }
  return cache;
};

export const writePrefs = (patch: Partial<Prefs>): void => {
  cache = { ...readPrefs(), ...patch };
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage blocked: the in-memory value still applies for this session.
  }
  listeners.forEach((listener) => listener());
};

export const subscribePrefs = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Test helper: forget the cached snapshot. */
export const resetPrefsCache = (): void => {
  cache = null;
};
