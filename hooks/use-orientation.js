import { useState } from 'react';

const useOrientation = (initial = 'white') => {
  const [orientation, setOrientation] = useState(initial);
  const flip = () => {
    setOrientation((state) => {
      return state === 'white' ? 'black' : 'white';
    });
  };

  return { orientation, flip };
};

export default useOrientation;
