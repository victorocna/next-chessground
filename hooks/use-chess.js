import { useState } from 'react';
import { Chess } from 'chess.js';

const useChess = (props) => {
  const [fen, setFen] = useState(props.fen || '');
  const [chess] = useState(new Chess(fen));
  const [lastMove, setLastMove] = useState([]);

  const turnColor = chess.turn() === 'w' ? 'white' : 'black';
  const [orientation] = useState(props.orientation || turnColor);

  const onMove = (from, to, promotion) => {
    const move = chess.move({ from, to, promotion });
    setLastMove([from, to]);
    setFen(chess.fen());

    return move;
  };

  const onPromote = (promotion) => {
    return onMove(lastMove[0], lastMove[1], promotion);
  };

  return {
    chess,
    fen,
    turnColor,
    lastMove,
    orientation,
    onMove,
    onPromote,
  };
};

export default useChess;
