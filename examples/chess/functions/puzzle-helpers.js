import { isEqual, pick } from 'lodash';

const filterMoveKeys = (moves) => {
  return moves.map((move) => pick(move, ['from', 'to']));
};

/**
 * Compare chess history with full possible solution
 */
export const compareMoves = (historyMoves, targetMoves) => {
  try {
    const history = filterMoveKeys(historyMoves);
    const solution = filterMoveKeys(targetMoves.slice(0, historyMoves.length));

    return isEqual(history, solution);
  } catch {
    return false;
  }
};

/**
 * Check if the current move is correct
 */
export const goodMove = (history, moves) => {
  if (compareMoves(history, moves)) {
    return true;
  }
  return false;
};

/**
 * Check if the current move is incorrect
 */
export const badMove = (history, moves) => {
  return !goodMove(history, moves);
};

/**
 * Get the reply move for the current position
 */
export const replyMove = (history, moves) => {
  if (compareMoves(history, moves)) {
    return moves[history.length];
  }
  return false;
};

/**
 * Check if the puzzle was solved
 */
export const wasSolved = (history, moves) => {
  if (compareMoves(history, moves) && history.length >= moves.length) {
    return true;
  }
  return false;
};
