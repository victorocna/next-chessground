export { Chessboard, default } from './components/Chessboard';
export type { ChessboardProps } from './components/Chessboard';
export { Board } from './components/Board';
export type { BoardProps } from './components/Board';
export { Promotion } from './components/Promotion';
export type { PromotionLabels, PromotionProps } from './components/Promotion';
export { useBoardOrientation } from './components/board-context';

export { useChessboard } from './hooks/use-chessboard';
export type {
  PromotionState,
  UseChessboardOptions,
  UseChessboardResult,
} from './hooks/use-chessboard';
export { useBoardPrefs } from './hooks/use-board-prefs';
export { useBoardSound } from './hooks/use-board-sound';
export { useMoveSound } from './hooks/use-move-sound';

export { BOARDS, DEFAULT_PREFS, PIECES, SILENT, SOUNDS } from './prefs/options';
export type { BoardId, PieceSetId, SoundId } from './prefs/options';
export { STORAGE_KEY, readPrefs, subscribePrefs, writePrefs } from './prefs/store';
export { playSound } from './sound/play';

export {
  EMPTY_FEN,
  INITIAL_FEN,
  isDisplayableFen,
  isValidFen,
  turnColorOf,
} from './rules/position';
export { boardState, toDests } from './rules/board-state';
export type { BoardStateInput } from './rules/board-state';
export { uciMove, userMove } from './rules/moves';
export { isPromotion } from './rules/promotion';
export { promotionSquares } from './rules/promotion-squares';

export type {
  BoardInput,
  BoardState,
  Color,
  Dests,
  DrawShape,
  Key,
  Move,
  MoveMetadata,
  PlayerColor,
  Prefs,
  PromotionRole,
  Variant,
} from './board/types';
