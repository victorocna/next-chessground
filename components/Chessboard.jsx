import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import classnames from 'merge-class-names';
import Chessground from '../lib/Chessground';
import audio from '../lib/audio';
import useChessground from '../hooks/use-chessground';
import useChess from '../hooks/use-chess';
import usePremove from '../hooks/use-premove';
import Promote from './Promote';
import useDisclosure from '../hooks/use-disclosure';
import cgProps from '../lib/cg-props';
import getMovable from '../utils/get-movable';

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
    onUndo,
  } = useChess(props);

  const handleMove = async (from, to) => {
    const move = onMove(from, to, promotion);
    if (!move) {
      show(); // move is a promotion, show the promotion modal
      return false;
    }

    if (theme.playSounds) {
      audio(theme.sounds);
    }
    // pass the chess object to callback function
    if (typeof props.onMove === 'function') {
      await props.onMove(chess);
    }

    return true; // Return success status
  };

  // Initialize premove hook
  const {
    onSetPremove,
    onUnsetPremove,
    onPlayPremove,
    onCancelPremove,
  } = usePremove(handleMove);

  const boardRef = useRef();
  useImperativeHandle(ref, () => ({
    board: boardRef.current?.board,
    undo: onUndo,
    move: onMove,
    playPremove: onPlayPremove,
    cancelPremove: onCancelPremove,
  }));

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
        ref={boardRef}
        coordinates={theme.coordinates}
        onMove={handleMove}
        fen={fen}
        turnColor={turnColor}
        lastMove={lastMove}
        orientation={orientation}
        movable={getMovable(chess, orientation, props.premoves)}
        premovable={
          props.premoves
            ? {
                enabled: true,
                showDests: true,
                castle: true,
                dests: 'always',
                autoPromote: false, // Let our promotion logic handle this
                showAfterMove: true,
                events: {
                  set: onSetPremove,
                  unset: onUnsetPremove,
                },
                current: null,
                visible: true,
              }
            : { enabled: false }
        }
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
