import { PuzzleProvider } from './PuzzleContext';
import PuzzleLayout from './PuzzleLayout';

const Puzzle = ({ pgn, onComplete }) => {
  return (
    <PuzzleProvider>
      <PuzzleLayout pgn={pgn} onComplete={onComplete} />
    </PuzzleProvider>
  );
};

export default Puzzle;
