import { flat } from 'chess-moments';
import { useMemo } from 'react';

const usePuzzle = (pgn) => {
  // Sanitize PGN
  const sanitizePgn = (pgn) => {
    return pgn.replace(/\{[^}]+\}/g, '').trim();
  };
  const sanitizedPgn = useMemo(() => sanitizePgn(pgn), [pgn]);
  const moments = useMemo(() => flat(sanitizedPgn), [sanitizedPgn]);
  const firstMoment = moments[0] || {};

  // Moves are mainline moments
  const moves = useMemo(() => {
    return moments.filter((moment) => moment.depth === 1 && moment.move);
  }, [moments]);

  // Determine the first turn from the initial FEN
  const firstTurn = useMemo(() => {
    return firstMoment.fen ? firstMoment.fen.split(' ')[1] : 'w'; // Default to 'w' if no FEN
  }, [firstMoment]);

  const initialFen = useMemo(() => {
    return firstMoment.fen || '';
  }, [firstMoment]);

  return {
    moves,
    firstTurn,
    initialFen,
  };
};

export default usePuzzle;
