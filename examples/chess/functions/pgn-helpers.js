export const getMoveNumber = (fen) => {
  const split = fen.split(' ');
  const side = split[1];
  const fullmove = split[5] * 1;

  return side === 'w' ? fullmove - 1 : fullmove;
};

export const isMoveActive = (current, moment) => {
  try {
    return (
      current.fen === moment.fen && // Compare FEN strings
      current.move === moment.move && // Compare moves
      current.depth === moment.depth // Compare depth
    );
  } catch (err) {
    return false;
  }
};

/**
 * Show move index or not?
 */
export const showMoveIndex = (moment, fen, depth) => {
  if (!moment || !moment.move) {
    return true;
  }

  const side = fen.split(' ')[1];
  if (side === 'b') {
    return true;
  }

  return !!moment.comment || moment.depth > depth;
};

/**
 * Get the move suffix for a given FEN string.
 */
export const getMoveSuffix = (fen) => {
  const side = fen.split(' ')[1];
  const fullmove = fen.split(' ')[5];
  const moveIndex = fullmove - (side === 'w' ? 1 : 0);
  const dots = side === 'w' ? '...' : '.';

  return moveIndex + dots;
};
