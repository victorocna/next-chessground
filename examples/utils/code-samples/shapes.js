const basic = `import { tree } from 'chess-moments';
import { NextChessground } from 'next-chessground';

const Page = () => {
  const pgn = '1. e4 { [%csl Gd4,Ge4,Be5,Bd5] }';
  const moments = tree(pgn);
  const current = moments[1];

  return (
    <NextChessground fen={current.fen} shapes={current.shapes} />
  );
};

export default Page;`;

export default basic;
