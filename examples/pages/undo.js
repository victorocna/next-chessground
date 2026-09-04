import { useState } from 'react';
import { Chessboard, INITIAL_FEN } from 'next-chessground';
import classnames from 'merge-class-names';
import { Highlight, Layout } from '../components';
import { undo } from '../utils/code-samples';

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
    <Layout title="Undo last move">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <div className="w-full max-w-md">
            <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={classnames(
                'px-4 py-2 rounded font-medium transition-colors',
                canUndo
                  ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              Undo Last Move
            </button>
            <span className="text-sm text-gray-600">Moves: {history.length}</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{undo}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
