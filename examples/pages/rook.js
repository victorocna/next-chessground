import { useState } from 'react';
import { Chessboard } from 'next-chessground';
import { Demo } from '../components';
import { rook } from '../utils/code-samples';

const START_FEN = '5k2/8/5K2/8/3R4/8/8/8 w - - 0 1';

const Page = () => {
  const [fen, setFen] = useState(START_FEN);
  const [lastMove, setLastMove] = useState(null);

  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  return (
    <Demo title="With rook" code={rook}>
      <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
    </Demo>
  );
};

export default Page;
