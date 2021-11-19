import React, { useState } from 'react';
import Settings from './Settings';
import Flip from './Flip';
import ThemeContext from './ThemeContext';
import themable from '../lib/theme';
import Chessboard from './Chessboard';
import useOrientation from '../hooks/use-orientation';

const NextChessground = (props) => {
  const [theme, setTheme] = useState(themable());
  const [orientation, flip] = useOrientation(props);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="next-chessground">
        <Chessboard {...props} orientation={orientation} />
        <div className="text-gray-400 flex flex-col gap-2 px-1">
          <Settings />
          <Flip onClick={flip} />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default NextChessground;
