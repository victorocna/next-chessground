import type { ReactNode } from 'react';
import type { Color, DrawShape, Key, Move, PlayerColor, Variant } from '../board/types';
import { useChessBoard } from '../hooks/use-chess-board';
import { useMoveSound } from '../hooks/use-move-sound';
import { INITIAL_FEN } from '../rules/position';
import { Board } from './Board';
import { Promotion, type PromotionLabels } from './Promotion';

export interface ChessboardProps {
  fen?: string;
  variant?: Variant;
  playerColor?: PlayerColor;
  locked?: boolean;
  viewOnly?: boolean;
  premove?: boolean;
  orientation?: Color;
  lastMove?: [Key, Key] | null;
  shapes?: DrawShape[];
  autoShapes?: DrawShape[];
  onMove?: (move: Move) => void;
  onShapesChange?: (shapes: DrawShape[]) => void;
  coordinates?: boolean;
  labels?: PromotionLabels;
  className?: string;
  children?: ReactNode;
}

/**
 * The batteries-included board: position in, validated move out. Legal targets, check,
 * premoves, the promotion picker, snap-back, sounds and theme classes are handled inside.
 * Orientation is the app's: pass `orientation` and flip it from your own button. Settings
 * chrome is the app's too, built on `useBoardPrefs` and dropped in as `children`, which
 * render inside the board root and so cover the squares and nothing else.
 */
export const Chessboard = ({
  autoShapes,
  children,
  className,
  coordinates,
  fen = INITIAL_FEN,
  labels,
  lastMove = null,
  locked = false,
  onMove,
  onShapesChange,
  orientation = 'white',
  playerColor,
  premove = true,
  shapes,
  variant = 'standard',
  viewOnly = false,
}: ChessboardProps) => {
  const { boardProps, promotion } = useChessBoard({
    fen,
    variant,
    playerColor,
    locked: locked || viewOnly,
    premove,
    onMove,
  });
  // A static board is a picture, not a move: never beep for it.
  useMoveSound(fen, viewOnly ? null : lastMove);

  return (
    <Board
      {...boardProps}
      autoShapes={autoShapes}
      className={className}
      coordinates={coordinates}
      lastMove={lastMove}
      onShapesChange={onShapesChange}
      orientation={orientation}
      shapes={shapes}
      viewOnly={viewOnly}
    >
      {promotion && <Promotion {...promotion} labels={labels} />}
      {children}
    </Board>
  );
};

export default Chessboard;
