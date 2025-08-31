/**
 * Get the next moment in the drill based on the current FEN
 */
export const getNextMoment = (moments, currentFen) => {
  try {
    // Find the current moment based on the current FEN
    const currentMoment = moments.find((moment) => moment.fen === currentFen);
    // Get the next move after the current moment
    const nextMomentIndex = moments.indexOf(currentMoment) + 1;
    const nextMoment = moments[nextMomentIndex];

    return nextMoment;
  } catch {
    return null;
  }
};

/**
 * Check if the current drill move is correct
 */
export const checkDrillMove = (moments, currentFen, history) => {
  try {
    const nextMoment = getNextMoment(moments, currentFen);
    const currentMove = history[history.length - 1];
    return nextMoment.move === currentMove;
  } catch {
    return false;
  }
};

/**
 * Get the next shape to draw based on the current drill state
 */
export const getNextShape = (nextMoment, mode, retryCount) => {
  try {
    if (mode === 'arrows') {
      const arrow = {
        orig: nextMoment.from,
        dest: nextMoment.to,
        brush: 'blue',
      };
      return [arrow];
    }
    if (mode === 'squares') {
      const circle = {
        orig: nextMoment.from,
        brush: 'blue',
      };
      return [circle];
    }
    if (mode === 'retry') {
      if (retryCount >= 2) {
        const arrow = {
          orig: nextMoment.from,
          dest: nextMoment.to,
          brush: 'blue',
        };
        return [arrow];
      }
    }
    // Return no shapes for every other mode
    return [];
  } catch {
    return [];
  }
};
