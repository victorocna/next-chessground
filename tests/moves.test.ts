import { describe, expect, it } from 'vitest';
import type { Key } from '../src/board/types';
import { isPromotionRole, uciMove, userMove } from '../src/rules/moves';
import { INITIAL_FEN } from '../src/rules/position';

const CASTLE_FEN = 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
const PROMO_FEN = '4k3/P7/8/8/8/8/8/4K3 w - - 0 1';
// Black king moved off e8 so the e-file promotion square is free.
const PROMO_E_FEN = '7k/4P3/8/8/8/8/8/4K3 w - - 0 1';

describe('userMove', () => {
  it('returns the move with san, uci and the resulting fen', () => {
    const move = userMove(INITIAL_FEN, 'e2', 'e4');
    expect(move).toMatchObject({ from: 'e2', to: 'e4', uci: 'e2e4', san: 'e4' });
    expect(move?.promotion).toBeUndefined();
    expect(move?.fen.startsWith('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq')).toBe(true);
  });

  it('rejects illegal moves and illegal positions', () => {
    expect(userMove(INITIAL_FEN, 'e2', 'e5')).toBeNull();
    expect(userMove(INITIAL_FEN, 'e7', 'e5')).toBeNull();
    expect(userMove('8/8/8/8/8/8/8/8 w - - 0 1', 'e2', 'e4')).toBeNull();
    // `Key` cannot express a non-square, but untyped callers still can.
    expect(userMove(INITIAL_FEN, 'z9' as Key, 'e4')).toBeNull();
  });

  it('reports standard castling as the king destination for either drop square', () => {
    expect(userMove(CASTLE_FEN, 'e1', 'g1')).toMatchObject({
      from: 'e1',
      to: 'g1',
      uci: 'e1g1',
      san: 'O-O',
    });
    expect(userMove(CASTLE_FEN, 'e1', 'h1')).toMatchObject({
      from: 'e1',
      to: 'g1',
      uci: 'e1g1',
      san: 'O-O',
    });
    expect(userMove(CASTLE_FEN, 'e1', 'c1')).toMatchObject({ to: 'c1', uci: 'e1c1', san: 'O-O-O' });
  });

  it('reports Chess960 castling as king onto rook', () => {
    expect(userMove(CASTLE_FEN, 'e1', 'h1', undefined, 'chess960')).toMatchObject({
      from: 'e1',
      to: 'h1',
      uci: 'e1h1',
      san: 'O-O',
    });
  });

  it('needs a promotion role on the back rank', () => {
    expect(userMove(PROMO_FEN, 'a7', 'a8')).toBeNull();
    expect(userMove(PROMO_FEN, 'a7', 'a8', 'queen')).toMatchObject({
      uci: 'a7a8q',
      san: 'a8=Q+',
      promotion: 'queen',
    });
    expect(userMove(PROMO_FEN, 'a7', 'a8', 'knight')).toMatchObject({
      uci: 'a7a8n',
      san: 'a8=N',
      promotion: 'knight',
    });
  });
});

describe('uciMove', () => {
  it('validates uci strings', () => {
    expect(uciMove(INITIAL_FEN, 'e2e4')).toMatchObject({ uci: 'e2e4', san: 'e4' });
    expect(uciMove(PROMO_FEN, 'a7a8q')).toMatchObject({ san: 'a8=Q+', promotion: 'queen' });
    expect(uciMove(INITIAL_FEN, 'e2e5')).toBeNull();
    expect(uciMove(INITIAL_FEN, 'garbage')).toBeNull();
    expect(uciMove(INITIAL_FEN, 'N@e4')).toBeNull();
    // a king is not a promotion role, so the fifth character makes the whole uci illegal
    expect(uciMove(PROMO_FEN, 'a7a8k')).toBeNull();
  });

  it('accepts both castling notations and normalises the output', () => {
    expect(uciMove(CASTLE_FEN, 'e1h1')).toMatchObject({ uci: 'e1g1' });
    expect(uciMove(CASTLE_FEN, 'e1g1')).toMatchObject({ uci: 'e1g1' });
    expect(uciMove(CASTLE_FEN, 'e1h1', 'chess960')).toMatchObject({ uci: 'e1h1' });
  });

  it('rejects a promotion role that is not queen/rook/bishop/knight', () => {
    expect(uciMove(PROMO_E_FEN, 'e7e8k')).toBeNull();
    expect(uciMove(PROMO_E_FEN, 'e7e8q')).toMatchObject({ uci: 'e7e8q', promotion: 'queen' });
  });
});

describe('isPromotionRole', () => {
  it('accepts only queen, rook, bishop and knight', () => {
    expect(isPromotionRole('queen')).toBe(true);
    expect(isPromotionRole('rook')).toBe(true);
    expect(isPromotionRole('bishop')).toBe(true);
    expect(isPromotionRole('knight')).toBe(true);
  });

  it('rejects king and pawn, which chessops also treats as roles', () => {
    expect(isPromotionRole('king')).toBe(false);
    expect(isPromotionRole('pawn')).toBe(false);
  });
});
