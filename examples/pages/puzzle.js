import { Puzzle } from '../chess';
import { Layout } from '../components';

const Page = () => {
  const pgn = [
    '[Event "Alternative moves: Chapter 1"]',
    '[FEN "7k/5K2/8/8/6Q1/8/8/8 w - - 0 1"]',
    '[SetUp "1"]',
    '',
    '1. Qg8# (1. Qg7#) *',
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
