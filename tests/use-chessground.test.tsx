// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Board } from '../src/components/Board';
import { resetPrefsCache } from '../src/prefs/store';

const KINGS = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const START_BLACK = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';

// chessground debounces its own render through requestAnimationFrame, so the DOM is a frame behind.
const frame = async () => {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
};

// chessground's api is not reachable from the DOM, so the sync rules are asserted on what it paints.
describe('useChessground with a real chessground', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
  });
  afterEach(cleanup);

  it('does not push a new fen while holdPieces is set', async () => {
    const { container, rerender } = render(<Board fen={KINGS} />);
    const pieces = () => container.querySelectorAll('cg-board piece').length;
    await frame();
    expect(pieces()).toBe(2);

    // the promotion picker holds the pawn: the position must wait
    rerender(<Board fen={START} holdPieces />);
    await frame();
    expect(pieces()).toBe(2);

    // and lands as soon as the hold is released
    rerender(<Board fen={START} />);
    await frame();
    expect(pieces()).toBe(32);
  });

  it('leaves the pieces alone when only the turn field changes', async () => {
    const { container, rerender } = render(<Board fen={START} />);
    await frame();
    const board = container.querySelector('cg-board');
    const before = board?.innerHTML;
    expect(container.querySelectorAll('cg-board piece')).toHaveLength(32);

    rerender(<Board fen={START_BLACK} turnColor="black" />);
    await frame();
    expect(container.querySelector('cg-board')).toBe(board);
    expect(container.querySelectorAll('cg-board piece')).toHaveLength(32);
    expect(container.querySelector('cg-board')?.innerHTML).toBe(before);
  });

  it('recreates chessground when a viewOnly board turns interactive', async () => {
    // chessground binds drag end on the document only for interactive boards, at creation
    const listeners = vi.spyOn(document, 'addEventListener');
    const { rerender } = render(<Board fen={START} viewOnly />);
    await frame();
    expect(listeners.mock.calls.some(([type]) => type === 'mouseup')).toBe(false);

    rerender(<Board fen={START} />);
    await frame();
    expect(listeners.mock.calls.some(([type]) => type === 'mouseup')).toBe(true);
    listeners.mockRestore();
  });

  it('rebuilds the board when coordinates change', async () => {
    const { container, rerender } = render(<Board coordinates fen={KINGS} />);
    await frame();
    expect(container.querySelectorAll('coords')).toHaveLength(2);

    // coordinates are bound when chessground builds its DOM, so this only works through redrawAll
    rerender(<Board coordinates={false} fen={KINGS} />);
    await frame();
    expect(container.querySelectorAll('coords')).toHaveLength(0);
    expect(container.querySelectorAll('cg-board piece')).toHaveLength(2);
  });
});
