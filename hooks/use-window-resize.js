import { useState, useEffect } from 'react';

const useWindowResize = () => {
  // render pieces to correct squares on window resize
  const [key, setKey] = useState(Math.random());
  useEffect(() => {
    const resize = () => setKey(Math.random());
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  });

  return key;
};

export default useWindowResize;
