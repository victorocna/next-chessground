import { useState } from 'react';
import { Chessboard } from 'next-chessground';
import { Demo } from '../components';
import { pawn } from '../utils/code-samples';

const START_FEN = '8/1kPK4/8/8/8/8/8/8 w - - 0 1';

const Page = () => {
  const [fen, setFen] = useState(START_FEN);
  const [lastMove, setLastMove] = useState(null);

  // Push the pawn to c8 and the board asks which piece to promote to
  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  return (
    <Demo
      title="Pawn promotion"
      description="Push the pawn from c7 to c8 and the board asks which piece to promote to."
      code={pawn}
    >
      <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
    </Demo>
  );
};

export default Page;
