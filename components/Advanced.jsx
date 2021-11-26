import React from 'react';
import Settings from './Settings';
import Flip from './Flip';

const Advanced = ({ flip, readOnly }) => {
  if (readOnly) {
    return null;
  }

  return (
    <div className="text-gray-400 flex flex-row-reverse gap-2 py-1.5">
      <Settings />
      <Flip onClick={flip} />
    </div>
  );
};

export default Advanced;
