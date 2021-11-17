import React from 'react';
import classnames from 'merge-class-names';
import Wrapper from './Wrapper';
import audio from '../lib/audio';
import useOrientation from '../hooks/use-orientation';
import Settings from './Settings';
import Flip from './Flip';
import Resize from './Resize';
import useChessground from '../hooks/use-chessground';

const Chessground = ({
  board = 'green',
  pieces = 'cburnett',
  sound = 'silent',
  orientation: side,
  ...props
}) => {
  const [config] = useChessground();
  const { orientation, flip } = useOrientation(side);

  const handleMove = () => {
    audio(sound);
  };

  return (
    <div className="flex relative">
      <div className={classnames('chessground', board, pieces)}>
        <Wrapper
          onMove={handleMove}
          {...props}
          orientation={orientation}
          coordinates={config.coordinates}
        />
      </div>
      <div className="text-gray-400 flex flex-col gap-2 px-1">
        <div className="flex-grow">
          <Resize />
        </div>
        <Flip onClick={flip} />
        <Settings />
      </div>
    </div>
  );
};

export default Chessground;
