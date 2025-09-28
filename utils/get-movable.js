import isValidFen from './is-valid-fen';
import { SQUARES } from 'chess.js';

/**
 * Gets the movable configuration for Chessground with premove support
 * @param {*} chess - Chess.js instance
 * @param {string} orientation - Current board orientation ('white' or 'black')
 * @param {boolean} enablePremoves - Whether to enable premoves
 */
const getMovable = (chess, orientation, enablePremoves = false) => {
  if (!isValidFen(chess.fen())) {
    return { free: false };
  }

  const dests = new Map();
  const currentTurn = chess.turn() === 'w' ? 'white' : 'black';

  // Regular legal moves for the current turn
  SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length) {
      dests.set(
        s,
        ms.map((m) => m.to)
      );
    }
  });

  // Basic movable configuration
  const movable = {
    free: false,
    dests,
    color: currentTurn,
  };

  // For premove support, we need to allow the player to select their pieces
  // even when it's not their turn
  if (enablePremoves) {
    // If orientation is set, that means we're playing as that color
    const playerColor = orientation;

    // If it's not the player's turn but premoves are enabled,
    // allow them to select their pieces (but moves will be executed as premoves)
    if (playerColor && playerColor !== currentTurn) {
      // Allow the player to select their own pieces for premoves
      movable.color = playerColor;
    }
  }

  return movable;
};

export default getMovable;
