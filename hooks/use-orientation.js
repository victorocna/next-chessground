import { useState } from 'react';

const getOrientation = (props) => {
  try {
    if (props.orientation) {
      return props.orientation;
    }

    if (props.fen) {
      const fenOrientation = props.fen.split(' ')[1];
      return fenOrientation === 'w' ? 'white' : 'black';
    }

    return 'white';
  } catch {
    return 'white';
  }
};

const useOrientation = (props) => {
  const [orientation, setOrientation] = useState(getOrientation(props));
  const flip = () => {
    setOrientation((state) => {
      return state === 'white' ? 'black' : 'white';
    });
  };

  return [orientation, flip];
};

export default useOrientation;
