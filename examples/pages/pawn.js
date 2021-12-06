import { NextChessground } from 'next-chessground';
import { Highlight, Layout } from '../components';
import { pawn } from '../utils/code-samples';

const Page = () => (
  <Layout title="Pawn promotion">
    <div className="grid md:grid-cols-2 gap-12">
      <NextChessground fen="8/1kPK4/8/8/8/8/8/8 w - - 0 1" />
      <div>
        <h2 className="text-xl mb-2">Code sample</h2>
        <Highlight>{pawn}</Highlight>
      </div>
    </div>
  </Layout>
);

export default Page;
