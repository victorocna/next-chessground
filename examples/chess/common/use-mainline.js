import { mainline } from 'chess-moments';
import { useMemo } from 'react';

const useMainline = (pgn) => {
  const moments = useMemo(() => mainline(pgn), [pgn]);

  // Moves are mainline moments
  const moves = useMemo(() => {
    return moments.filter((moment) => moment.depth === 1 && moment.move);
  }, [moments]);

  return { moves };
};

export default useMainline;
