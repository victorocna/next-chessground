import type { Prefs } from '../board/types';

export const BOARDS = ['green', 'brown', 'ruby', 'purple', 'teal'] as const;
export const PIECES = ['neo', 'cburnett', 'alpha', 'bases', 'classic'] as const;
export const SOUNDS = ['robot', 'piano', 'lisp', 'sfx', 'silent'] as const;
export type BoardId = (typeof BOARDS)[number];
export type PieceSetId = (typeof PIECES)[number];
export type SoundId = (typeof SOUNDS)[number];

/** The sound id that switches move sounds off. */
export const SILENT = 'silent';

export const DEFAULT_PREFS: Readonly<Prefs> = {
  board: 'green',
  pieces: 'neo',
  sound: 'robot',
  showDests: true,
  highlight: true,
  coordinates: true,
};
