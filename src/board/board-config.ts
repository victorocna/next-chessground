import type { Config } from '@lichess-org/chessground/config';
import type { BoardInput, Color, DrawShape, Key, MoveMetadata, PlayerColor, Prefs } from './types';

export interface ConfigHandlers {
  after: (orig: Key, dest: Key, meta: MoveMetadata) => void;
  onShapesChange: (shapes: DrawShape[]) => void;
}

const movableColorOf = (
  movableColor: PlayerColor | undefined,
  turnColor: Color
): Color | undefined => (movableColor === 'both' ? turnColor : movableColor);

/**
 * Translates Board props and preferences into a chessground Config. Keys stay present even
 * when undefined: that is how chessground clears lastMove and movable.color.
 */
export const boardConfig = (input: BoardInput, prefs: Prefs, handlers: ConfigHandlers): Config => ({
  animation: { duration: 200, enabled: true },
  check: input.check,
  coordinates: input.coordinates ?? prefs.coordinates,
  disableContextMenu: true,
  draggable: { enabled: !input.viewOnly, showGhost: true },
  drawable: {
    // Chessground snaps a drawn arrow to the nearest square the origin piece could reach; an
    // arrow must end on the square where the mouse was released instead.
    defaultSnapToValidMove: false,
    enabled: !input.viewOnly,
    onChange: handlers.onShapesChange,
    visible: true,
  },
  fen: input.fen,
  highlight: { check: true, lastMove: prefs.highlight },
  lastMove: input.lastMove ?? undefined,
  movable: {
    color: movableColorOf(input.movableColor, input.turnColor),
    dests: input.dests,
    events: { after: handlers.after },
    free: false,
    rookCastle: true,
    showDests: prefs.showDests,
  },
  orientation: input.orientation,
  premovable: { castle: true, enabled: input.premovable, showDests: prefs.showDests },
  turnColor: input.turnColor,
  viewOnly: input.viewOnly,
});
