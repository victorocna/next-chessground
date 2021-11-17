import { useContext } from 'react';
import { local } from 'store2';
import ThemeContext from '../components/ThemeContext';

const useChessground = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleChecked = (event) => {
    const name = event.target.name;
    const checked = event.target.checked;

    local.set(`chessground.${name}`, checked);
    setTheme((state) => ({
      ...state,
      [name]: checked,
    }));
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    local.set(`chessground.${name}`, value);
    setTheme((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return { theme, setTheme, handleChecked, handleChange };
};

export default useChessground;
