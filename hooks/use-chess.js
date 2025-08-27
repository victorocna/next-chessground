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
    setLastMove([from, to]);
    try {
      const move = chess.move({ from, to, promotion });
      setFen(chess.fen());
      return move;
    } catch {
      return false;
    }
  };

  const onPromote = (promotion) => {
    const move = onMove(lastMove[0], lastMove[1], promotion);
    return move;
  };

  const onUndo = () => {
    const undone = chess.undo();
    if (undone) {
      setFen(chess.fen());
      setLastMove([]);
      return undone;
    }
    return null;
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
    onUndo,
  };
};

export default useChess;
