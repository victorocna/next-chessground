import React from 'react';
import useChessground from '../hooks/use-chessground';

const Pieces = () => {
  const { theme, handleChange } = useChessground();

  return (
    <>
      <div>Pieces</div>
      <select
        name="pieces"
        className="bg-white border border-gray-300 px-2 py-1.5 w-full text-gray-800 rounded"
        defaultValue={theme.pieces}
        onChange={handleChange}
      >
        <option value="neo">Neo</option>
        <option value="alpha">Alpha</option>
        <option value="bases">Bases</option>
        <option value="classic">Classic</option>
      </select>
    </>
  );
};

export default Pieces;
