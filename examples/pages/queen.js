import { useState } from 'react';
import { Chessboard } from 'next-chessground';
import { Highlight, Layout } from '../components';
import { queen } from '../utils/code-samples';

const START_FEN = '8/8/8/8/6q1/5k2/8/7K b - - 0 1';

const Page = () => {
  const [fen, setFen] = useState(START_FEN);
  const [lastMove, setLastMove] = useState(null);

  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  return (
    <Layout title="With queen">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="w-full max-w-md">
          <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
        </div>
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{queen}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
