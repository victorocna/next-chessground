import React, { forwardRef, useState } from 'react';
import ThemeContext from './ThemeContext';
import themable from '../lib/theme';
import Chessboard from './Chessboard';
import useOrientation from '../hooks/use-orientation';
import Advanced from './Advanced';

const NextChessground = (props, ref) => {
  const [theme, setTheme] = useState(themable());
  const [orientation, flip] = useOrientation(props);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="next-chessground">
        <Chessboard {...props} ref={ref} orientation={orientation} />
        <Advanced flip={flip} readOnly={props.readOnly} />
      </div>
    </ThemeContext.Provider>
  );
};

export default forwardRef(NextChessground);
