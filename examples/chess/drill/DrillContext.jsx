import { last } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { useChessContext } from '../common/ChessContext';
import { goodMove } from '../functions/puzzle-helpers';

const DrillContext = createContext();

export const DrillProvider = ({ children, mode: initialMode }) => {
  // Chess context
  const { isUserTurn, history } = useChessContext();

  // Drill states
  const [solution, setSolution] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);

  // Mode: arrows, squares, nohint, retry
  const [mode, setMode] = useState(initialMode || '');

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
    mode,
    setMode,
    solution,
    setSolution,
    feedback,
    lastMove,
    viewOnly,
    setViewOnly,
  };

  return <DrillContext.Provider value={value}>{children}</DrillContext.Provider>;
};

export const useDrillContext = () => {
  const context = useContext(DrillContext);
  if (!context) {
    throw new Error('useDrillContext must be used within a DrillProvider');
  }
  return context;
};
