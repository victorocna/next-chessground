import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import type {
  BoardInput,
  Color,
  Dests,
  DrawShape,
  Key,
  MoveMetadata,
  PlayerColor,
} from '../board/types';
import { useBoardPrefs } from '../hooks/use-board-prefs';
import { useChessground } from '../hooks/use-chessground';
import { INITIAL_FEN } from '../rules/position';
import { BoardContext } from './board-context';

export interface BoardProps {
  fen?: string;
  orientation?: Color;
  turnColor?: Color;
  lastMove?: [Key, Key] | null;
  check?: Color | false;
  movableColor?: PlayerColor;
  dests?: Dests;
  premovable?: boolean;
  viewOnly?: boolean;
  coordinates?: boolean;
  shapes?: DrawShape[];
  autoShapes?: DrawShape[];
  onShapesChange?: (shapes: DrawShape[]) => void;
  syncKey?: number;
  holdPieces?: boolean;
  onMove?: (orig: Key, dest: Key, meta: MoveMetadata) => boolean;
  className?: string;
  children?: ReactNode;
}

const NO_DESTS: Dests = new Map();
const NO_SHAPES: DrawShape[] = [];

/**
 * Controlled view of a position: props in, `onMove` out. Children render over the board
 * (the promotion picker, custom overlays). Defaults make `<Board fen viewOnly />` a static board.
 */
export const Board = ({
  autoShapes = NO_SHAPES,
  check = false,
  children,
  className,
  coordinates,
  dests = NO_DESTS,
  fen = INITIAL_FEN,
  holdPieces = false,
  lastMove = null,
  movableColor,
  onMove,
  onShapesChange,
  orientation = 'white',
  premovable = false,
  shapes = NO_SHAPES,
  syncKey = 0,
  turnColor = 'white',
  viewOnly = false,
}: BoardProps) => {
  const [prefs] = useBoardPrefs();
  const el = useRef<HTMLDivElement | null>(null);
  const input: BoardInput = {
    check,
    coordinates,
    dests,
    fen,
    lastMove,
    movableColor,
    onMove,
    onShapesChange,
    orientation,
    premovable,
    turnColor,
    viewOnly,
  };
  useChessground(el, input, prefs, { autoShapes, holdPieces, shapes, syncKey });
  const context = useMemo(() => ({ orientation }), [orientation]);
  const classes = [
    'next-chessground',
    `board-${prefs.board}`,
    `pieces-${prefs.pieces}`,
    prefs.highlight ? 'highlight' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BoardContext.Provider value={context}>
      <div className={classes}>
        <div className="next-chessground-board" ref={el} />
        {children}
      </div>
    </BoardContext.Provider>
  );
};
