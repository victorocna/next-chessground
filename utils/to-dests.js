import isValidFen from './is-valid-fen';
import { SQUARES } from 'chess.js';

/**
 * Legal chess moves for chessground
 * @param {*} chess
 */
const toDests = (chess) => {
  if (!isValidFen(chess.fen())) {
    return;
  }

  const dests = new Map();
  const color = chess.turn() === 'w' ? 'white' : 'black';

  SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length) {
      dests.set(
        s,
        ms.map((m) => m.to)
      );
    }
  });

  return {
    color, // who's turn is it
    dests, // what to move
    free: false,
  };
};

export default toDests;
