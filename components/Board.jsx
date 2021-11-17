import React from 'react';
import local from 'store2';
import useChessground from '../hooks/use-chessground';

const Board = () => {
  const [config, setConfig] = useChessground();

  const handleBoard = (event) => {
    const value = event.target.value;
    local.set('chessground.board', value);
    setConfig((state) => ({ ...state, board: value }));
  };

  return (
    <>
      <div>Board</div>
          <select
            className="bg-white border border-gray-300 px-2 py-1.5 w-full text-gray-800 rounded"
            defaultValue={config.board}
            onChange={handleBoard}
          >
            <option value="green">Green</option>
            <option value="brown">Brown</option>
            <option value="blue">Blue</option>
          </select>
    </>
  )
}

export default Board
