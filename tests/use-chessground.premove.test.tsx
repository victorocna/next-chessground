// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Dests, Key } from '../src/board/types';
import { Board } from '../src/components/Board';
import { resetPrefsCache, writePrefs } from '../src/prefs/store';

// An armed premove lives inside the chessground instance, out of reach of the DOM, and
// `playPremove()` unsets it whenever it cannot play it. So the rule is asserted on a fake api:
// playPremove() runs only when a new position was pushed.
const cg = vi.hoisted(() => {
  const placementOf = (fen?: string): string => (fen ?? '').split(' ')[0] ?? '';
  const state = { placement: '' };
  const api = {
    destroy: vi.fn(),
    getFen: vi.fn(() => state.placement),
    playPremove: vi.fn(),
    redrawAll: vi.fn(),
    set: vi.fn((config: { fen?: string }) => {
      if (config.fen !== undefined) {
        state.placement = placementOf(config.fen);
      }
    }),
    setAutoShapes: vi.fn(),
    setShapes: vi.fn(),
  };
  const Chessground = vi.fn((_el: HTMLElement, config: { fen?: string }) => {
    state.placement = placementOf(config.fen);
    return api;
  });
  return { api, Chessground, state };
});

vi.mock('@lichess-org/chessground', () => ({ Chessground: cg.Chessground }));

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const START_BLACK = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';
const AFTER_E4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
const LAST_MOVE: [Key, Key] = ['e2', 'e4'];
const NO_DESTS: Dests = new Map();

// Black waits for white to move: chessground's premove state is armed and dests are empty.
const armed = {
  dests: NO_DESTS,
  movableColor: 'black' as const,
  premovable: true,
  turnColor: 'white' as const,
};

describe('useChessground premove', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
    cg.state.placement = '';
    vi.clearAllMocks();
  });
  afterEach(cleanup);

  it('leaves an armed premove alone on a resync that carries no new position', () => {
    const { rerender } = render(<Board {...armed} fen={START} />);
    expect(cg.Chessground).toHaveBeenCalledTimes(1);
    expect(cg.api.set).toHaveBeenCalledTimes(1);
    expect(cg.api.playPremove).not.toHaveBeenCalled();

    // a highlighted last move, then a preference change: two resyncs, no new position
    rerender(<Board {...armed} fen={START} lastMove={LAST_MOVE} />);
    act(() => writePrefs({ highlight: false }));
    expect(cg.api.set).toHaveBeenCalledTimes(3);
    expect(cg.api.playPremove).not.toHaveBeenCalled();

    // the same placement with the other side to move is not a new position either
    rerender(<Board {...armed} fen={START_BLACK} lastMove={LAST_MOVE} />);
    expect(cg.api.set.mock.lastCall?.[0]).not.toHaveProperty('fen');
    expect(cg.api.playPremove).not.toHaveBeenCalled();
  });

  it('plays the premove once, when a new position is pushed', () => {
    const { rerender } = render(<Board {...armed} fen={START} />);
    rerender(<Board {...armed} fen={AFTER_E4} lastMove={LAST_MOVE} turnColor="black" />);
    expect(cg.api.set.mock.lastCall?.[0]).toHaveProperty('fen', AFTER_E4);
    expect(cg.api.playPremove).toHaveBeenCalledTimes(1);

    // and not again on the resyncs that follow it
    act(() => writePrefs({ showDests: false }));
    expect(cg.api.playPremove).toHaveBeenCalledTimes(1);
  });
});
