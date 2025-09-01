import delay from 'delay';
import { isFunction } from 'lodash';
import { NextChessground } from 'next-chessground';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useChessContext } from '../common/ChessContext';
import { getNextMoment, getNextShape } from '../functions/drill-helpers';
import { badMove, replyMove, wasSolved } from '../functions/puzzle-helpers';
import { useDrillContext } from './DrillContext';

const DrillBoard = ({ fen, moves, shapes, onComplete }) => {
  const ref = useRef();
  const [viewOnly, setViewOnly] = useState(false);

  const { currentFen, saveHistory, isUserTurn } = useChessContext();
  const { mode } = useDrillContext();

  // Reset internal state when the puzzle FEN changes
  useEffect(() => {
    setViewOnly(false);
  }, [fen]);

  const handleMove = async (chess) => {
    saveHistory(chess);
    await delay(300);

    // Check if the user's move is incorrect
    const history = chess.history({ verbose: true });
    if (badMove(history, moves)) {
      await delay(800);

      if (isFunction(ref?.current?.undo)) {
        ref.current.undo();
        return saveHistory(chess);
      }
    }

    // Check if the puzzle has been solved with this move
    if (wasSolved(chess, moves)) {
      setViewOnly(true);
      if (isFunction(onComplete)) {
        return onComplete();
      }
    }

    // Check if the game ended unexpectedly
    if (chess.isGameOver()) {
      return setViewOnly(true);
    }

    if (isUserTurn) {
      await handleOpponentMove(chess);
    }
  };

  // Make the opponent's move
  const handleOpponentMove = async (chess) => {
    await delay(800);

    const history = chess.history({ verbose: true });
    const nextMove = replyMove(history, moves);
    if (nextMove && isFunction(ref?.current?.move)) {
      ref.current.move(nextMove?.from, nextMove?.to);
      saveHistory(chess);
    }
  };

  // Shapes logic
  const drillShapes = useMemo(() => {
    if (mode === 'text' || !isUserTurn) {
      return [];
    }
    const nextMoment = getNextMoment(moves, currentFen);
    return getNextShape(nextMoment, mode);
  }, [mode, isUserTurn]);

  // Drawable chessboard prop with shapes that do not dissapear on user interaction
  const drawable = { enabled: false, visible: true, autoShapes: drillShapes };

  return (
    <NextChessground
      ref={ref}
      fen={fen}
      viewOnly={viewOnly}
      onMove={handleMove}
      drawable={drawable}
      shapes={shapes}
    />
  );
};

export default DrillBoard;
