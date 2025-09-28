import { useRef, useCallback } from 'react';

const usePremove = (handleMove) => {
  const currentPremove = useRef(null);

  // Handler for when a premove is set by Chessground
  const onSetPremove = useCallback((orig, dest) => {
    currentPremove.current = { orig, dest };
  }, []);

  // Handler for when a premove is unset by Chessground
  const onUnsetPremove = useCallback(() => {
    currentPremove.current = null;
  }, []);

  // Execute the stored premove through game logic
  const onPlayPremove = useCallback(async () => {
    if (currentPremove.current) {
      const { orig, dest } = currentPremove.current;

      const success = await handleMove(orig, dest);
      if (success) {
        currentPremove.current = null;
      }
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
  };
};

export default usePremove;
