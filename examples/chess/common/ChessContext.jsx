import { createContext, useContext, useEffect, useState } from 'react';
import { parseFen } from '../functions/fen-helpers';

const ChessContext = createContext();

export const ChessProvider = ({ children, fen }) => {
  // Current chess board FEN
  const [currentFen, setCurrentFen] = useState(fen);

  // Current turn logic
  const initialTurn = parseFen(fen)?.activeColor || 'w';
  const [currentTurn, setCurrentTurn] = useState(initialTurn);
  const [isUserTurn, setIsUserTurn] = useState(true);
  // Check if it's the user's turn
  useEffect(() => {
    setIsUserTurn(() => currentTurn === initialTurn);
  }, [currentTurn]);

  // Game history
  const [history, setHistory] = useState([]);
  // Add a move to history
  const saveHistory = (chess) => {
    setCurrentFen(chess.fen());
    setCurrentTurn(chess.turn());
    setHistory(chess.history({ verbose: true }));
  };

  const value = {
    initialFen: fen,
    initialTurn,
    currentFen,
    isUserTurn,
    history,
    saveHistory,
  };

  return <ChessContext.Provider value={value}>{children}</ChessContext.Provider>;
};

export const useChessContext = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error('useChessContext must be used within a ChessProvider');
  }
  return context;
};
