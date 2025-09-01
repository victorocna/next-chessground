import { ChessProvider } from '../../chess/common/ChessContext';
import { extractFen } from '../../chess/functions/fen-helpers';
import { PgnViewerLayout } from '../../chess/pgn-viewer';
import { Layout, PgnFileLoader } from '../../components';
import { useLocalPgn } from '../../hooks';

const Page = () => {
  const { pgn, setPgn, key, rerender } = useLocalPgn();
  const Button = <PgnFileLoader rerender={rerender} onPgnLoad={setPgn} />;

  return (
    <Layout key={key} title="Chess PGN viewer" button={Button}>
      <ChessProvider fen={extractFen(pgn)}>
        <div className="grid md:grid-cols-2 gap-12">
          <PgnViewerLayout pgn={pgn} />
        </div>
      </ChessProvider>
    </Layout>
  );
};

export default Page;
