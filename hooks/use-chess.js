import { useState } from 'react';
import { Chess } from 'chess.js';

const useChess = () => {
  const [fen, setFen] = useState('');
  const [chess] = useState(new Chess());

  const onMove = (from, to) => {
    chess.move({ from, to });
    setFen(chess.fen());
  };
  const turnColor = chess.turn() === 'w' ? 'white' : 'black';

  return {
    chess,
    fen,
    turnColor,
    onMove,
  };
};

export default useChess;
