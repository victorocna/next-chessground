import { createContext } from 'react';

const ThemeContext = createContext({
  theme: {
    board: 'green',
    pieces: 'cburnett',
    playSounds: true,
    sounds: 'robot',
    highlight: true,
    coordinates: true,
  },
  setTheme: () => {},
});

export default ThemeContext;
