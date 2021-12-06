const watch = `import { NextChessground, Stockfish, constants } from 'next-chessground';
import { engineMove } from '../../lib';

const Page = () => {
  const ref = useRef();

  const [engine] = useState(new Stockfish());
  useEffect(async () => {
    engine.init();
    await getMove(constants.fen.initial);
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
