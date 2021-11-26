import React from 'react';
import classnames from 'merge-class-names';
import useChessground from '../hooks/use-chessground';
import SparePiece from './SparePiece';

const EditorPieces = (props) => {
  const { theme } = useChessground();

  const roles = ['bin', 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
  const showPiece = (role, props) => {
    const { color = 'white', selected = { role: null, color: null } } = props;
    const highlighted = role === selected.role && color === selected.color;

    return (
      <SparePiece
        key={`${role}-${color}`}
        highlighted={highlighted}
        role={role}
        color={color}
        {...props}
      />
    );
  };

  return (
    <div className="next-chessground">
      <div className={classnames('spare-pieces', theme.pieces)}>
        {roles.map((role) => showPiece(role, props))}
      </div>
    </div>
  );
};

export default EditorPieces;
