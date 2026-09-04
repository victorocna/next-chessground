import type { SettingsLabels, SettingsOptionLabels } from './types';

export const DEFAULT_LABELS: Required<SettingsLabels> = {
  title: 'Board settings',
  close: 'Close',
  board: 'Board',
  pieces: 'Pieces',
  sound: 'Sound',
  showDests: 'Show legal moves',
  highlight: 'Highlight last move',
  coordinates: 'Coordinates',
};

/** `labels={{ title: undefined }}` must keep the English default, so undefined never merges. */
export const resolveLabels = (labels: SettingsLabels = {}): Required<SettingsLabels> => ({
  ...DEFAULT_LABELS,
  ...Object.fromEntries(Object.entries(labels).filter(([, value]) => value !== undefined)),
});

const capitalise = (id: string): string => id.charAt(0).toUpperCase() + id.slice(1);

/** Name of one option id: the app's translation when it has one, the capitalised id otherwise. */
export const optionLabel = (
  group: keyof SettingsOptionLabels,
  id: string,
  optionLabels: SettingsOptionLabels = {}
): string => optionLabels[group]?.[id] ?? capitalise(id);
