import React from 'react';
import classnames from 'merge-class-names';
import Chessground from '../lib/Chessground';
import audio from '../lib/audio';
import useChessground from '../hooks/use-chessground';
import toDests from '../utils/to-dests';
import useChess from '../hooks/use-chess';
import Promote from './Promote';
import useDisclosure from '../hooks/use-disclosure';

const Chessboard = (props) => {
  const { theme } = useChessground();
  const { isOpen, show, hide } = useDisclosure();

  const {
    chess,
    fen,
    turnColor,
    lastMove,
    orientation,
    onMove,
    onPromote,
  } = useChess(props);
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

  const cgProps = {};
  if (props.viewOnly) {
    cgProps.draggable = false;
    cgProps.movable = { free: false };
  }
  if (props.readOnly) {
    cgProps.draggable = false;
    cgProps.movable = { free: false };
    cgProps.coordinates = false;
  }
  // normalize orientation for Chessground
  if (props.orientation) {
    cgProps.orientation = props.orientation;
    if (cgProps.orientation === 'w') {
      cgProps.orientation = 'white';
    }
    if (cgProps.orientation === 'b') {
      cgProps.orientation = 'black';
    }
  }

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
        coordinates={theme.coordinates}
        onMove={handleMove}
        fen={fen}
        turnColor={turnColor}
        lastMove={lastMove}
        orientation={orientation}
        movable={toDests(chess)}
        {...cgProps}
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

export default Chessboard;
