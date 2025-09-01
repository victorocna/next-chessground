import { isArray } from 'lodash';
import { constants } from 'next-chessground';

/**
 * Parses a FEN string and returns an object with the relevant information.
 */
export const parseFen = (fen) => {
  if (!fen || typeof fen !== 'string') {
    return null;
  }

  const parts = fen.trim().split(' ');
  if (parts.length !== 6) {
    return null;
  }

  return {
    piecePlacement: parts[0], // Board position (e.g., "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
    activeColor: parts[1], // Active color ("w" for white, "b" for black)
    castlingRights: parts[2], // Castling availability (e.g., "KQkq")
    enPassantTarget: parts[3], // En passant target square (e.g., "-" or "e3")
    halfmoveClock: parseInt(parts[4], 10), // Halfmove clock (50-move rule)
    fullmoveNumber: parseInt(parts[5], 10), // Fullmove number
  };
};

/**
 * Extracts the FEN string from a PGN string.
 */
export const extractFen = (pgn) => {
  const lines = isArray(pgn) ? pgn : pgn.split('\n');
  const fenLine = lines.find((line) => line.startsWith('[FEN'));
  if (!fenLine) {
    return constants.initialFen;
  }

  const fenMatch = fenLine.match(/\[FEN "(.+?)"\]/);
  return fenMatch ? fenMatch[1] : constants.initialFen;
};
