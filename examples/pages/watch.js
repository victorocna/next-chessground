import { useEffect, useRef, useState } from 'react';
import { NextChessground } from 'next-chessground';
import Layout from '../components/Layout';
import { Highlight } from '../components';
import { watch } from '../utils/code-samples';

import Stockfish from '../../utils/stockfish';
import engineMove from '../../utils/engine-move';

const Page = () => {
  const ref = useRef();

  const [engine] = useState(new Stockfish());
  useEffect(async () => {
    engine.init();
    await getMove('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  }, []);

  const [lastMove, setLastMove] = useState();

  const getMove = async (fen) => {
    await engine.set_position(fen);
    const move = engineMove(await engine.go_time(1000));

    setLastMove(move);
    if (ref.current) {
      ref.current.board.move(move.from, move.to);
    }
  };

  const onMove = async (chess) => {
    if (chess.game_over()) {
      engine.quit();
    }

    await getMove(chess.fen());
  };

  return (
    <Layout title="Watch computers play">
      <div className="grid md:grid-cols-2 gap-12">
        <NextChessground ref={ref} lastMove={lastMove} onMove={onMove} />
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{watch}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
