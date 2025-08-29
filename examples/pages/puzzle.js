import { Puzzle } from '../chess';
import { Layout } from '../components';

const Page = () => {
  const pgn = [
    '[Event "Alternative moves"]',
    '[FEN "3Q4/5K1k/8/6q1/8/8/8/8 w - - 0 1"]',
    '[SetUp "1"]',
    '',
    '1. Qxg5 Kh8 2. Qg8# (2. Qg7#) *',
  ].join('\n');

  return (
    <Layout title="Puzzles">
      <div className="grid md:grid-cols-2 gap-12">
        <Puzzle pgn={pgn} />
      </div>
    </Layout>
  );
};

export default Page;
