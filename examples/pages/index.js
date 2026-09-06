import { useState } from 'react';
import { Chessboard, INITIAL_FEN } from 'next-chessground';
import { BoardControls, BoardSettings, Demo } from '../components';
import { basic } from '../utils/code-samples';

const Page = () => {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [lastMove, setLastMove] = useState(null);
  const [orientation, setOrientation] = useState('white');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };
  const onFlip = () => setOrientation(orientation === 'white' ? 'black' : 'white');

  return (
    <Demo
      title="Basic example"
      code={basic}
      controls={<BoardControls onFlip={onFlip} onSettings={() => setSettingsOpen(true)} />}
    >
      <Chessboard
        fen={fen}
        lastMove={lastMove}
        onMove={onMove}
        orientation={orientation}
        playerColor="both"
      >
        {settingsOpen && <BoardSettings onClose={() => setSettingsOpen(false)} />}
      </Chessboard>
    </Demo>
  );
};

export default Page;
