import { last } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { useChessContext } from '../common/ChessContext';
import { goodMove } from '../functions/puzzle-helpers';

const PuzzleContext = createContext();

export const PuzzleProvider = ({ children }) => {
  // Chess context
  const { isUserTurn, history } = useChessContext();

  // Puzzle states
  const [solution, setSolution] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // Puzzle alternative solutions
  const [alts, setAlts] = useState([]);

  // Update feedback and lastMove when history changes
  useEffect(() => {
    if (isUserTurn) {
      const feedback = goodMove(history, solution) ? 'success' : 'error';
      setFeedback(feedback);
      const lastMove = last(history)?.to;
      setLastMove(lastMove);
    } else {
      setFeedback(null);
      setLastMove(null);
    }
  }, [history]);

  const value = {
    solution,
    setSolution,
    feedback,
    lastMove,
    alts,
    setAlts,
  };

  return <PuzzleContext.Provider value={value}>{children}</PuzzleContext.Provider>;
};

export const usePuzzleContext = () => {
  const context = useContext(PuzzleContext);
  if (!context) {
    throw new Error('usePuzzleContext must be used within a PuzzleProvider');
  }
  return context;
};
