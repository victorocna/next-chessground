import type { DrawShape } from '@lichess-org/chessground/draw';
import type { Color, Dests, Key, MoveMetadata } from '@lichess-org/chessground/types';

export type { Color, Dests, DrawShape, Key, MoveMetadata };

/** Sides the user may move. `'both'` is analysis mode. */
export type PlayerColor = Color | 'both';

export type Variant = 'standard' | 'chess960' | 'kingOfTheHill' | 'threeCheck';

export type PromotionRole = 'queen' | 'rook' | 'bishop' | 'knight';

/** A validated move as handed to `onMove`. `fen` is the position after the move. */
export interface Move {
  from: Key;
  to: Key;
  promotion?: PromotionRole;
  uci: string;
  san: string;
  fen: string;
}

export interface Prefs {
  board: string;
  pieces: string;
  sound: string;
  showDests: boolean;
  highlight: boolean;
  coordinates: boolean;
}

/** What the user may do on the displayed position; computed by `boardState()`. */
export interface BoardState {
  turnColor: Color;
  check: Color | false;
  dests: Dests;
  movableColor?: PlayerColor;
  premovable: boolean;
  isOver: boolean;
  isDisplayable: boolean;
}

/** Position and interaction props of `Board`, the pure input of `boardConfig()`. */
export interface BoardInput {
  fen: string;
  orientation: Color;
  turnColor: Color;
  lastMove: [Key, Key] | null;
  check: Color | false;
  movableColor?: PlayerColor;
  dests: Dests;
  premovable: boolean;
  viewOnly: boolean;
  coordinates?: boolean;
  onMove?: (orig: Key, dest: Key, meta: MoveMetadata) => boolean;
  onShapesChange?: (shapes: DrawShape[]) => void;
}
