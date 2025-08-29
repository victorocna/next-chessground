import { PuzzleLayout } from '../chess/puzzle';
import MoveList from '../chess/puzzle/MoveList';
import { PuzzleProvider } from '../chess/puzzle/PuzzleContext';
import { Layout } from '../components';

const Page = () => {
  const pgn = [
    '[Event "Alternative moves"]',
    '[FEN "3Q4/5K1k/8/6q1/8/8/8/8 w - - 0 1"]',
    '[SetUp "1"]',
    '',
    '1. Qxg5 Kh8 2. Qg8# (2. Qg7#) (2. Qh4#) (2. Qh5#) (2. Qh6#) *',
  ].join('\n');

  return (
    <Layout title="Chess puzzle">
      <div className="grid md:grid-cols-2 gap-12">
        <PuzzleProvider>
          <PuzzleLayout pgn={pgn} />
          <MoveList />
        </PuzzleProvider>
      </div>
    </Layout>
  );
};

export default Page;
