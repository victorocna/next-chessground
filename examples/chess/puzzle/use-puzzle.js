import { flat } from 'chess-moments';
import { useMemo } from 'react';

const usePuzzle = (pgn) => {
  // Sanitize PGN
  const sanitizePgn = (pgn) => {
    return pgn.replace(/\{[^}]+\}/g, '').trim();
  };
  const sanitizedPgn = useMemo(() => sanitizePgn(pgn), [pgn]);
  const moments = useMemo(() => flat(sanitizedPgn), [sanitizedPgn]);

  // Moves are mainline moments
  const moves = useMemo(() => {
    return moments.filter((moment) => moment.depth === 1 && moment.move);
  }, [moments]);

  return { moves };
};

export default usePuzzle;
