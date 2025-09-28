import isValidFen from './is-valid-fen';
import { SQUARES } from 'chess.js';

/**
 * @param {*} chess
 * @param {string} orientation
 * @param {boolean} enablePremoves
 */
const toDests = (chess, orientation, enablePremoves = false) => {
  if (!isValidFen(chess.fen())) {
    return { free: false };
  }

  const dests = new Map();
  const currentTurn = chess.turn() === 'w' ? 'white' : 'black';

  SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length) {
      dests.set(
        s,
        ms.map((m) => m.to)
      );
    }
  });

  const movable = {
    color: currentTurn,
    dests,
    free: false,
  };

  // For premoves: allow the player to select their pieces even when it's not their turn
  if (enablePremoves && orientation) {
    if (orientation !== currentTurn) {
      movable.color = orientation;
      // Don't provide dests for premoves - let Chessground handle premove destinations
      movable.dests = new Map();
    }
  }

  return movable;
};

export default toDests;
