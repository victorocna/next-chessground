import { Chessground } from '@lichess-org/chessground';
import type { Api } from '@lichess-org/chessground/api';
import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { boardConfig } from '../board/board-config';
import type { BoardInput, DrawShape, Key, MoveMetadata, Prefs } from '../board/types';
import { isDisplayableFen } from '../rules/position';

export interface ChessgroundExtras {
  autoShapes: DrawShape[];
  holdPieces: boolean;
  shapes: DrawShape[];
  syncKey: number;
}

const placementOf = (fen: string): string => fen.split(' ')[0] ?? '';
const isDev = (): boolean =>
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

/**
 * Keeps one chessground instance in step with the props: created on mount, `set` on every
 * change, destroyed on unmount. Callbacks read the latest props through refs so chessground
 * never holds a stale closure.
 */
export const useChessground = (
  el: RefObject<HTMLDivElement | null>,
  input: BoardInput,
  prefs: Prefs,
  { autoShapes, holdPieces, shapes, syncKey }: ChessgroundExtras
): void => {
  const api = useRef<Api | null>(null);
  const latest = useRef(input);
  latest.current = input;
  const latestPrefs = useRef(prefs);
  latestPrefs.current = prefs;
  const latestShapes = useRef({ autoShapes, shapes });
  latestShapes.current = { autoShapes, shapes };

  // A rejected move needs a full resync: chessground has already cleared dests and check
  // before `after` fires, so a partial set would leave the board frozen.
  const after = useCallback((orig: Key, dest: Key, meta: MoveMetadata) => {
    const { onMove } = latest.current;
    if (onMove && !onMove(orig, dest, meta)) {
      api.current?.set(boardConfig(latest.current, latestPrefs.current, handlers));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- handlers is stable and defined below
  const handlers = useMemo(
    () => ({
      after,
      onShapesChange: (drawn: DrawShape[]) => latest.current.onShapesChange?.(drawn),
    }),
    [after]
  );

  // chessground binds its document listeners (drag move/end) once, at creation, and only when
  // the board is not viewOnly: a board that turns interactive later needs a fresh instance.
  const { viewOnly } = input;
  useEffect(() => {
    if (!el.current) {
      return undefined;
    }
    const board = Chessground(
      el.current,
      boardConfig(latest.current, latestPrefs.current, handlers)
    );
    board.setShapes(latestShapes.current.shapes);
    board.setAutoShapes(latestShapes.current.autoShapes);
    api.current = board;
    return () => {
      board.destroy();
      api.current = null;
    };
  }, [el, handlers, viewOnly]);

  const {
    check,
    coordinates,
    dests,
    fen,
    lastMove,
    movableColor,
    orientation,
    premovable,
    turnColor,
  } = input;
  // coordinates are bound when chessground builds its DOM: changing them needs redrawAll
  const rebuildKey = `${coordinates ?? prefs.coordinates}`;
  const lastRebuild = useRef(rebuildKey);

  useEffect(() => {
    const board = api.current;
    if (!board) {
      return;
    }
    const config = boardConfig(latest.current, latestPrefs.current, handlers);
    // fen only when the pieces differ (a dragged piece is not reset) and never while the
    // promotion picker holds the pawn; an undisplayable fen keeps the previous position
    const displayable = isDisplayableFen(fen);
    if (!displayable && isDev()) {
      console.warn('[next-chessground] fen not displayable, keeping previous position:', fen);
    }
    const pushFen = displayable && !holdPieces && board.getFen() !== placementOf(fen);
    if (!pushFen) {
      delete config.fen;
    }
    board.set(config);
    if (lastRebuild.current !== rebuildKey) {
      lastRebuild.current = rebuildKey;
      board.redrawAll();
    }
    // Only after a new position: chessground's playPremove() unsets the stored premove whenever
    // it cannot play it, so calling it on every sync would disarm it during the opponent's turn.
    if (pushFen) {
      board.playPremove();
    }
  }, [
    check,
    dests,
    fen,
    handlers,
    holdPieces,
    lastMove,
    movableColor,
    orientation,
    premovable,
    prefs,
    rebuildKey,
    syncKey,
    turnColor,
  ]);

  useEffect(() => {
    // fen is a dependency because a new position wipes user-drawn shapes
    api.current?.setShapes(shapes);
    api.current?.setAutoShapes(autoShapes);
  }, [autoShapes, fen, shapes]);
};
