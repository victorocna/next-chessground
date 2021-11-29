import React, { forwardRef, useState } from 'react';
import Theme from './Theme';
import Chessboard from './Chessboard';
import EditorPieces from './EditorPieces';
import FEN from '../utils/fen';
import dropPiece from '../utils/drop-piece';

const NextEditor = (props, ref) => {
  const [fen, setFen] = useState(props.fen || FEN.empty);
  const [selected, setSelected] = useState({ role: null, color: null });

  const onSelect = (key) => {
    const fen = dropPiece(ref.current.board, selected, key);
    setFen(fen);

    if (typeof props.onSelect === 'function') {
      props.onSelect(fen);
    }
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
      </div>
    </Theme>
  );
};

export default forwardRef(NextEditor);
