import { ChessProvider } from '../../chess/common/ChessContext';
import { DrillProvider } from '../../chess/drill/DrillContext';
import DrillLayout from '../../chess/drill/DrillLayout';
import DrillMode from '../../chess/drill/DrillMode';
import { extractFen } from '../../chess/functions/fen-helpers';
import { Layout, PgnFileLoader } from '../../components';
import { useLocalPgn } from '../../hooks';

const Page = () => {
  const { pgn, setPgn, key, rerender } = useLocalPgn();
  const Button = <PgnFileLoader rerender={rerender} onPgnLoad={setPgn} />;

  return (
    <Layout key={key} title="Chess drills" button={Button}>
      <ChessProvider fen={extractFen(pgn)}>
        <DrillProvider mode="arrows">
          <div className="grid md:grid-cols-2 gap-12">
            <DrillLayout pgn={pgn} showMoves={true} />
          </div>
          <DrillMode />
        </DrillProvider>
      </ChessProvider>
    </Layout>
  );
};

export default Page;
