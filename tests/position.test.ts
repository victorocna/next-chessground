import { describe, expect, it } from 'vitest';
import {
  EMPTY_FEN,
  INITIAL_FEN,
  isDisplayableFen,
  isValidFen,
  readPosition,
  rulesOf,
  turnColorOf,
} from '../src/rules/position';

const FOOLS_MATE = 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3';

describe('rulesOf', () => {
  it('maps variants to chessops rules', () => {
    expect(rulesOf('standard')).toBe('chess');
    expect(rulesOf('chess960')).toBe('chess');
    expect(rulesOf('kingOfTheHill')).toBe('kingofthehill');
    expect(rulesOf('threeCheck')).toBe('3check');
  });
});

describe('readPosition', () => {
  it('reads the initial position', () => {
    const { displayable, pos } = readPosition(INITIAL_FEN);
    expect(displayable).toBe(true);
    expect(pos?.turn).toBe('white');
  });

  it('displays an empty board without making it interactive', () => {
    const { displayable, pos } = readPosition(EMPTY_FEN);
    expect(displayable).toBe(true);
    expect(pos).toBeNull();
  });

  it('rejects garbage on both levels', () => {
    const { displayable, pos } = readPosition('not a fen');
    expect(displayable).toBe(false);
    expect(pos).toBeNull();
  });

  it('reads a Three-check FEN with remaining checks', () => {
    const { pos } = readPosition(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0+3 0 1',
      'threeCheck'
    );
    expect(pos?.isEnd()).toBe(true);
  });
});

describe('fen helpers', () => {
  it('isDisplayableFen and isValidFen differ on an empty board', () => {
    expect(isDisplayableFen(EMPTY_FEN)).toBe(true);
    expect(isValidFen(EMPTY_FEN)).toBe(false);
    expect(isValidFen(INITIAL_FEN)).toBe(true);
    expect(isValidFen(FOOLS_MATE)).toBe(true);
  });

  it('turnColorOf reads the second field and defaults to white', () => {
    expect(turnColorOf(INITIAL_FEN)).toBe('white');
    expect(turnColorOf('8/8/8/8/8/8/8/8 b - - 0 1')).toBe('black');
    expect(turnColorOf('garbage')).toBe('white');
  });
});
