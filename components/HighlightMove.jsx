import React from 'react';
import useChessground from '../hooks/use-chessground';

const HighlightMove = () => {
  const { theme, handleChecked } = useChessground()

  return (
    <>
      <div>Highlight moves</div>
      <div className="flex justify-end">
        <input
          name="highlight"
          type="checkbox"
          className="checkbox rounded border border-gray-300"
          defaultChecked={theme.highlight}
          onChange={handleChecked}
        />
      </div>
    </>
  );
};

export default HighlightMove;
