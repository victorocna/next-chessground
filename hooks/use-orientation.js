import { useState } from 'react';

const useOrientation = (props) => {
  const [orientation, setOrientation] = useState(props.orientation || 'white');
  const flip = () => {
    setOrientation((state) => {
      return state === 'white' ? 'black' : 'white';
    });
  };

  return [orientation, flip];
};

export default useOrientation;
