import { useState } from 'react';
import { Chessboard, INITIAL_FEN } from 'next-chessground';
import { Highlight, Layout } from '../components';
import { basic } from '../utils/code-samples';

const Page = () => {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [lastMove, setLastMove] = useState(null);

  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  return (
    <Layout title="Basic example">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="w-full max-w-md">
          <Chessboard controls fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
        </div>
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{basic}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
