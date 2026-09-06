import type { Prefs } from '../board/types';
import { BOARDS, DEFAULT_PREFS, PIECES, SOUNDS } from './options';

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

const includes = <T extends string>(ids: readonly T[], value: string): value is T =>
  ids.some((id) => id === value);

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * Keeps a key from stored JSON only when its value still matches the current option ids and
 * types. Drops stale ids (an old build's board/pieces/sound removed since), wrong-typed values
 * and unknown keys, so a corrupted or outdated snapshot degrades to defaults key-by-key rather
 * than being rejected wholesale.
 */
const sanitize = (raw: unknown): Partial<Prefs> => {
  if (typeof raw !== 'object' || raw === null) {
    return {};
  }
  const value = raw as Record<string, unknown>;
  const prefs: Partial<Prefs> = {};
  if (typeof value.board === 'string' && includes(BOARDS, value.board)) {
    prefs.board = value.board;
  }
  if (typeof value.pieces === 'string' && includes(PIECES, value.pieces)) {
    prefs.pieces = value.pieces;
  }
  if (typeof value.sound === 'string' && includes(SOUNDS, value.sound)) {
    prefs.sound = value.sound;
  }
  if (isBoolean(value.showDests)) {
    prefs.showDests = value.showDests;
  }
  if (isBoolean(value.highlight)) {
    prefs.highlight = value.highlight;
  }
  if (isBoolean(value.coordinates)) {
    prefs.coordinates = value.coordinates;
  }
  return prefs;
};

const readStorage = (): Partial<Prefs> => {
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : {};
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
