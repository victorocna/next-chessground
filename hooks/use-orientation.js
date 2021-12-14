import { useEffect, useState } from 'react';

const sideToMove = (fen) => {
  const fenOrientation = fen.split(' ')[1];
  return fenOrientation === 'w' ? 'white' : 'black';
};

const getOrientation = (props) => {
  try {
    if (props.orientation) {
      return props.orientation;
    }
    if (props.fen) {
      return sideToMove(props.fen);
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

  useEffect(() => {
    setOrientation(sideToMove(props.fen));
  }, [props.reset]);

  return [orientation, flip];
};

export default useOrientation;
