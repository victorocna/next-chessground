// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react';
import type * as Chessground from '@lichess-org/chessground';
import type { Api } from '@lichess-org/chessground/api';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Board } from '../src/components/Board';
import { resetPrefsCache } from '../src/prefs/store';

// The real chessground, with its api kept within reach so a sync can be counted rather than
// only seen in the DOM.
const mounted = vi.hoisted(() => ({ api: null as Api | null }));

vi.mock('@lichess-org/chessground', async (importOriginal) => {
  const actual = await importOriginal<typeof Chessground>();
  return {
    Chessground: (el: HTMLElement, config: Parameters<typeof actual.Chessground>[1]) => {
      mounted.api = actual.Chessground(el, config);
      return mounted.api;
    },
  };
});

const api = (): Api => {
  if (!mounted.api) {
    throw new Error('no chessground instance');
  }
  return mounted.api;
};

const KINGS = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const START_BLACK = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';

// chessground debounces its own render through requestAnimationFrame, so the DOM is a frame behind.
const frame = async () => {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
};

// The vi.mock above keeps a handle on the real chessground api (see `mounted`), so the sync
// rules are asserted directly against its calls rather than only against what it paints.
describe('useChessground with a real chessground', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
    mounted.api = null;
  });
  afterEach(cleanup);

  it('re-syncs when a single BoardInput field changes', async () => {
    const { container, rerender } = render(<Board fen={KINGS} orientation="white" />);
    await frame();
    // the sync effect depends on the whole input object, so one changed field is one sync
    const set = vi.spyOn(api(), 'set');

    rerender(<Board fen={KINGS} orientation="black" />);
    await frame();
    expect(set).toHaveBeenCalledTimes(1);
    expect(set.mock.lastCall?.[0]).toHaveProperty('orientation', 'black');
    expect(container.querySelector('.cg-wrap')?.classList.contains('orientation-black')).toBe(true);
    set.mockRestore();
  });

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
