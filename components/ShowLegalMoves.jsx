import React from 'react';
import useChessground from '../hooks/use-chessground';

const ShowLegalMoves = () => {
  const { theme, handleChecked } = useChessground();

  return (
    <>
      <div>Show legal moves</div>
      <div className="flex">
        <input
          name="showLegalMoves"
          type="checkbox"
          className="checkbox rounded border border-gray-300"
          defaultChecked={theme.showLegalMoves}
          onChange={handleChecked}
        />
      </div>
    </>
  );
};

export default ShowLegalMoves;
