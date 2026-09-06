import { flat } from 'chess-moments';
import { Chessboard } from 'next-chessground';
import { Demo } from '../components';
import { shapes } from '../utils/code-samples';

const Page = () => {
  const pgn = '1. e4 { [%csl Gd4,Ge4,Be5,Bd5] }';
  const moments = flat(pgn);
  const current = moments[1];

  return (
    <Demo title="Shapes" code={shapes}>
      <Chessboard fen={current.fen} shapes={current.shapes} viewOnly />
    </Demo>
  );
};

export default Page;
