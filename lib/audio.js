import lisp from '../assets/sounds/lisp.ogg';
import piano from '../assets/sounds/piano.ogg';
import robot from '../assets/sounds/robot.ogg';
import sfx from '../assets/sounds/sfx.ogg';

const play = (file) => {
  try {
    new Audio(file).play();
  } catch {
    return () => {};
  }
};

const audio = (sound) => {
  if (sound === 'silent') {
    return false;
  }

  switch (sound) {
    case 'lisp':
      return play(lisp);
    case 'piano':
      return play(piano);
    case 'sfx':
      return play(sfx);
    default:
      return play(robot);
  }
};

export default audio;
