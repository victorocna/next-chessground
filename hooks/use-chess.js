import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { initial } from '../utils/fen';

const useChess = (props) => {
  const [fen, setFen] = useState(props.fen || initial);
  const [chess] = useState(new Chess(fen));

  // reinitialize when FEN changes from props
  useEffect(() => {
    setFen(props.fen);
  }, [props.fen]);

  const [lastMove, setLastMove] = useState([]);
  const promotion = props.lastMove && props.lastMove.promotion;

  const turnColor = chess.turn() === 'w' ? 'white' : 'black';
  const [orientation] = useState(props.orientation || turnColor);

  const onMove = (from, to, promotion) => {
    const move = chess.move({ from, to, promotion });
    setLastMove([from, to]);
    setFen(chess.fen());

    return move;
  };

  const onPromote = async (promotion) => {
    const move = onMove(lastMove[0], lastMove[1], promotion);
    if (typeof props.onMove === 'function') {
      await props.onMove(chess);
    }

    return move;
  };

  return {
    chess,
    fen,
    turnColor,
    lastMove,
    orientation,
    promotion,
    onMove,
    onPromote,
  };
};

export default useChess;
