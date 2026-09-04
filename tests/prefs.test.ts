// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PREFS } from '../src/prefs/options';
import {
  STORAGE_KEY,
  readPrefs,
  resetPrefsCache,
  subscribePrefs,
  writePrefs,
} from '../src/prefs/store';

describe('prefs store', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
    vi.restoreAllMocks();
  });

  it('returns defaults when storage is empty and keeps the same reference', () => {
    expect(readPrefs()).toEqual(DEFAULT_PREFS);
    expect(readPrefs()).toBe(readPrefs());
  });

  it('merges stored values over defaults', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ board: 'brown' }));
    expect(readPrefs()).toEqual({ ...DEFAULT_PREFS, board: 'brown' });
  });

  it('writes a patch, persists it and notifies subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribePrefs(listener);
    const before = readPrefs();
    writePrefs({ pieces: 'alpha', showDests: false });
    expect(readPrefs()).not.toBe(before);
    expect(readPrefs()).toEqual({ ...DEFAULT_PREFS, pieces: 'alpha', showDests: false });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual(readPrefs());
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    writePrefs({ board: 'teal' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('falls back to defaults when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readPrefs()).toEqual(DEFAULT_PREFS);
    expect(() => writePrefs({ board: 'ruby' })).not.toThrow();
    expect(readPrefs().board).toBe('ruby');
  });

  it('ignores corrupt storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(readPrefs()).toEqual(DEFAULT_PREFS);
  });
});
