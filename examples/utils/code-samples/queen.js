const queen = `import { useState } from 'react';
import { Chessboard } from 'next-chessground';

const START_FEN = '8/8/8/8/6q1/5k2/8/7K b - - 0 1';

const Page = () => {
  const [fen, setFen] = useState(START_FEN);
  const [lastMove, setLastMove] = useState(null);

  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  return (
    <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
  );
};

export default Page;`;

export default queen;
