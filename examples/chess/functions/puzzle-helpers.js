import { isEqual, pick } from 'lodash';

const filterMoveKeys = (moves) => {
  return moves.map((move) => pick(move, ['from', 'to']));
};

export const compareMoves = (historyMoves, targetMoves) => {
  const history = filterMoveKeys(historyMoves);
  const solution = filterMoveKeys(targetMoves.slice(0, historyMoves.length));

  return isEqual(history, solution);
};

export const goodMove = (history, moves, alternatives = []) => {
  try {
    if (compareMoves(history, moves)) {
      return true;
    }
    for (const alternative of alternatives) {
      if (compareMoves(history, alternative)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

export const badMove = (history, moves, alternatives = []) => {
  return !goodMove(history, moves, alternatives);
};

export const replyMove = (history, moves, alternatives = []) => {
  try {
    if (compareMoves(history, moves)) {
      return moves[history.length];
    }
    for (const alternative of alternatives) {
      if (compareMoves(history, alternative)) {
        return alternative[history.length];
      }
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const wasSolved = (chess, moves, alternatives = []) => {
  try {
    const history = chess.history({ verbose: true });
    if (compareMoves(history, moves) && history.length >= moves.length) {
      return true;
    }
    for (const alternative of alternatives) {
      if (compareMoves(history, alternative) && history.length >= alternative.length) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

const puzzle = {
  badMove,
  goodMove,
  replyMove,
  wasSolved,
};

export default puzzle;
