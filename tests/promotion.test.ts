import { describe, expect, it } from 'vitest';
import { INITIAL_FEN } from '../src/rules/position';
import { isPromotion } from '../src/rules/promotion';
import { promotionSquares } from '../src/rules/promotion-squares';

describe('isPromotion', () => {
  it('detects pawns reaching the last rank for both colours', () => {
    expect(isPromotion('4k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'a7', 'a8')).toBe(true);
    expect(isPromotion('4k3/8/8/8/8/8/p3K3/8 b - - 0 1', 'a2', 'a1')).toBe(true);
  });

  it('ignores other moves, other pieces and the wrong side', () => {
    expect(isPromotion(INITIAL_FEN, 'e2', 'e4')).toBe(false);
    expect(isPromotion('4k3/R7/8/8/8/8/8/4K3 w - - 0 1', 'a7', 'a8')).toBe(false);
    expect(isPromotion('4k3/8/8/8/8/8/p3K3/8 w - - 0 1', 'a2', 'a1')).toBe(false);
    expect(isPromotion('garbage', 'a7', 'a8')).toBe(false);
  });
});

describe('promotionSquares', () => {
  it('starts on the promotion rank and steps toward the centre', () => {
    const white = promotionSquares('e8', 'white');
    expect(white.left).toBe('50%');
    expect(white.squares.map((s) => s.role)).toEqual(['queen', 'knight', 'rook', 'bishop']);
    expect(white.squares.map((s) => s.top)).toEqual(['0%', '12.5%', '25%', '37.5%']);
    expect(white.cancel.top).toBe('50%');
  });

  it('mirrors for black orientation and for the first rank', () => {
    const black = promotionSquares('e8', 'black');
    expect(black.left).toBe('37.5%');
    expect(black.squares.map((s) => s.top)).toEqual(['87.5%', '75%', '62.5%', '50%']);
    expect(black.cancel.top).toBe('37.5%');
    const first = promotionSquares('a1', 'white');
    expect(first.left).toBe('0%');
    expect(first.squares.map((s) => s.top)).toEqual(['87.5%', '75%', '62.5%', '50%']);
    expect(first.cancel.top).toBe('37.5%');
  });
});
