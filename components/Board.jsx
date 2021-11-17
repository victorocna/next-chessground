import React from 'react';
import useChessground from '../hooks/use-chessground';

const Board = () => {
  const { theme, handleChange } = useChessground();

  return (
    <>
      <div>Board</div>
      <select
        name="board"
        className="bg-white border border-gray-300 px-2 py-1.5 w-full text-gray-800 rounded"
        defaultValue={theme.board}
        onChange={handleChange}
      >
        <option value="green">Green</option>
        <option value="brown">Brown</option>
        <option value="ruby">Ruby</option>
        <option value="teal">Teal</option>
      </select>
    </>
  );
};

export default Board;
