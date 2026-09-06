import { useCallback } from 'react';
import { playSound } from '../sound/play';
import { useBoardPrefs } from './use-board-prefs';

/** The move sound of the current preference. */
export const useBoardSound = (): { play: () => void } => {
  const [prefs] = useBoardPrefs();
  const play = useCallback(() => playSound(prefs.sound), [prefs.sound]);
  return { play };
};
