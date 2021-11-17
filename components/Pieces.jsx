import React from 'react';
import local from 'store2';
import useChessground from '../hooks/use-chessground';

const Pieces = () => {
  const [config, setConfig] = useChessground();

  const handleChange = (event) => {
    const value = event.target.value;
    local.set('chessground.pieces', value);
    setConfig((state) => ({ ...state, pieces: value }));
  };

  return (
    <>
      <div>Pieces</div>
      <select
        className="bg-white border border-gray-300 px-2 py-1.5 w-full text-gray-800 rounded"
        defaultValue={config.pieces}
        onChange={handleChange}
      >
        <option value="cburnett">Classic</option>
        <option value="alpha">Alpha</option>
        <option value="neo">Neo</option>
      </select>
    </>
  );
};

export default Pieces;
