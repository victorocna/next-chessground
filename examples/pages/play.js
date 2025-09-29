import { useEffect, useRef, useState } from 'react';
import { NextChessground, Stockfish } from 'next-chessground';
import { Highlight, Layout } from '../components';
import { play } from '../utils/code-samples';
import engineMove from '../../utils/engine-move';
import coffee from '../lib/coffee';

const Page = () => {
  const ref = useRef();

  const [engine] = useState(new Stockfish());
  useEffect(() => {
    engine.init();
  }, []);

  const [lastMove, setLastMove] = useState();
  const [engineTurn, setEngineTurn] = useState(true);

  const onMove = async (chess) => {
    setEngineTurn((prev) => !prev);
    setLastMove(null);

    if (engineTurn) {
      if (chess.isGameOver()) {
        engine.quit();
        return;
      }

      await engine.set_position(chess.fen());
      const move = engineMove(await engine.go_time(1000));

      setLastMove([move.from, move.to]);
      if (ref.current) {
        ref.current.board.move(move.from, move.to);
      }

      if (ref.current && ref.current.playPremove) {
        await coffee(100);
        await ref.current.playPremove();
      }
    }
  };

  return (
    <Layout title="Play computer">
      <div className="grid md:grid-cols-2 gap-12">
        <NextChessground
          premoves={true}
          ref={ref}
          lastMove={lastMove}
          onMove={onMove}
        />
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{play}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
