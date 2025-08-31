import { createContext, useContext, useEffect, useState } from 'react';

const DrillContext = createContext();

export const DrillProvider = ({ children, key, mode: initialMode }) => {
  // Mode: arrows, squares, nohint, retry
  const [mode, setMode] = useState(initialMode || '');

  // Current chess board FEN
  const [currentFen, setCurrentFen] = useState('');
  // Current turn logic
  const [currentTurn, setCurrentTurn] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(true);
  useEffect(() => {
    setIsUserTurn(() => currentTurn === 'w');
  }, [currentTurn]);

  const [history, setHistory] = useState([]);
  const [solution, setSolution] = useState(null);

  const [feedback, setFeedback] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // Reset all state when key changes
  useEffect(() => {
    setHistory([]);
    setFeedback(null);
    setLastMove(null);
    setIsUserTurn(true);
  }, [key]);

  // Add a move to history
  const saveHistory = (chess) => {
    setCurrentFen(chess.fen());
    setCurrentTurn(chess.turn());
    setHistory(chess.history({ verbose: true }));
  };

  const value = {
    mode,
    currentFen,
    setMode,
    history,
    saveHistory,
    solution,
    setSolution,
    feedback,
    lastMove,
    isUserTurn,
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
