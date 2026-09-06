const pawn = `import { useState } from 'react';
import { Chessboard } from 'next-chessground';

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
    <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
  );
};

export default Page;`;

export default pawn;
