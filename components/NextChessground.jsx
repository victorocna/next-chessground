import React from 'react';
import classnames from 'merge-class-names';
import Chessground from '../lib/Chessground';
import audio from '../lib/audio';
import useChessground from '../hooks/use-chessground';
import toDests from '../utils/to-dests';
import useChess from '../hooks/use-chess';

const NextChessground = (props) => {
  const { theme } = useChessground();

  const { chess, fen, turnColor, onMove } = useChess();
  const handleMove = (from, to) => {
    onMove(from, to);

    if (typeof props.onMove === 'function') {
      props.onMove(from, to);
    }
    if (theme.playSounds) {
      audio(theme.sounds);
    }
  };

  return (
    <div
      className={classnames(
        'chessground',
        theme.highlight && 'highlight',
        theme.board,
        theme.pieces
      )}
    >
      <Chessground
        {...props}
        coordinates={theme.coordinates}
        onMove={handleMove}
        fen={fen}
        turnColor={turnColor}
        movable={toDests(chess)}
      />
    </div>
  );
};

export default NextChessground;
