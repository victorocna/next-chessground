import React, { forwardRef } from 'react';
import classnames from 'merge-class-names';
import Chessground from '../lib/Chessground';
import audio from '../lib/audio';
import useChessground from '../hooks/use-chessground';
import toDests from '../utils/to-dests';
import useChess from '../hooks/use-chess';
import Promote from './Promote';
import useDisclosure from '../hooks/use-disclosure';
import cgProps from '../lib/cg-props';

const Chessboard = (props, ref) => {
  const { theme } = useChessground();
  const { isOpen, show, hide } = useDisclosure();

  const {
    chess,
    fen,
    turnColor,
    lastMove,
    orientation,
    promotion,
    onMove,
    onPromote,
  } = useChess(props);

  const handleMove = async (from, to) => {
    const move = onMove(from, to, promotion);
    if (!move) {
      show();
    }

    if (theme.playSounds) {
      audio(theme.sounds);
    }
    // pass the chess object to callback function
    if (typeof props.onMove === 'function') {
      await props.onMove(chess);
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
        ref={ref}
        coordinates={theme.coordinates}
        onMove={handleMove}
        fen={fen}
        turnColor={turnColor}
        lastMove={lastMove}
        orientation={orientation}
        movable={toDests(chess)}
        {...cgProps(props)}
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

export default forwardRef(Chessboard);
