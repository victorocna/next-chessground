import { useEffect } from 'react';
import { useChessContext } from '../common/ChessContext';
import FeedbackIcon from '../common/FeedbackIcon';
import MoveList from '../common/MoveList';
import { usePuzzle } from '../puzzle';
import DrillBoard from './DrillBoard';
import { useDrillContext } from './DrillContext';

const DrillLayout = ({ pgn, onComplete, showMoves }) => {
  const { moves } = usePuzzle(pgn);

  const { history, initialFen, initialTurn } = useChessContext();
  const { feedback, lastMove, setSolution } = useDrillContext();
  useEffect(() => setSolution(moves), [moves]);

  return (
    <>
      <div className="relative w-full">
        <DrillBoard fen={initialFen} moves={moves} onComplete={onComplete} />
        <FeedbackIcon firstTurn={initialTurn} feedback={feedback} lastMove={lastMove} />
      </div>
      {showMoves && <MoveList history={history} initialFen={initialFen} />}
    </>
  );
};

export default DrillLayout;
