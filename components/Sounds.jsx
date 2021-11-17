import React from 'react';
import useChessground from '../hooks/use-chessground';

const Sounds = () => {
  const { theme, handleChange } = useChessground();

  return (
    <>
      <div>Sounds</div>
      <select
        name="sounds"
        className="bg-white border border-gray-300 px-2 py-1.5 w-full text-gray-800 rounded"
        defaultValue={theme.sounds}
        onChange={handleChange}
      >
        <option value="robot">Robot</option>
        <option value="piano">Piano</option>
        <option value="lisp">Lisp</option>
        <option value="sfx">SFX</option>
      </select>
    </>
  );
};

export default Sounds;
