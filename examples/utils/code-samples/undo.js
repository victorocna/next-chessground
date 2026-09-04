const undo = `import { useState } from 'react';
import { Chessboard, INITIAL_FEN } from 'next-chessground';

const Page = () => {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [lastMove, setLastMove] = useState(null);
  // Every position we came from, newest last
  const [history, setHistory] = useState([]);

  const onMove = (move) => {
    setHistory([...history, { fen, lastMove }]);
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  const handleUndo = () => {
    const previous = history[history.length - 1];
    if (!previous) {
      return;
    }
    setFen(previous.fen);
    setLastMove(previous.lastMove);
    setHistory(history.slice(0, -1));
  };

  const canUndo = history.length > 0;

  return (
    <div>
      <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
      <button onClick={handleUndo} disabled={!canUndo}>
        Undo Last Move
      </button>
      <span>Moves: {history.length}</span>
    </div>
  );
};

export default Page;`;

export default undo;
