// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useChessboard } from '../src/hooks/use-chessboard';
import { INITIAL_FEN } from '../src/rules/position';

const PROMO_FEN = '4k3/P7/8/8/8/8/8/4K3 w - - 0 1';
const meta = { premove: false };

describe('useChessboard', () => {
  afterEach(cleanup);

  it('derives board props from the position', () => {
    const { result } = renderHook(() => useChessboard({ fen: INITIAL_FEN, playerColor: 'white' }));
    expect(result.current.boardProps.turnColor).toBe('white');
    expect(result.current.boardProps.movableColor).toBe('white');
    expect(result.current.boardProps.dests.size).toBe(10);
    expect(result.current.boardProps.holdPieces).toBe(false);
    expect(result.current.promotion).toBeNull();
    expect(result.current.isOver).toBe(false);
  });

  it('emits a legal move and rejects an illegal one', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useChessboard({ fen: INITIAL_FEN, playerColor: 'white', onMove })
    );
    let accepted = false;
    act(() => {
      accepted = result.current.boardProps.onMove('e2', 'e4', meta);
    });
    expect(accepted).toBe(true);
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ uci: 'e2e4', san: 'e4' }));
    act(() => {
      accepted = result.current.boardProps.onMove('e2', 'e5', meta);
    });
    expect(accepted).toBe(false);
    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it('opens the promotion picker, holds the pawn and completes on pick', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useChessboard({ fen: PROMO_FEN, playerColor: 'white', onMove })
    );
    act(() => {
      result.current.boardProps.onMove('a7', 'a8', meta);
    });
    expect(onMove).not.toHaveBeenCalled();
    expect(result.current.promotion).toMatchObject({ color: 'white', dest: 'a8' });
    expect(result.current.boardProps.holdPieces).toBe(true);
    expect(result.current.boardProps.movableColor).toBeUndefined();
    act(() => {
      result.current.promotion?.onPick('knight');
    });
    expect(onMove).toHaveBeenCalledWith(
      expect.objectContaining({ uci: 'a7a8n', san: 'a8=N', promotion: 'knight' })
    );
    expect(result.current.promotion).toBeNull();
    expect(result.current.boardProps.holdPieces).toBe(false);
  });

  it('cancels the picker and bumps syncKey so the board snaps back', () => {
    const { result } = renderHook(() => useChessboard({ fen: PROMO_FEN, playerColor: 'white' }));
    const before = result.current.boardProps.syncKey;
    act(() => {
      result.current.boardProps.onMove('a7', 'a8', meta);
    });
    act(() => {
      result.current.promotion?.onCancel();
    });
    expect(result.current.promotion).toBeNull();
    expect(result.current.boardProps.syncKey).toBe(before + 1);
  });

  it('auto-queens a premoved promotion', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useChessboard({ fen: PROMO_FEN, playerColor: 'white', onMove })
    );
    act(() => {
      result.current.boardProps.onMove('a7', 'a8', { premove: true });
    });
    expect(onMove).toHaveBeenCalledWith(
      expect.objectContaining({ uci: 'a7a8q', promotion: 'queen' })
    );
    expect(result.current.promotion).toBeNull();
  });

  it('cancels a pending promotion when the board gets locked or the position changes', () => {
    const { result, rerender } = renderHook(
      ({ fen, locked }: { fen: string; locked: boolean }) =>
        useChessboard({ fen, playerColor: 'white', locked }),
      { initialProps: { fen: PROMO_FEN, locked: false } }
    );
    act(() => {
      result.current.boardProps.onMove('a7', 'a8', meta);
    });
    expect(result.current.promotion).not.toBeNull();
    rerender({ fen: PROMO_FEN, locked: true });
    expect(result.current.promotion).toBeNull();

    rerender({ fen: PROMO_FEN, locked: false });
    act(() => {
      result.current.boardProps.onMove('a7', 'a8', meta);
    });
    expect(result.current.promotion).not.toBeNull();
    rerender({ fen: INITIAL_FEN, locked: false });
    expect(result.current.promotion).toBeNull();
  });

  it('plays engine moves through play(uci)', () => {
    const onMove = vi.fn();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useChessboard({ fen: INITIAL_FEN, playerColor: 'black', onMove })
    );
    let ok = false;
    act(() => {
      ok = result.current.play('e2e4');
    });
    expect(ok).toBe(true);
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ uci: 'e2e4' }));
    act(() => {
      ok = result.current.play('e2e5');
    });
    expect(ok).toBe(false);
    expect(onMove).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('honours the variant', () => {
    const CASTLE_FEN = 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
    const { result } = renderHook(() =>
      useChessboard({ fen: CASTLE_FEN, playerColor: 'white', variant: 'chess960' })
    );
    expect(result.current.boardProps.dests.get('e1')).not.toContain('g1');
    expect(result.current.boardProps.dests.get('e1')).toContain('h1');
  });
});
