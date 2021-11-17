import { useState } from 'react';
import { Chess } from 'chess.js';

const useChess = () => {
  const [fen, setFen] = useState('');
  const [lastMove, setLastMove] = useState({ from: '', to: '' });
  const [chess] = useState(new Chess());

  const turnColor = chess.turn() === 'w' ? 'white' : 'black';

  const onMove = (from, to, promotion) => {
    const move = chess.move({ from, to, promotion });
    setLastMove({ from, to });
    setFen(chess.fen());

    return move;
  };
  const onPromote = (promotion) => {
    return onMove(lastMove.from, lastMove.to, promotion);
  };

  return {
    chess,
    fen,
    turnColor,
    lastMove,
    onMove,
    onPromote,
  };
};

export default useChess;
