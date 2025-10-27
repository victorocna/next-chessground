/**
 * Checks if a move is a pawn promotion.
 */
const isPromotion = (chess, from, to) => {
  try {
    const piece = chess.get(from);
    if (piece.type !== 'p') {
      return false;
    }
    return (
      (piece.color === 'w' && to[1] === '8') ||
      (piece.color === 'b' && to[1] === '1')
    );
  } catch {
    return false;
  }
};

module.exports = isPromotion;
