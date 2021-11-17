import React, { useState } from 'react';
import Settings from './Settings';
import Flip from './Flip';
import Resize from './Resize';
import ThemeContext from './ThemeContext';
import themable from '../lib/theme';
import NextChessground from './NextChessground';

const Chessground = (props) => {
  const [theme, setTheme] = useState(themable());
  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      <div className="flex relative">
        <NextChessground {...props} />
        <div className="text-gray-400 flex flex-col gap-2 px-1">
          <div className="flex-grow">
            <Resize />
          </div>
          <Flip />
          <Settings />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Chessground;
