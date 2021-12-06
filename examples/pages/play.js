import { useEffect, useRef, useState } from 'react';
import { NextChessground } from 'next-chessground';
import Layout from '../components/Layout';
import { Highlight } from '../components';
import { play } from '../utils/code-samples';

import Stockfish from '../../utils/stockfish';
import engineMove from '../../utils/engine-move';

const Page = () => {
  const ref = useRef();

  const [engine] = useState(new Stockfish());
  useEffect(() => {
    engine.init();
  }, []);

  const [engineTurn, setEngineTurn] = useState(true);
  const onMove = async (chess) => {
    setEngineTurn((prev) => !prev);

    if (engineTurn) {
      if (chess.game_over()) {
        engine.quit();
      }

      await engine.set_position(chess.fen());
      const move = engineMove(await engine.go_time(1000));

      ref.current.board.move(move.from, move.to);
    }
  };

  return (
    <Layout title="Play computer">
      <div className="grid md:grid-cols-2 gap-12">
        <NextChessground ref={ref} onMove={onMove} />
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{play}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
