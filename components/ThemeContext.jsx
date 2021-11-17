import { createContext } from 'react';

const ThemeContext = createContext({
  theme: {
    board: 'green',
    pieces: 'neo',
    playSounds: true,
    sounds: 'robot',
    highlight: true,
    coordinates: true,
  },
  setTheme: () => {},
});

export default ThemeContext;
