import React, { forwardRef, useEffect, useState } from 'react';
import Theme from './Theme';
import Chessboard from './Chessboard';
import EditorPieces from './EditorPieces';
import constants from '../utils/constants';
import dropPiece from '../utils/drop-piece';
import FenOptions from './FenOptions';

const NextEditor = (props, ref) => {
  const [fen, setFen] = useState(props.fen || constants.emptyFen);
  const [selected, setSelected] = useState({ role: null, color: null });

  useEffect(() => {
    if (typeof props.onSelect === 'function') {
      props.onSelect(fen);
    }
  }, [fen]);

  const onSelect = (key) => {
    const array = fen.split(' ');
    array.shift();

    const options = array.join(' ');
    const position = dropPiece(ref.current.board, selected, key);

    const withOptions = [position, options].join(' ');
    setFen(withOptions);
  };

  const handleChange = (options) => {
    const position = fen.split(' ')[0];

    const withOptions = [position, options, '- 0 1'].join(' ');
    setFen(withOptions);
  };

  return (
    <Theme>
      <div className="next-chessground gap-2">
        <EditorPieces
          selected={selected}
          selectPiece={setSelected}
          color="black"
        />
        <Chessboard {...props} ref={ref} onSelect={onSelect} fen={fen} />
        <EditorPieces
          selected={selected}
          selectPiece={setSelected}
          color="white"
        />
        <FenOptions onChange={handleChange} />
      </div>
    </Theme>
  );
};

export default forwardRef(NextEditor);
