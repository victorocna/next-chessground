const play = `import NextChessground from 'next-chessground';

import Stockfish from '../../utils/stockfish';
import engineMove from '../../utils/engine-move';

const Page = () => {
  const ref = useRef();

  const [engine] = useState(new Stockfish());
  useEffect(() => {
    engine.init();
  }, []);

  const [lastMove, setLastMove] = useState();
  const [engineTurn, setEngineTurn] = useState(true);

  const onMove = async (chess) => {
    setEngineTurn((prev) => !prev);

    if (engineTurn) {
      if (chess.game_over()) {
        engine.quit();
      }

      await engine.set_position(chess.fen());
      const move = engineMove(await engine.go_time(1000));

      setLastMove(move);
      if (ref.current) {
        ref.current.board.move(move.from, move.to);
      }
    }
  };

  return <NextChessground ref={ref} lastMove={lastMove} onMove={onMove} />;
};

export default Page;`;

export default play;
