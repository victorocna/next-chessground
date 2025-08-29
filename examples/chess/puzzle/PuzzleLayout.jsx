import { useEffect } from 'react';
import FeedbackIcon from './FeedbackIcon';
import PuzzleBoard from './PuzzleBoard';
import { usePuzzleContext } from './PuzzleContext';
import usePuzzle from './use-puzzle';

const PuzzleLayout = ({ pgn, onComplete }) => {
  const { moves, alternatives, firstTurn, initialFen } = usePuzzle(pgn);

  const { setSolution, setAlternatives } = usePuzzleContext();
  useEffect(() => {
    setSolution(moves);
    setAlternatives(alternatives);
  }, [moves, alternatives]);

  return (
    <div className="relative w-full">
      <PuzzleBoard
        fen={initialFen}
        moves={moves}
        alternatives={alternatives}
        onComplete={onComplete}
      />
      <FeedbackIcon firstTurn={firstTurn} />
    </div>
  );
};

export default PuzzleLayout;
