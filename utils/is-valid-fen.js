import { validateFen } from 'chess.js';

const validateKings = (fen) => {
  if (!fen) {
    return false;
  }

  const position = fen.split(' ')[0];

  return (
    (position.match(/k/g) || []).length === 1 &&
    (position.match(/K/g) || []).length === 1
  );
};

const isValidFen = (fen) => {
  return validateFen(fen) && validateKings(fen);
};

export default isValidFen;
