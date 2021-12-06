const watch = `import NextChessground from 'next-chessground';

import Stockfish from '../../utils/stockfish';
import engineMove from '../../utils/engine-move';

const Page = () => {
  const ref = useRef();

  const [engine] = useState(new Stockfish());
  useEffect(async () => {
    engine.init();
    await getMove('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  }, []);

  const [lastMove, setLastMove] = useState();

  const getMove = async (fen) => {
    await engine.set_position(fen);
    const move = engineMove(await engine.go_time(1000));

    setLastMove(move);
    if (ref.current) {
      ref.current.board.move(move.from, move.to);
    }
  };

  const onMove = async (chess) => {
    if (chess.game_over()) {
      engine.quit();
    }

    await getMove(chess.fen());
  };

  return <NextChessground ref={ref} lastMove={lastMove} onMove={onMove} />;
};

export default Page;`;

export default watch;
