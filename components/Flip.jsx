import React from 'react';

const Flip = (props) => {
  return (
    <button
      type="button"
      className="cursor-pointer flex outline-none"
      title="Flip board"
      {...props}
    >
      <i className="fas fa-sync-alt"></i>
    </button>
  );
};

export default Flip;
