import { useRef, useState } from 'react';
import { NextChessground } from 'next-chessground';
import { Highlight, Layout } from '../components';
import { undo } from '../utils/code-samples';
import classnames from 'merge-class-names';

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
    <Layout title="Undo last move">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <NextChessground ref={ref} onMove={handleMove} />
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
            <span className="text-sm text-gray-600">Moves: {moveCount}</span>
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
