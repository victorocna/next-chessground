import React, { useState } from 'react';
import { ChessgroundWrapper } from '.';

const Chessground = ({ board, pieces, ...props }) => {
  const classes = ['chessground', board, pieces];
  const [key, setKey] = useState(Math.random());

  let timeout;
  // debounce window resize event
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => setKey(Math.random()), 100);
    });
  }

  return (
    <div key={key} className={classes.join(' ')}>
      <ChessgroundWrapper {...props} />
    </div>
  );
};

export default Chessground;
