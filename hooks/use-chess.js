import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { initialFen } from '../utils/constants';

const useChess = (props) => {
  const [fen, setFen] = useState(props.fen || initialFen);
  const [chess, setChess] = useState(new Chess(fen));

  // reinitialize when FEN changes from props
  useEffect(() => {
    if (props.fen) {
      setFen(props.fen);
      setChess(new Chess(props.fen));
      setLastMove([]);
    }
  }, [props.fen, props.reset]);

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
