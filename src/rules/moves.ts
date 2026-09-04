import { castlingSide, normalizeMove, type Position } from 'chessops/chess';
import { makeFen } from 'chessops/fen';
import { makeSan } from 'chessops/san';
import { isNormal, type NormalMove } from 'chessops/types';
import { kingCastlesTo, makeSquare, makeUci, parseSquare, parseUci } from 'chessops/util';
import type { Key, Move, PromotionRole, Variant } from '../board/types';
import { readPosition } from './position';

/**
 * Validates a move on a position and returns the shape handed to `onMove`; null when illegal.
 * Chessground reports the square the user dropped on, so castling may arrive as king two
 * squares or king onto rook; both are accepted. The reported `uci`, `from` and `to` follow
 * engine convention: king destination in standard chess, king onto rook in Chess960.
 */
export const moveFrom = (
  pos: Position,
  variant: Variant,
  orig: Key,
  dest: Key,
  promotion?: PromotionRole
): Move | null => {
  const from = parseSquare(orig);
  const to = parseSquare(dest);
  if (from === undefined || to === undefined) {
    return null;
  }
  const move = normalizeMove(pos, { from, to, promotion }) as NormalMove;
  if (!pos.isLegal(move)) {
    return null;
  }
  const san = makeSan(pos, move);
  const after = pos.clone();
  after.play(move);
  const side = castlingSide(pos, move);
  const reported: NormalMove =
    side && variant !== 'chess960' ? { from: move.from, to: kingCastlesTo(pos.turn, side) } : move;

  return {
    from: makeSquare(reported.from),
    to: makeSquare(reported.to),
    promotion,
    uci: makeUci(reported),
    san,
    fen: makeFen(after.toSetup()),
  };
};

export const userMove = (
  fen: string,
  orig: Key,
  dest: Key,
  promotion?: PromotionRole,
  variant: Variant = 'standard'
): Move | null => {
  const { pos } = readPosition(fen, variant);
  return pos ? moveFrom(pos, variant, orig, dest, promotion) : null;
};

/** Same validation from a UCI string ("e7e8q"), the input of engines and sockets. Drops are rejected. */
export const uciMove = (fen: string, uci: string, variant: Variant = 'standard'): Move | null => {
  const parsed = parseUci(uci);
  if (!parsed || !isNormal(parsed)) {
    return null;
  }
  const { pos } = readPosition(fen, variant);
  if (!pos) {
    return null;
  }
  const promotion = parsed.promotion as PromotionRole | undefined;
  return moveFrom(pos, variant, makeSquare(parsed.from), makeSquare(parsed.to), promotion);
};
