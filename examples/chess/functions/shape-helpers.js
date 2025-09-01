import { Chess } from 'chess.js';

/**
 * Computes an arrow shape based on the current FEN and a move string.
 */
export const getMoveArrow = (fen, moveString) => {
  try {
    if (!fen || !moveString) return null;
    const chess = new Chess(fen);
    const move = chess.move(moveString);
    return {
      orig: move.from,
      dest: move.to,
      brush: 'blue',
    };
  } catch {
    return null;
  }
};
