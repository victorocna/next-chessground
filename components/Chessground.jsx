import React, { useState, useEffect, forwardRef } from 'react';
import Wrapper from './Wrapper';

const Chessground = (props, ref) => {
  const { board = 'green', pieces = 'cburnett' } = props;
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
      <Wrapper ref={ref} {...props} />
    </div>
  );
};

export default forwardRef(Chessground);
