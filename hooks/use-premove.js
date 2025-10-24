import { useRef, useCallback } from 'react';

const usePremove = (handleMove) => {
  const currentPremove = useRef(null);

  // Handler for when a premove is set by Chessground
  const onSetPremove = useCallback((orig, dest, metadata) => {
    currentPremove.current = {
      orig,
      dest,
      promotion: metadata?.promotion || null,
    };
  }, []);

  // Handler for when a premove is unset by Chessground
  const onUnsetPremove = useCallback(() => {
    currentPremove.current = null;
  }, []);

  // Handler for premove promotions - always promote to queen
  const onPremovePromotion = useCallback(() => {
    return 'q';
  }, []);

  // Execute the stored premove through game logic
  const onPlayPremove = useCallback(async () => {
    if (currentPremove.current) {
      const { orig, dest, promotion } = currentPremove.current;

      // Store the premove data before we clear it
      const premoveData = { orig, dest, promotion };

      currentPremove.current = null;

      const metadata = {
        autoPromote: true,
        promotion: premoveData.promotion || 'q',
      };

      const success = await handleMove(
        premoveData.orig,
        premoveData.dest,
        metadata
      );
      return success;
    }
    return false;
  }, [handleMove]);

  // Cancel the current premove
  const onCancelPremove = useCallback(() => {
    if (currentPremove.current) {
      currentPremove.current = null;
      return true;
    }
    return false;
  }, []);

  return {
    onSetPremove,
    onUnsetPremove,
    onPlayPremove,
    onCancelPremove,
    onPremovePromotion,
  };
};

export default usePremove;
