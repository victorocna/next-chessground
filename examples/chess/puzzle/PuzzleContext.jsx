import { last } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { goodMove } from './puzzle-helpers';

const PuzzleContext = createContext();

export const PuzzleProvider = ({ children, index }) => {
  const [history, setHistory] = useState([]);
  const [solution, setSolution] = useState(null);

  const [feedback, setFeedback] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  const [isUserTurn, setIsUserTurn] = useState(true);

  // Reset all state when index changes
  useEffect(() => {
    setHistory([]);
    setFeedback(null);
    setLastMove(null);
    setIsUserTurn(true);
  }, [index]);

  // Add a move to history
  const saveHistory = (chess) => {
    setHistory(chess.history({ verbose: true }));
  };

  // Update feedback and lastMove when history changes
  useEffect(() => {
    const feedback = goodMove(history, solution) ? 'success' : 'error';
    // Only show feedback for odd moves
    if (history.length % 2 === 1) {
      setFeedback(feedback);
      setLastMove(last(history)?.to);
      setIsUserTurn(false);
    } else {
      setFeedback(null);
      setLastMove(null);
      setIsUserTurn(true);
    }
  }, [history]);

  const value = {
    history,
    saveHistory,
    solution,
    setSolution,
    feedback,
    lastMove,
    isUserTurn,
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
