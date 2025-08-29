import { useEffect } from 'react';
import FeedbackIcon from './FeedbackIcon';
import PuzzleBoard from './PuzzleBoard';
import { usePuzzleContext } from './PuzzleContext';
import usePuzzle from './use-puzzle';

const PuzzleLayout = ({ pgn, onComplete }) => {
  const { moves, firstTurn, initialFen } = usePuzzle(pgn);

  const { setSolution } = usePuzzleContext();
  useEffect(() => setSolution(moves), [moves]);

  return (
    <div className="relative w-full">
      <PuzzleBoard fen={initialFen} moves={moves} onComplete={onComplete} />
      <FeedbackIcon firstTurn={firstTurn} />
    </div>
  );
};

export default PuzzleLayout;
