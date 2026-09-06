import { Chessground } from '@lichess-org/chessground';
import type { Api } from '@lichess-org/chessground/api';
import type { RefObject } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { ConfigHandlers } from '../board/board-config';
import { boardConfig } from '../board/board-config';
import type { BoardInput, DrawShape, Key, MoveMetadata, Prefs } from '../board/types';
import { isDev } from '../lib/env';
import { useLatest } from '../lib/use-latest';
import { isDisplayableFen, placementOf } from '../rules/position';

export interface ChessgroundExtras {
  autoShapes: DrawShape[];
  holdPieces: boolean;
  onMove?: (orig: Key, dest: Key, meta: MoveMetadata) => boolean;
  onShapesChange?: (shapes: DrawShape[]) => void;
  shapes: DrawShape[];
  syncKey: number;
}

/**
 * Keeps one chessground instance in step with the props: created on mount, `set` on every
 * change, destroyed on unmount. Callbacks read the latest props through refs so chessground
 * never holds a stale closure.
 */
export const useChessground = (
  el: RefObject<HTMLDivElement | null>,
  input: BoardInput,
  prefs: Prefs,
  { autoShapes, holdPieces, onMove, onShapesChange, shapes, syncKey }: ChessgroundExtras
): void => {
  const api = useRef<Api | null>(null);
  const latest = useLatest(input);
  const latestPrefs = useLatest(prefs);
  const latestShapes = useLatest({ autoShapes, shapes });
  const latestOnMove = useLatest(onMove);
  const latestOnShapesChange = useLatest(onShapesChange);

  // One stable object for the life of the board: chessground keeps the handlers it was built
  // with, so `after` resyncs through the very object it is a member of.
  const handlers = useMemo<ConfigHandlers>(() => {
    const stable: ConfigHandlers = {
      // A rejected move needs a full resync: chessground has already cleared dests and check
      // before `after` fires, so a partial set would leave the board frozen.
      after: (orig, dest, meta) => {
        const accept = latestOnMove.current;
        if (accept && !accept(orig, dest, meta)) {
          api.current?.set(boardConfig(latest.current, latestPrefs.current, stable));
        }
      },
      onShapesChange: (drawn) => latestOnShapesChange.current?.(drawn),
    };
    return stable;
  }, [latest, latestOnMove, latestOnShapesChange, latestPrefs]);

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
  }, [el, handlers, latest, latestPrefs, latestShapes, viewOnly]);

  // coordinates are bound when chessground builds its DOM: changing them needs redrawAll
  const rebuildKey = `${input.coordinates ?? prefs.coordinates}`;
  const lastRebuild = useRef(rebuildKey);

  // `input` and `prefs` are read from the closure, not from refs, so this effect re-runs whenever
  // their identity changes; Board.tsx's `FullBoardInput`-typed memo requires every key, required
  // or optional, to appear in its literal, so a new field on BoardInput cannot go out of sync
  // unnoticed here.
  useEffect(() => {
    const board = api.current;
    if (!board) {
      return;
    }
    const config = boardConfig(input, prefs, handlers);
    // fen only when the pieces differ (a dragged piece is not reset) and never while the
    // promotion picker holds the pawn; an undisplayable fen keeps the previous position
    const displayable = isDisplayableFen(input.fen);
    if (!displayable && isDev()) {
      console.warn('[next-chessground] fen not displayable, keeping previous position:', input.fen);
    }
    const pushFen = displayable && !holdPieces && board.getFen() !== placementOf(input.fen);
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
  }, [handlers, holdPieces, input, prefs, rebuildKey, syncKey]);

  useEffect(() => {
    // fen is a dependency because a new position wipes user-drawn shapes
    api.current?.setShapes(shapes);
    api.current?.setAutoShapes(autoShapes);
  }, [autoShapes, input.fen, shapes]);
};
