import { SILENT } from '../prefs/options';
import { CLIPS } from './clips';

const players = new Map<string, HTMLAudioElement>();

/**
 * One Audio element per set, rewound before each play. Browsers may refuse playback before
 * a user gesture; the rejection is ignored.
 */
export const playSound = (set: string): void => {
  if (set === SILENT || typeof Audio === 'undefined') {
    return;
  }
  const src = CLIPS[set];
  if (!src) {
    return;
  }
  let audio = players.get(set);
  if (!audio) {
    audio = new Audio(src);
    players.set(set, audio);
  }
  audio.currentTime = 0;
  audio.play().catch(() => undefined);
};
