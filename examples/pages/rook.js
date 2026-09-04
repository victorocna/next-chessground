import { useState } from 'react';
import { Chessboard } from 'next-chessground';
import { Highlight, Layout } from '../components';
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
    <Layout title="With rook">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="w-full max-w-md">
          <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
        </div>
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{rook}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
