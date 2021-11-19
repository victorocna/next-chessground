import React from 'react';

const Flip = (props) => {
  return (
    <button
      type="button"
      className="next-button next-flip"
      title="Flip board"
      {...props}
    >
      <i className="next-sync"></i>
    </button>
  );
};

export default Flip;
