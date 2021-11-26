/**
 * Pieces diff from a Chessground board
 */
const piecesDiff = (key) => {
  const map = new Map();
  map.set(key, null);
  return map;
};

/**
 * Drop piece to a Chessground board
 */
const dropPiece = (cg, selected, key) => {
  if (!cg || !selected) {
    return false;
  }

  if (selected.role === 'bin') {
    cg.setPieces(piecesDiff(key));
  } else {
    cg.newPiece(selected, key);
  }

  return cg.getFen();
};

export default dropPiece;
