import { useEffect } from 'react';
import { useChessContext } from '../common/ChessContext';
import FeedbackIcon from '../common/FeedbackIcon';
import MoveList from '../common/MoveList';
import PuzzleBoard from './PuzzleBoard';
import { usePuzzleContext } from './PuzzleContext';
import usePuzzle from './use-puzzle';

const PuzzleLayout = ({ pgn, onComplete, showMoves }) => {
  const { moves, firstTurn, initialFen } = usePuzzle(pgn);

  const { history } = useChessContext();
  const { feedback, lastMove, setSolution } = usePuzzleContext();
  useEffect(() => setSolution(moves), [moves]);

  return (
    <>
      <div className="relative w-full">
        <PuzzleBoard fen={initialFen} moves={moves} onComplete={onComplete} />
        <FeedbackIcon firstTurn={firstTurn} feedback={feedback} lastMove={lastMove} />
      </div>
      {showMoves && <MoveList history={history} />}
    </>
  );
};

export default PuzzleLayout;
