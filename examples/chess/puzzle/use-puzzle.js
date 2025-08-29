import { tree as chessTree, flat } from 'chess-moments';
import { useMemo } from 'react';

const usePuzzle = (pgn) => {
  // Sanitize PGN
  const sanitizePgn = (pgn) => {
    return pgn.replace(/\{[^}]+\}/g, '').trim();
  };
  const sanitizedPgn = sanitizePgn(pgn);

  // get only the main-line moves (depth === 1)
  const moves = useMemo(() => {
    const moments = flat(sanitizedPgn);
    return moments.filter((m) => m.depth === 1 && m.move);
  }, [sanitizedPgn]);

  // Chess tree from PGN
  const tree = useMemo(() => chessTree(sanitizedPgn), [sanitizedPgn]);

  const allAlts = useMemo(() => {
    const lines = [];
    for (let i = 1; i < tree.length; i++) {
      const line = tree[i].filter((moment) => moment.move);
      if (line.length) {
        lines.push(line);
      }
    }
    return lines;
  }, [tree]);

  const alternatives = useMemo(() => {
    return allAlts.map((path) => path.filter((_, i) => i % 2 === 0));
  }, [allAlts]);

  // Determine the first turn from the initial FEN
  const firstTurn = useMemo(() => {
    const initialFen = tree[0]?.[0]?.fen;
    return initialFen ? initialFen.split(' ')[1] : 'w'; // Default to 'w' if no FEN
  }, [tree]);

  const initialFen = useMemo(() => {
    return tree[0]?.[0]?.fen || '';
  }, [tree]);

  return {
    tree,
    moves,
    alternatives,
    firstTurn,
    initialFen,
  };
};

export default usePuzzle;
