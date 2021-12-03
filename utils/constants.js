const fen = {
  initial: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  empty: '8/8/8/8/8/8/8/8 w - - 0 1',
};

export const initialFen = fen.initial;
export const emptyFen = fen.empty;

const constants = {
  fen,
  initialFen,
  emptyFen,
};

export default constants;
