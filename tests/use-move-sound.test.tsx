// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Key } from '../src/board/types';
import { useMoveSound } from '../src/hooks/use-move-sound';
import { resetPrefsCache, writePrefs } from '../src/prefs/store';
import { INITIAL_FEN } from '../src/rules/position';

const plays: string[] = [];

// jsdom has no audio output at all: HTMLAudioElement.play() throws "not implemented".
class FakeAudio {
  currentTime = 0;
  constructor(readonly src: string) {}
  play(): Promise<void> {
    plays.push(this.src);
    return Promise.resolve();
  }
}

const AFTER_E4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
// the same position seen from the other side: only the fen fields after the placement differ
const INITIAL_FLIPPED = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';
const LAST_MOVE: [Key, Key] = ['e2', 'e4'];

interface Props {
  fen: string;
  lastMove: [Key, Key] | null;
}

const mount = (initialProps: Props) =>
  renderHook(({ fen, lastMove }: Props) => useMoveSound(fen, lastMove), { initialProps });

describe('useMoveSound', () => {
  beforeEach(() => {
    plays.length = 0;
    localStorage.clear();
    resetPrefsCache();
    vi.stubGlobal('Audio', FakeAudio);
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('is silent on mount, even with a last move', () => {
    mount({ fen: AFTER_E4, lastMove: LAST_MOVE });
    expect(plays).toHaveLength(0);
  });

  it('is silent when the position changes without a last move', () => {
    const { rerender } = mount({ fen: INITIAL_FEN, lastMove: null });
    rerender({ fen: AFTER_E4, lastMove: null });
    expect(plays).toHaveLength(0);
  });

  it('is silent when only the preferences change', () => {
    mount({ fen: AFTER_E4, lastMove: LAST_MOVE });
    act(() => writePrefs({ sound: 'piano' }));
    act(() => writePrefs({ highlight: false }));
    expect(plays).toHaveLength(0);
  });

  it('plays once when the pieces move with a last move set', () => {
    const { rerender } = mount({ fen: INITIAL_FEN, lastMove: null });
    rerender({ fen: AFTER_E4, lastMove: LAST_MOVE });
    expect(plays).toHaveLength(1);

    // a flip and a re-render of the same placement stay silent
    rerender({ fen: AFTER_E4, lastMove: LAST_MOVE });
    expect(plays).toHaveLength(1);
    const { rerender: rerenderFlip } = mount({ fen: INITIAL_FEN, lastMove: LAST_MOVE });
    rerenderFlip({ fen: INITIAL_FLIPPED, lastMove: LAST_MOVE });
    expect(plays).toHaveLength(1);
  });
});
