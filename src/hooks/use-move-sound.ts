import { useEffect, useRef } from 'react';
import type { Key } from '../board/types';
import { placementOf } from '../rules/position';
import { useBoardSound } from './use-board-sound';

/**
 * Plays the move clip when the pieces change and a last move is set: own, opponent, engine
 * and history steps alike. Silent on mount, on a new game (no last move), on flip and on
 * preference changes.
 */
export const useMoveSound = (fen: string, lastMove: [Key, Key] | null): void => {
  const { play } = useBoardSound();
  const placement = placementOf(fen);
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const before = previous.current;
    previous.current = placement;
    if (before !== null && before !== placement && lastMove) {
      play();
    }
  }, [placement, lastMove, play]);
};
