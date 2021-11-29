import React, { forwardRef } from 'react';
import Theme from './Theme';
import Chessboard from './Chessboard';
import useOrientation from '../hooks/use-orientation';
import Advanced from './Advanced';

const NextChessground = (props, ref) => {
  const [orientation, flip] = useOrientation(props);

  return (
    <Theme>
      <div className="next-chessground">
        <Chessboard {...props} ref={ref} orientation={orientation} />
        <Advanced flip={flip} readOnly={props.readOnly} />
      </div>
    </Theme>
  );
};

export default forwardRef(NextChessground);
