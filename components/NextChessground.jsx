import React, { useState } from 'react';
import { Chessground } from '.';

const NextChessground = ({ board, pieces, ...props }) => {
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
      <Chessground {...props} />
    </div>
  );
};

export default NextChessground;
