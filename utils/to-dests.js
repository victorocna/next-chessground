/**
 * Legal chess moves for chessground
 * @param {*} chess
 */
const toDests = (chess) => {
  const dests = new Map();
  chess.SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length) {
      dests.set(s, ms.map((m) => m.to));
    }
  });
  const color = chess.turn() === 'w' ? 'white' : 'black';

  return {
    color, // who's turn is it
    dests, // what to move
    free: false,
  };
};

export default toDests;
