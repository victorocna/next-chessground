import { useCallback } from 'react';
import { playSound } from '../sound/play';
import { useBoardPrefs } from './use-board-prefs';

/** The move sound of the current preference. `event` is accepted for future capture/check clips. */
export const useBoardSound = (): { play: (event?: string) => void } => {
  const [prefs] = useBoardPrefs();
  const play = useCallback(() => playSound(prefs.sound), [prefs.sound]);
  return { play };
};
