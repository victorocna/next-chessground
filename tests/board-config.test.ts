import { describe, expect, it, vi } from 'vitest';
import { boardConfig } from '../src/board/board-config';
import type { BoardInput } from '../src/board/types';
import { DEFAULT_PREFS } from '../src/prefs/options';
import { INITIAL_FEN } from '../src/rules/position';

const input: BoardInput = {
  fen: INITIAL_FEN,
  orientation: 'white',
  turnColor: 'white',
  lastMove: null,
  check: false,
  movableColor: undefined,
  dests: new Map(),
  premovable: false,
  viewOnly: false,
};
const handlers = { after: vi.fn(), onShapesChange: vi.fn() };

describe('boardConfig', () => {
  it('keeps clearing keys present even when undefined', () => {
    const config = boardConfig(input, DEFAULT_PREFS, handlers);
    expect('lastMove' in config).toBe(true);
    expect(config.lastMove).toBeUndefined();
    expect(config.movable && 'color' in config.movable).toBe(true);
    expect(config.movable?.color).toBeUndefined();
  });

  it('reads coordinates from prefs unless overridden', () => {
    expect(boardConfig(input, { ...DEFAULT_PREFS, coordinates: false }, handlers).coordinates).toBe(
      false
    );
    expect(
      boardConfig(
        { ...input, coordinates: true },
        { ...DEFAULT_PREFS, coordinates: false },
        handlers
      ).coordinates
    ).toBe(true);
  });

  it('wires handlers and prefs', () => {
    const config = boardConfig(
      { ...input, movableColor: 'both', premovable: true },
      { ...DEFAULT_PREFS, showDests: false, highlight: false },
      handlers
    );
    expect(config.movable?.events?.after).toBe(handlers.after);
    expect(config.drawable?.onChange).toBe(handlers.onShapesChange);
    expect(config.movable?.color).toBe('both');
    expect(config.movable?.showDests).toBe(false);
    expect(config.premovable?.enabled).toBe(true);
    expect(config.highlight?.lastMove).toBe(false);
    expect(config.highlight?.check).toBe(true);
  });

  it('lets a drawn arrow end on the released square', () => {
    const config = boardConfig(input, DEFAULT_PREFS, handlers);
    expect(config.drawable?.defaultSnapToValidMove).toBe(false);
    expect(config.drawable?.enabled).toBe(true);
    expect(config.drawable?.visible).toBe(true);
  });

  it('disables dragging and drawing in view-only mode', () => {
    const config = boardConfig({ ...input, viewOnly: true }, DEFAULT_PREFS, handlers);
    expect(config.viewOnly).toBe(true);
    expect(config.draggable?.enabled).toBe(false);
    expect(config.drawable?.enabled).toBe(false);
  });
});
