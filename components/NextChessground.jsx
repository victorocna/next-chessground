import React from 'react';
import classnames from 'merge-class-names';
import Chessground from '../lib/Chessground';
import audio from '../lib/audio';
import useChessground from '../hooks/use-chessground';
import toDests from '../utils/to-dests';
import useChess from '../hooks/use-chess';
import Promote from './Promote';
import useDisclosure from '../hooks/use-disclosure';

const NextChessground = (props) => {
  const { theme } = useChessground();
  const { isOpen, show, hide } = useDisclosure();

  const { chess, fen, turnColor, onMove, onPromote } = useChess();
  const handleMove = (from, to) => {
    const move = onMove(from, to);
    if (!move) {
      show();
    }

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
      <Promote
        isOpen={isOpen}
        hide={hide}
        color={turnColor}
        onPromote={onPromote}
      />
    </div>
  );
};

export default NextChessground;
