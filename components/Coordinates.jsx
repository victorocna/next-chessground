import React from 'react';
import useChessground from '../hooks/use-chessground';

const Coordinates = () => {
  const { theme, handleChecked } = useChessground();

  return (
    <>
      <div>Coordinates</div>
      <div className="flex">
        <input
          name="coordinates"
          type="checkbox"
          className="checkbox rounded border border-gray-300"
          defaultChecked={theme.coordinates}
          onChange={handleChecked}
        />
      </div>
    </>
  );
};

export default Coordinates;
