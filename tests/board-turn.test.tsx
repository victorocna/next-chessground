// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react';
import type * as Chessground from '@lichess-org/chessground';
import type { Api } from '@lichess-org/chessground/api';
import { isDraggable, selectSquare } from '@lichess-org/chessground/board';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Key } from '../src/board/types';
import { Board } from '../src/components/Board';
import { resetPrefsCache } from '../src/prefs/store';
import { toDests } from '../src/rules/board-state';

// The grab is decided inside chessground, out of reach of the DOM, so the real instance the
// board mounts is captured and its own gatekeepers are asked directly.
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

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const frame = async () => {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
};

const state = () => {
  if (!mounted.api) {
    throw new Error('no chessground instance');
  }
  return mounted.api.state;
};

// chessground selects a square on mousedown and only then considers dragging it.
const canGrab = (key: Key): boolean => {
  selectSquare(state(), key);
  const picked = state().selected === key;
  return picked && isDraggable(state(), key);
};

// A board that plays both sides is analysis, not a free-for-all: only the side to move moves.
describe('a board that plays both sides', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
    mounted.api = null;
  });
  afterEach(cleanup);

  it('grabs a piece of the side to move', async () => {
    render(<Board dests={toDests(START)} fen={START} movableColor="both" turnColor="white" />);
    await frame();
    expect(canGrab('e2')).toBe(true);
  });

  it('leaves the side that is waiting alone', async () => {
    render(<Board dests={toDests(START)} fen={START} movableColor="both" turnColor="white" />);
    await frame();
    expect(canGrab('e7')).toBe(false);
  });

  it('hands the board over once that side is to move', async () => {
    const { rerender } = render(
      <Board dests={toDests(START)} fen={START} movableColor="both" turnColor="white" />
    );
    await frame();

    const after = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
    rerender(<Board dests={toDests(after)} fen={after} movableColor="both" turnColor="black" />);
    await frame();
    expect(canGrab('e7')).toBe(true);
    expect(canGrab('d2')).toBe(false);
  });
});
