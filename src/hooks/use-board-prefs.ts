import { useSyncExternalStore } from 'react';
import type { Prefs } from '../board/types';
import { DEFAULT_PREFS } from '../prefs/options';
import { readPrefs, subscribePrefs, writePrefs } from '../prefs/store';

const serverSnapshot = (): Prefs => DEFAULT_PREFS;

/** Board preferences shared by every board on the page, and by the app's own settings UI. */
export const useBoardPrefs = (): [Prefs, (patch: Partial<Prefs>) => void] => {
  const prefs = useSyncExternalStore(subscribePrefs, readPrefs, serverSnapshot);
  return [prefs, writePrefs];
};
