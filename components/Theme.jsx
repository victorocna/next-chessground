import React, { useState } from 'react';
import ThemeContext from './ThemeContext';
import Hydrate from './Hydrate';
import themable from '../lib/theme';

const Theme = ({ children }) => {
  const [theme, setTheme] = useState(themable());

  return (
    <Hydrate>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </Hydrate>
  );
};

export default Theme;
