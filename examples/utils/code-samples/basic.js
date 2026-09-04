const basic = `import { useState } from 'react';
import { Chessboard, INITIAL_FEN } from 'next-chessground';

const Page = () => {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [lastMove, setLastMove] = useState(null);

  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  return (
    <Chessboard controls fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
  );
};

export default Page;`;

export default basic;
