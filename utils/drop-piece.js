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
  if (!cg) {
    throw new Error('Chessground is not defined');
  }

  if (!selected || !selected.role || !selected.color) {
    return cg.getFen();
  }

  if (selected.role === 'bin') {
    cg.setPieces(piecesDiff(key));
    return cg.getFen();
  }

  const square = cg.state.pieces.get(key);
  if (!square) {
    cg.newPiece(selected, key);
    return cg.getFen();
  }

  if (square.role === selected.role && square.color === selected.color) {
    cg.setPieces(piecesDiff(key));
    return cg.getFen();
  }

  cg.setPieces(piecesDiff(key));
  cg.newPiece(selected, key);
  return cg.getFen();
};

export default dropPiece;
