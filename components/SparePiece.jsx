import React from 'react';
import classnames from 'merge-class-names';

const SparePiece = ({ role, color, highlighted, selectPiece }) => {
  const bin = role === 'bin';
  const handleClick = () => {
    if (typeof selectPiece === 'function') {
      selectPiece({ role, color });
    }
  };

  return (
    <div
      className={classnames(
        'edit-square border border-gray-300 rounded',
        highlighted && 'bg-orange-300'
      )}
    >
      <piece
        className={classnames('spare-piece', role, color, bin && 'next-trash')}
        onClick={handleClick}
      ></piece>
    </div>
  );
};

export default SparePiece;
