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
import toDests from '../utils/to-dests';

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
    const shouldAutoPromote = metadata?.autoPromote === true;
    
    const promotionPiece = shouldAutoPromote
      ? metadata.promotion || 'q'
      : promotion;

    const move = onMove(from, to, promotionPiece);
    if (!move) {
      // Show promotion modal only for normal user moves
      if (!shouldAutoPromote) {
        show();
        return false;
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

  const makeMove = async (from, to, options) => {
    if (typeof options === 'string') {
      // Direct promotion piece specified - use as-is without auto-promotion
      return onMove(from, to, options);
    } else if (typeof options === 'object') {
      // Options object provided - pass through to handleMove
      return await handleMove(from, to, options);
    } else {
      // No third parameter - regular move
      return onMove(from, to);
    }
  };

  useImperativeHandle(ref, () => ({
    board: boardRef.current?.board,
    chess,
    undo: onUndo,
    move: makeMove,
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
