import { DrillProvider } from '../chess/drill/DrillContext';
import DrillLayout from '../chess/drill/DrillLayout';
import DrillMode from '../chess/drill/DrillMode';
import { Layout } from '../components';

const Page = () => {
  const pgn = [
    '[Event "Spanish Opening"]',
    '[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]',
    '[SetUp "1"]',
    '',
    '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 *',
  ].join('\n');

  return (
    <Layout title="Chess drills">
      <DrillProvider mode="arrows">
        <div className="grid md:grid-cols-2 gap-12">
          <DrillLayout pgn={pgn} showMoves={true} />
        </div>
        <DrillMode />
      </DrillProvider>
    </Layout>
  );
};

export default Page;
