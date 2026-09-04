import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Color, DrawShape, Key, Move, PlayerColor, Variant } from '../board/types';
import { useChessBoard } from '../hooks/use-chess-board';
import { useMoveSound } from '../hooks/use-move-sound';
import { INITIAL_FEN } from '../rules/position';
import { Board } from './Board';
import { BoardControls, type BoardControlsProps } from './BoardControls';
import { BoardSettings, type BoardSettingsProps } from './BoardSettings';
import { Promotion, type PromotionLabels } from './Promotion';

export interface ChessboardProps {
  fen?: string;
  variant?: Variant;
  playerColor?: PlayerColor;
  locked?: boolean;
  viewOnly?: boolean;
  premove?: boolean;
  orientation?: Color;
  defaultOrientation?: Color;
  onOrientationChange?: (orientation: Color) => void;
  lastMove?: [Key, Key] | null;
  shapes?: DrawShape[];
  autoShapes?: DrawShape[];
  onMove?: (move: Move) => void;
  onShapesChange?: (shapes: DrawShape[]) => void;
  coordinates?: boolean;
  labels?: PromotionLabels;
  /** Controls bar under the board: `true` for the defaults, an object to theme the buttons. */
  controls?: boolean | Pick<BoardControlsProps, 'icons' | 'labels' | 'className' | 'classNames'>;
  settingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
  settings?: Omit<BoardSettingsProps, 'open' | 'onClose'>;
  className?: string;
  children?: ReactNode;
}

/**
 * The batteries-included board: position in, validated move out. Legal targets, check,
 * premoves, the promotion picker, snap-back, sounds and theme classes are handled inside.
 * Orientation and the settings overlay are controlled when their prop is given, internal otherwise.
 */
export const Chessboard = ({
  autoShapes,
  children,
  className,
  controls = false,
  coordinates,
  defaultOrientation = 'white',
  fen = INITIAL_FEN,
  labels,
  lastMove = null,
  locked = false,
  onMove,
  onOrientationChange,
  onSettingsOpenChange,
  onShapesChange,
  orientation: orientationProp,
  playerColor,
  premove = true,
  settings,
  settingsOpen,
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

  const [ownOrientation, setOwnOrientation] = useState<Color>(defaultOrientation);
  const orientation = orientationProp ?? ownOrientation;
  const [ownSettingsOpen, setOwnSettingsOpen] = useState(false);
  const isSettingsOpen = settingsOpen ?? ownSettingsOpen;

  const openSettings = (open: boolean) => {
    if (settingsOpen === undefined) {
      setOwnSettingsOpen(open);
    }
    onSettingsOpenChange?.(open);
  };
  const flip = () => {
    const next: Color = orientation === 'white' ? 'black' : 'white';
    if (orientationProp === undefined) {
      setOwnOrientation(next);
    }
    onOrientationChange?.(next);
  };
  // A controlled orientation without a change handler cannot move: hide the button.
  const canFlip = orientationProp === undefined || onOrientationChange !== undefined;

  const board = (
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
      {isSettingsOpen && <BoardSettings {...settings} onClose={() => openSettings(false)} open />}
      {children}
    </Board>
  );

  if (!controls) {
    return board;
  }
  return (
    <div className="next-chessground-frame">
      {board}
      <BoardControls
        {...(typeof controls === 'object' ? controls : {})}
        onFlip={canFlip ? flip : undefined}
        onSettings={() => openSettings(true)}
      />
    </div>
  );
};

export default Chessboard;
