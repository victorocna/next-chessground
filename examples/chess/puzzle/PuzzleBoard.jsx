import delay from 'delay';
import { isFunction } from 'lodash';
import { NextChessground } from 'next-chessground';
import { useEffect, useRef, useState } from 'react';
import { badMove, replyMove, wasSolved } from '../functions/puzzle-helpers';
import { usePuzzleContext } from './PuzzleContext';

const PuzzleBoard = ({ fen, moves, alternatives, shapes, onComplete }) => {
  const ref = useRef();
  const [viewOnly, setViewOnly] = useState(false);

  const { saveHistory, isUserTurn } = usePuzzleContext();

  // Reset internal state when the puzzle FEN changes
  useEffect(() => {
    setViewOnly(false);
  }, [fen]);

  const handleMove = async (chess) => {
    saveHistory(chess);
    await delay(300);

    // Check if the user's move is incorrect
    const history = chess.history({ verbose: true });
    if (badMove(history, moves, alternatives)) {
      await delay(800);

      if (isFunction(ref?.current?.undo)) {
        return ref.current.undo();
      }
    }

    // Check if the puzzle has been solved with this move
    if (wasSolved(chess, moves, alternatives)) {
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
    const nextMove = replyMove(history, moves, alternatives);
    if (nextMove && isFunction(ref?.current?.move)) {
      ref.current.move(nextMove?.from, nextMove?.to);
    }
  };

  return (
    <NextChessground
      ref={ref}
      fen={fen}
      viewOnly={viewOnly}
      onMove={handleMove}
      drawable={false}
      shapes={shapes}
    />
  );
};

export default PuzzleBoard;
