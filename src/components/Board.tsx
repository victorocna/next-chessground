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
 * Every BoardInput key required, so the memo literal below cannot silently drop one: an optional
 * field like `coordinates` produces no type error when its key is simply missing. Intersecting
 * with `Record<keyof BoardInput, unknown>` makes each key mandatory without touching value types,
 * so `coordinates: undefined` stays legal and the result is still assignable to `BoardInput`.
 */
type FullBoardInput = BoardInput & Record<keyof BoardInput, unknown>;

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
  // Memoised so `useChessground` can depend on the whole object: exhaustive-deps then checks
  // this list, and FullBoardInput requires every key (required or optional) to appear in the
  // literal below, so none can go missing unnoticed.
  const input = useMemo<FullBoardInput>(
    () => ({
      check,
      coordinates,
      dests,
      fen,
      lastMove,
      movableColor,
      orientation,
      premovable,
      turnColor,
      viewOnly,
    }),
    [
      check,
      coordinates,
      dests,
      fen,
      lastMove,
      movableColor,
      orientation,
      premovable,
      turnColor,
      viewOnly,
    ]
  );
  useChessground(el, input, prefs, {
    autoShapes,
    holdPieces,
    onMove,
    onShapesChange,
    shapes,
    syncKey,
  });
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
