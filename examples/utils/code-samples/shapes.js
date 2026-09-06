const shapes = `import { flat } from 'chess-moments';
import { Chessboard } from 'next-chessground';

const Page = () => {
  const pgn = '1. e4 { [%csl Gd4,Ge4,Be5,Bd5] }';
  const moments = flat(pgn);
  const current = moments[1];

  return (
    <Chessboard fen={current.fen} shapes={current.shapes} viewOnly />
  );
};

export default Page;`;

export default shapes;
