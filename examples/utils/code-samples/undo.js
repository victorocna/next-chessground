const undo = `import { useRef, useState } from 'react';
import { NextChessground } from 'next-chessground';

const Page = () => {
  const ref = useRef();
  const [moveCount, setMoveCount] = useState(0);
  const [chess, setChess] = useState(null);

  const handleMove = (chess) => {
    setMoveCount(chess.history().length);
    setChess(chess);
  };

  const handleUndo = () => {
    if (ref.current && ref.current.undo) {
      const undone = ref.current.undo();
      if (undone) {
        setMoveCount(chess.history().length);
      }
    }
  };

  const canUndo = moveCount > 0;

  return (
    <div>
      <NextChessground ref={ref} onMove={handleMove} />
      <button onClick={handleUndo} disabled={!canUndo}>
        Undo Last Move
      </button>
      <span>Moves: {moveCount}</span>
    </div>
  );
};

export default Page;`;

export default undo;
