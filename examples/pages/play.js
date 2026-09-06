import { useEffect, useState } from 'react';
import { Chessboard, INITIAL_FEN, toDests, uciMove } from 'next-chessground';
import { Demo } from '../components';
import { play } from '../utils/code-samples';
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

  // The user plays white; the engine answers on the position after every user move.
  // Premoves are on by default and arrive here as an ordinary move once the reply lands.
  const onMove = async (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);

    if (!engine || isOver(move.fen)) {
      engine?.quit();
      return;
    }

    await engine.set_position(move.fen);
    const uci = engineMove(await engine.go_time(1000));
    const reply = uci ? uciMove(move.fen, uci) : null;
    if (!reply) {
      return;
    }

    setFen(reply.fen);
    setLastMove([reply.from, reply.to]);
    if (isOver(reply.fen)) {
      engine.quit();
    }
  };

  return (
    <Demo title="Play computer" code={play}>
      <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="white" />
    </Demo>
  );
};

export default Page;
