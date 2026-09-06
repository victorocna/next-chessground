import { describe, expect, it } from 'vitest';
import { boardState, toDests } from '../src/rules/board-state';
import { EMPTY_FEN, INITIAL_FEN } from '../src/rules/position';

const CASTLE_FEN = 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
const FOOLS_MATE = 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3';
const STALEMATE = '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1';
// White's king stands on the hill. The black rook keeps material sufficient, so under standard
// rules the game is still on and only the King of the Hill rule can end this position.
const KOTH_END = '8/8/8/3K4/8/8/8/k6r b - - 0 1';

describe('toDests', () => {
  it('groups legal targets by origin', () => {
    const dests = toDests(INITIAL_FEN);
    expect(dests.size).toBe(10);
    expect(dests.get('e2')).toEqual(['e3', 'e4']);
  });

  it('offers both castling notations in standard chess', () => {
    const king = toDests(CASTLE_FEN).get('e1') ?? [];
    expect(king).toEqual(expect.arrayContaining(['g1', 'c1', 'h1', 'a1', 'd1', 'f1']));
    expect(king).toHaveLength(6);
  });

  it('offers only king-onto-rook castling in Chess960', () => {
    const king = toDests(CASTLE_FEN, 'chess960').get('e1') ?? [];
    expect(king).toEqual(expect.arrayContaining(['h1', 'a1', 'd1', 'f1']));
    expect(king).not.toContain('g1');
    expect(king).not.toContain('c1');
  });

  it('is empty for an illegal position', () => {
    expect(toDests('8/8/8/8/8/8/8/8 w - - 0 1').size).toBe(0);
  });
});

describe('boardState', () => {
  it('lets the side to move play', () => {
    const state = boardState({ fen: INITIAL_FEN, playerColor: 'white' });
    expect(state.turnColor).toBe('white');
    expect(state.movableColor).toBe('white');
    expect(state.dests.size).toBe(10);
    expect(state.premovable).toBe(false);
    expect(state.check).toBe(false);
    expect(state.isOver).toBe(false);
    expect(state.isDisplayable).toBe(true);
  });

  it('arms premoves when it is the opponent turn', () => {
    const state = boardState({ fen: INITIAL_FEN, playerColor: 'black' });
    expect(state.movableColor).toBe('black');
    expect(state.dests.size).toBe(0);
    expect(state.premovable).toBe(true);
  });

  it('can switch premoves off', () => {
    const state = boardState({ fen: INITIAL_FEN, playerColor: 'black', premove: false });
    expect(state.premovable).toBe(false);
  });

  it('moves both sides in analysis mode without premoves', () => {
    const state = boardState({ fen: INITIAL_FEN, playerColor: 'both' });
    expect(state.movableColor).toBe('both');
    expect(state.dests.size).toBe(10);
    expect(state.premovable).toBe(false);
  });

  it('locks when asked and when nobody plays', () => {
    expect(
      boardState({ fen: INITIAL_FEN, playerColor: 'white', locked: true }).movableColor
    ).toBeUndefined();
    expect(boardState({ fen: INITIAL_FEN }).movableColor).toBeUndefined();
    expect(boardState({ fen: INITIAL_FEN, playerColor: 'white', locked: true }).premovable).toBe(
      false
    );
  });

  it('reports check and terminal positions', () => {
    const mate = boardState({ fen: FOOLS_MATE, playerColor: 'white' });
    expect(mate.check).toBe('white');
    expect(mate.isOver).toBe(true);
    expect(mate.movableColor).toBeUndefined();
    expect(boardState({ fen: STALEMATE, playerColor: 'black' }).isOver).toBe(true);
  });

  it('applies variant endings', () => {
    expect(
      boardState({ fen: KOTH_END, playerColor: 'black', variant: 'kingOfTheHill' }).isOver
    ).toBe(true);
    expect(boardState({ fen: KOTH_END, playerColor: 'black' }).isOver).toBe(false);
  });

  it('renders an empty board as a displayable position nobody can play', () => {
    const state = boardState({ fen: EMPTY_FEN, playerColor: 'white' });
    expect(state.isDisplayable).toBe(true);
    expect(state.movableColor).toBeUndefined();
    expect(state.dests.size).toBe(0);
    expect(state.isOver).toBe(false);
    expect(state.turnColor).toBe('white');
  });

  it('stays locked and marks garbage as not displayable', () => {
    const state = boardState({ fen: 'garbage', playerColor: 'white' });
    expect(state.isDisplayable).toBe(false);
    expect(state.turnColor).toBe('white');
    expect(state.movableColor).toBeUndefined();
    expect(state.dests.size).toBe(0);
  });
});
