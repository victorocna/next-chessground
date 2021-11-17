import React from 'react';
import classnames from 'merge-class-names';
import Chessground from '../lib/Chessground';
import useChessground from '../hooks/use-chessground';

const NextChessground = (props) => {
  const { theme } = useChessground();

  return (
    <div
      className={classnames(
        'chessground',
        theme.highlight && 'highlight',
        theme.board,
        theme.pieces
      )}
    >
      <Chessground {...props} coordinates={theme.coordinates} />
    </div>
  );
};

export default NextChessground;
