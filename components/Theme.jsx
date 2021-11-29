import React, { useState } from 'react';
import ThemeContext from './ThemeContext';
import themable from '../lib/theme';

const Theme = ({ children }) => {
  const [theme, setTheme] = useState(themable());

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default Theme;
