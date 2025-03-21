import { flat } from 'chess-moments';
import { NextChessground } from 'next-chessground';
import { Highlight, Layout } from '../components';
import { shapes } from '../utils/code-samples';

const Page = () => {
  const pgn = '1. e4 { [%csl Gd4,Ge4,Be5,Bd5] }';
  const moments = flat(pgn);
  const current = moments[1];

  return (
    <Layout title="Shapes">
      <div className="grid md:grid-cols-2 gap-12">
        <NextChessground fen={current.fen} shapes={current.shapes} />
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{shapes}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
