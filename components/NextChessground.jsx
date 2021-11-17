import React from 'react';
import classnames from 'merge-class-names';
import Chessground from '../lib/Chessground';
import audio from '../lib/audio';
import useChessground from '../hooks/use-chessground';

const NextChessground = (props) => {
  const { theme } = useChessground();
  const handleMove = () => {
    if (typeof props.onMove === 'function') {
      props.onMove();
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
      />
    </div>
  );
};

export default NextChessground;
