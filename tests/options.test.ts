import { describe, expect, it } from 'vitest';
import { BOARDS, DEFAULT_PREFS, PIECES, SILENT, SOUNDS } from '../src/index';

describe('options', () => {
  it('lists five boards, five piece sets and five sounds', () => {
    expect(BOARDS).toHaveLength(5);
    expect(PIECES).toHaveLength(5);
    expect(SOUNDS).toHaveLength(5);
  });

  it('defaults point to existing ids', () => {
    expect(BOARDS).toContain(DEFAULT_PREFS.board);
    expect(PIECES).toContain(DEFAULT_PREFS.pieces);
    expect(SOUNDS).toContain(DEFAULT_PREFS.sound);
    expect(SOUNDS).toContain(SILENT);
  });
});
