import { useEffect } from 'react';
import FeedbackIcon from '../common/FeedbackIcon';
import MoveList from '../common/MoveList';
import { usePuzzle } from '../puzzle';
import DrillBoard from './DrillBoard';
import { useDrillContext } from './DrillContext';

const DrillLayout = ({ pgn, onComplete, showMoves }) => {
  const { moves, firstTurn, initialFen } = usePuzzle(pgn);

  const { feedback, lastMove, setSolution, history } = useDrillContext();
  useEffect(() => setSolution(moves), [moves]);

  return (
    <>
      <div className="relative w-full">
        <DrillBoard fen={initialFen} moves={moves} onComplete={onComplete} />
        <FeedbackIcon firstTurn={firstTurn} feedback={feedback} lastMove={lastMove} />
      </div>
      {showMoves && <MoveList history={history} />}
    </>
  );
};

export default DrillLayout;
