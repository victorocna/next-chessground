import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  Color,
  Dests,
  Key,
  Move,
  MoveMetadata,
  PlayerColor,
  PromotionRole,
  Variant,
} from '../board/types';
import { boardState } from '../rules/board-state';
import { moveFrom, uciMove } from '../rules/moves';
import { INITIAL_FEN, readPosition } from '../rules/position';
import { isPromotionAt } from '../rules/promotion';

export interface UseChessBoardOptions {
  fen?: string;
  variant?: Variant;
  playerColor?: PlayerColor;
  locked?: boolean;
  premove?: boolean;
  onMove?: (move: Move) => void;
}

export interface PromotionState {
  color: Color;
  dest: Key;
  onPick: (role: PromotionRole) => void;
  onCancel: () => void;
}

export interface UseChessBoardResult {
  boardProps: {
    fen: string;
    turnColor: Color;
    check: Color | false;
    dests: Dests;
    movableColor?: PlayerColor;
    premovable: boolean;
    holdPieces: boolean;
    syncKey: number;
    onMove: (orig: Key, dest: Key, meta: MoveMetadata) => boolean;
  };
  promotion: PromotionState | null;
  play: (uci: string) => boolean;
  turnColor: Color;
  isOver: boolean;
}

interface Pending {
  color: Color;
  from: Key;
  to: Key;
  fen: string;
}

const isDev = (): boolean =>
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

/**
 * Everything chess-derived for a Board: legal targets, turn, check, premove state, the
 * promotion picker and the snap-back counter. The caller owns the position and receives
 * validated moves through `onMove`.
 */
export const useChessBoard = ({
  fen = INITIAL_FEN,
  variant = 'standard',
  playerColor,
  locked = false,
  premove = true,
  onMove,
}: UseChessBoardOptions): UseChessBoardResult => {
  const [pending, setPending] = useState<Pending | null>(null);
  const [syncKey, setSyncKey] = useState(0);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const position = useMemo(() => readPosition(fen, variant), [fen, variant]);
  const isLocked = locked || pending !== null;
  const state = useMemo(
    () => boardState({ fen, variant, playerColor, locked: isLocked, premove }),
    [fen, variant, playerColor, isLocked, premove]
  );

  const emit = useCallback((move: Move | null): boolean => {
    if (!move) {
      return false;
    }
    onMoveRef.current?.(move);
    return true;
  }, []);

  const cancel = useCallback(() => {
    setPending(null);
    setSyncKey((key) => key + 1);
  }, []);

  // A frozen board or a position change under the picker discards the pending promotion
  useEffect(() => {
    if (pending && (locked || pending.fen !== fen)) {
      cancel();
    }
  }, [pending, locked, fen, cancel]);

  const handleMove = useCallback(
    (orig: Key, dest: Key, meta: MoveMetadata): boolean => {
      const pos = position.pos;
      if (!pos) {
        return false;
      }
      if (isPromotionAt(pos, orig, dest)) {
        if (meta.premove) {
          return emit(moveFrom(pos, variant, orig, dest, 'queen'));
        }
        setPending({ color: pos.turn, from: orig, to: dest, fen });
        return true;
      }
      return emit(moveFrom(pos, variant, orig, dest));
    },
    [position, variant, fen, emit]
  );

  const promotion = useMemo<PromotionState | null>(() => {
    const pos = position.pos;
    if (!pending || !pos) {
      return null;
    }
    return {
      color: pending.color,
      dest: pending.to,
      onPick: (role) => {
        const move = moveFrom(pos, variant, pending.from, pending.to, role);
        setPending(null);
        if (!emit(move)) {
          setSyncKey((key) => key + 1);
        }
      },
      onCancel: cancel,
    };
  }, [pending, position, variant, emit, cancel]);

  const play = useCallback(
    (uci: string): boolean => {
      if (pending) {
        setPending(null);
      }
      const ok = emit(uciMove(fen, uci, variant));
      if (!ok && isDev()) {
        console.warn('[next-chessground] move rejected:', uci, fen);
      }
      return ok;
    },
    [pending, fen, variant, emit]
  );

  return {
    boardProps: {
      fen,
      turnColor: state.turnColor,
      check: state.check,
      dests: state.dests,
      movableColor: state.movableColor,
      premovable: state.premovable,
      holdPieces: pending !== null,
      syncKey,
      onMove: handleMove,
    },
    promotion,
    play,
    turnColor: state.turnColor,
    isOver: state.isOver,
  };
};
