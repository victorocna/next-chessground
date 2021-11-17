import React from 'react';

const SparePiece = ({ role, color, selectPiece }) => {
  const handleClick = () => {
    if (typeof selectPiece === 'function') {
      selectPiece({ role, color });
    }
  };

  return (
    <div className="edit-square border border-gray-300 rounded">
      <piece
        className={`${role} ${color} spare-piece`}
        onClick={handleClick}
      ></piece>
    </div>
  );
};

export default SparePiece;
