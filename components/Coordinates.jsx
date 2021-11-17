import React from 'react';
import local from 'store2';
import useChessground from '../hooks/use-chessground';

const Coordinates = () => {
  const [config, setConfig] = useChessground();

  const handleChange = (event) => {
    const checked = event.target.checked;
    local.set('chessground.coordinates', checked);
    setConfig((state) => ({ ...state, pieces: checked }));
  };

  return (
    <>
      <div>Coordinates</div>
      <div className="flex justify-end">
        <input
          type="checkbox"
          className="checkbox rounded border border-gray-300"
          defaultChecked={config.coordinates}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default Coordinates;
