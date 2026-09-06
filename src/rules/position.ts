import type { Position } from 'chessops/chess';
import { EMPTY_FEN, INITIAL_FEN, parseBoardFen, parseFen } from 'chessops/fen';
import type { Rules } from 'chessops/types';
import { setupPosition } from 'chessops/variant';
import type { Color, Variant } from '../board/types';

export { EMPTY_FEN, INITIAL_FEN };

export const rulesOf = (variant: Variant): Rules => {
  switch (variant) {
    case 'kingOfTheHill':
      return 'kingofthehill';
    case 'threeCheck':
      return '3check';
    default:
      return 'chess';
  }
};

export interface ReadPosition {
  /** Level 1: the board part parses, so the pieces can be drawn. */
  displayable: boolean;
  /** Level 2: a legal position for the variant, so moves can be played. */
  pos: Position | null;
}

/** Piece placement, the first FEN field. */
export const placementOf = (fen: string): string => fen.split(' ')[0] ?? '';

export const isDisplayableFen = (fen: string): boolean => parseBoardFen(placementOf(fen)).isOk;

export const readPosition = (fen: string, variant: Variant = 'standard'): ReadPosition => {
  const result = parseFen(fen).chain((setup) => setupPosition(rulesOf(variant), setup));
  return { displayable: isDisplayableFen(fen), pos: result.isOk ? result.value : null };
};

export const isValidFen = (fen: string, variant: Variant = 'standard'): boolean =>
  readPosition(fen, variant).pos !== null;

/** Side to move from the second FEN field; white when the field is missing. */
export const turnColorOf = (fen: string): Color => (fen.split(' ')[1] === 'b' ? 'black' : 'white');
