import { useEffect, useState } from 'react';
import { Chessboard, INITIAL_FEN, toDests, uciMove } from 'next-chessground';
import { Highlight, Layout } from '../components';
import { watch } from '../utils/code-samples';
import { engineMove, Stockfish } from '../lib';

// No legal move left: checkmate or stalemate
const isOver = (fen) => toDests(fen).size === 0;

const Page = () => {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [lastMove, setLastMove] = useState(null);
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    const stockfish = new Stockfish();
    let alive = true;
    stockfish.init().then(() => {
      if (alive) {
        setEngine(stockfish);
      }
    });

    return () => {
      alive = false;
      stockfish.quit();
    };
  }, []);

  // Nobody may move the pieces: `playerColor` is left out and the engine plays both sides,
  // one position at a time. Every new fen runs this effect again.
  useEffect(() => {
    if (!engine || isOver(fen)) {
      return;
    }
    let cancelled = false;

    const think = async () => {
      await engine.set_position(fen);
      const uci = engineMove(await engine.go_time(1000));
      const move = uci ? uciMove(fen, uci) : null;
      if (cancelled || !move) {
        return;
      }
      setFen(move.fen);
      setLastMove([move.from, move.to]);
    };
    think();

    return () => {
      cancelled = true;
    };
  }, [engine, fen]);

  return (
    <Layout title="Watch computers play">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="w-full max-w-md">
          <Chessboard fen={fen} lastMove={lastMove} />
        </div>
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{watch}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
