import type { Color, Key, PromotionRole } from '../board/types';

const FILES = 'abcdefgh';
const ROLES: PromotionRole[] = ['queen', 'knight', 'rook', 'bishop'];

/**
 * The tiles of the promotion picker as percentages of the board: the four choices start on the
 * promotion rank and step toward the centre, whatever the orientation, and the cancel tile
 * continues the same column one square further in.
 */
export const promotionSquares = (dest: Key, orientation: Color) => {
  const fileIndex = FILES.indexOf(dest.charAt(0));
  const rankIndex = Number(dest.charAt(1)) - 1;
  const column = orientation === 'white' ? fileIndex : 7 - fileIndex;
  const startRow = orientation === 'white' ? 7 - rankIndex : rankIndex;
  const step = startRow === 0 ? 1 : -1;
  const top = (index: number) => `${(startRow + index * step) * 12.5}%`;

  return {
    left: `${column * 12.5}%`,
    squares: ROLES.map((role, index) => ({ role, top: top(index) })),
    cancel: { top: top(ROLES.length) },
  };
};
