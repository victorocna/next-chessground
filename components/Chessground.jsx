import React from 'react';
import classnames from 'merge-class-names';
import Wrapper from './Wrapper';
import useWindowResize from '../hooks/use-window-resize';
import audio from '../lib/audio';

const Chessground = ({
  board = 'green',
  pieces = 'cburnett',
  sound = 'silent',
  ...props
}) => {
  const key = useWindowResize();
  const handleMove = () => {
    audio(sound);
  };

  return (
    <div key={key} className={classnames('chessground', board, pieces)}>
      <Wrapper onMove={handleMove} {...props} />
      <div className="flex">
        <i className="fas fa-cog"></i>
        <i className="fas fa-exchange-alt"></i>
        <i className="fas fa-expand-alt"></i>
      </div>
    </div>
  );
};

export default Chessground;
