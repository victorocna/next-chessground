import React from 'react';
import useChessground from '../hooks/use-chessground';

const PlaySounds = () => {
  const { theme, handleChecked } = useChessground();

  return (
    <>
      <div>Play sounds</div>
      <div className="flex justify-end">
        <input
          name="playSounds"
          type="checkbox"
          className="checkbox rounded border border-gray-300"
          defaultChecked={theme.playSounds}
          onChange={handleChecked}
        />
      </div>
    </>
  );
};

export default PlaySounds;
