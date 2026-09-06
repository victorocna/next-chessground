import { afterEach, describe, expect, it, vi } from 'vitest';
import { CLIPS } from '../src/sound/clips';
import { playSound } from '../src/sound/play';

class FakeAudio {
  static created: FakeAudio[] = [];
  currentTime = 1;
  play = vi.fn(() => Promise.resolve());
  constructor(public src: string) {
    FakeAudio.created.push(this);
  }
}

describe('sounds', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    FakeAudio.created = [];
  });

  it('ships the four clips as ogg data urls', () => {
    expect(Object.keys(CLIPS).sort()).toEqual(['lisp', 'piano', 'robot', 'sfx']);
    for (const clip of Object.values(CLIPS)) {
      expect(clip.startsWith('data:audio/ogg;base64,')).toBe(true);
      expect(clip.length).toBeGreaterThan(1000);
    }
  });

  it('plays a clip once per set, rewound', () => {
    vi.stubGlobal('Audio', FakeAudio);
    playSound('robot');
    playSound('robot');
    expect(FakeAudio.created).toHaveLength(1);
    const audio = FakeAudio.created[0]!;
    expect(audio.src).toBe(CLIPS.robot);
    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalledTimes(2);
  });

  it('is silent for the silent set and unknown sets', () => {
    vi.stubGlobal('Audio', FakeAudio);
    playSound('silent');
    playSound('nope');
    expect(FakeAudio.created).toHaveLength(0);
  });
});
