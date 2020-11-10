import React, { useState, useEffect } from 'react';
import ChessgroundWrapper from './ChessgroundWrapper';

const Chessground = ({ board = 'green', pieces = 'cburnett', ...props }) => {
  const classes = ['chessground', board, pieces];

  // render pieces to correct squares on window resize
  const [key, setKey] = useState(Math.random());
  useEffect(() => {
    const resize = () => setKey(Math.random());
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  });

  return (
    <div key={key} className={classes.join(' ')}>
      <ChessgroundWrapper {...props} />
    </div>
  );
};

export default Chessground;
