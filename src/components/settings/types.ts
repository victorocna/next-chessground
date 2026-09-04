import type { ReactNode } from 'react';

export type SettingsSection = 'board' | 'pieces' | 'sound' | 'toggles';

/** Panel chrome and toggle names; every missing entry keeps its English default. */
export interface SettingsLabels {
  title?: string;
  close?: string;
  board?: string;
  pieces?: string;
  sound?: string;
  showDests?: string;
  highlight?: string;
  coordinates?: string;
}

/** Names of the option ids, keyed by id; missing ids fall back to the capitalised id. */
export interface SettingsOptionLabels {
  boards?: Record<string, string>;
  pieces?: Record<string, string>;
  sounds?: Record<string, string>;
}

/**
 * One class name slot per element, so an app can restyle the panel without CSS overrides.
 * `section`, `sectionTitle`, `options` and `chip` are the 1.x-era names of `row`, `label`,
 * `control` and `segment`; both spellings land on the same element.
 */
export interface SettingsClassNames {
  backdrop?: string;
  panel?: string;
  header?: string;
  title?: string;
  close?: string;
  row?: string;
  /** Alias of `row`. */
  section?: string;
  label?: string;
  /** Alias of `label`. */
  sectionTitle?: string;
  control?: string;
  /** Alias of `control`. */
  options?: string;
  option?: string;
  optionActive?: string;
  swatch?: string;
  piecePreview?: string;
  segmented?: string;
  segment?: string;
  /** Alias of `segment`. */
  chip?: string;
  toggleRow?: string;
  toggleLabel?: string;
  toggle?: string;
}

export interface BoardSettingsProps {
  open: boolean;
  onClose: () => void;
  /** Sections to render, in order. Default: board, pieces, sound, toggles. */
  sections?: SettingsSection[];
  labels?: SettingsLabels;
  optionLabels?: SettingsOptionLabels;
  icons?: { close?: ReactNode };
  className?: string;
  classNames?: SettingsClassNames;
}
