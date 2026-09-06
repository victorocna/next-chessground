import type { Position } from 'chessops/chess';
import { parseSquare, squareRank } from 'chessops/util';
import type { Key, Variant } from '../board/types';
import { readPosition } from './position';

/** A pawn of the side to move landing on its last rank. Works for premoves too. */
export const isPromotionAt = (pos: Position, orig: Key, dest: Key): boolean => {
  const from = parseSquare(orig);
  const to = parseSquare(dest);
  if (from === undefined || to === undefined) {
    return false;
  }
  const piece = pos.board.get(from);
  if (!piece || piece.role !== 'pawn' || piece.color !== pos.turn) {
    return false;
  }
  return squareRank(to) === (pos.turn === 'white' ? 7 : 0);
};

export const isPromotion = (
  fen: string,
  orig: Key,
  dest: Key,
  variant: Variant = 'standard'
): boolean => {
  const { pos } = readPosition(fen, variant);
  return pos ? isPromotionAt(pos, orig, dest) : false;
};
