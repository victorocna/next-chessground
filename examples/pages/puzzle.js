import { ChessProvider } from '../chess/common/ChessContext';
import { extractFen } from '../chess/functions/fen-helpers';
import { PuzzleLayout } from '../chess/puzzle';
import { PuzzleProvider } from '../chess/puzzle/PuzzleContext';
import { Layout, PgnFileLoader } from '../components';
import { useLocalPgn } from '../hooks';

const Page = () => {
  const { pgn, setPgn, key, rerender } = useLocalPgn();
  const Button = <PgnFileLoader rerender={rerender} onPgnLoad={setPgn} />;

  return (
    <Layout key={key} title="Chess puzzles" button={Button}>
      <ChessProvider fen={extractFen(pgn)}>
        <PuzzleProvider>
          <div className="grid md:grid-cols-2 gap-12">
            <PuzzleLayout pgn={pgn} showMoves={true} />
          </div>
        </PuzzleProvider>
      </ChessProvider>
    </Layout>
  );
};

export default Page;
