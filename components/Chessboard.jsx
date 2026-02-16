import classnames from 'merge-class-names';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import useChess from '../hooks/use-chess';
import useChessground from '../hooks/use-chessground';
import useDisclosure from '../hooks/use-disclosure';
import usePremove from '../hooks/use-premove';
import Chessground from '../lib/Chessground';
import audio from '../lib/audio';
import cgProps from '../lib/cg-props';
import isPromotion from '../utils/is-promotion';
import toDests from '../utils/to-dests';
import Promote from './Promote';

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

  const handleMove = async (from, to, metadata) => {
    // Check if a promotion piece is explicitly provided
    const promotionPiece = metadata?.promotion || promotion;

    // Try to make the move with the promotion piece (if any)
    const move = onMove(from, to, promotionPiece);
    if (!move) {
      // Check if this is a promotion move and show the promotion dialog if needed
      const isPromotionMove = isPromotion(chess, from, to);
      if (isPromotionMove && !promotionPiece) {
        show();
      }
      return false;
    }

    if (theme.playSounds) {
      audio(theme.sounds);
    }
    // pass the chess object to callback function
    if (typeof props.onMove === 'function') {
      await props.onMove(chess);
    }

    return true;
  };

  // Initialize premove hook
  const {
    onSetPremove,
    onUnsetPremove,
    onPlayPremove,
    onCancelPremove,
    onPremovePromotion,
  } = usePremove(handleMove);

  const boardRef = useRef();

  const makeMove = async (from, to, promotionPiece) => {
    if (promotionPiece) {
      const metadata = { promotion: promotionPiece };
      return await handleMove(from, to, metadata);
    }
    return await handleMove(from, to);
  };

  const playPremove = async () => {
    // Clear the premove highlight from the board before execution
    if (boardRef.current?.board) {
      boardRef.current.board.cancelPremove();
    }
    return await onPlayPremove();
  };

  useImperativeHandle(ref, () => ({
    board: boardRef.current?.board,
    chess,
    undo: onUndo,
    move: makeMove,
    playPremove,
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

  const premovable = props.premoves
    ? {
        enabled: true,
        showDests: true,
        castle: true,
        events: {
          set: onSetPremove,
          unset: onUnsetPremove,
        },
        promote: onPremovePromotion,
      }
    : { enabled: false };

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
        movable={toDests(chess, orientation, props.premoves)}
        premovable={premovable}
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
