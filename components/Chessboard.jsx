import React, { forwardRef, useEffect } from 'react';
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
    // Show promotion modal only when the move is not an undo
    if (!move && !props.isUndo) {
      show();
      return false;
    }

    if (theme.playSounds) {
      audio(theme.sounds);
    }
    // pass the chess object to callback function
    if (typeof props.onMove === 'function') {
      await props.onMove(chess);
    }
  };

  const handlePromotion = async (promotion) => {
    const move = onPromote(promotion);
    if (!move) {
      return false;
    }

    if (theme.playSounds) {
      audio(theme.sounds);
    }
    // pass the chess object to callback function
    if (typeof props.onMove === 'function') {
      await props.onMove(chess);
    }
  };

  useEffect(() => {
    if (typeof props.setPromoting === 'function') {
      props.setPromoting(isOpen);
    }
  }, [isOpen]);

  // pass the current FEN to the parent component
  useEffect(() => {
    if (typeof props.onFenChange === 'function') {
      props.onFenChange(fen);
    }
  }, [fen]);

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
        onPromote={handlePromotion}
      />
    </div>
  );
};

export default forwardRef(Chessboard);
