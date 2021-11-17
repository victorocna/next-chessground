import React from 'react';
import Modal from 'react-pure-modal';
import SparePiece from './SparePiece';

const Promote = ({ isOpen, hide, onPromote, color = 'white' }) => {
  const promoteTo = (promotion) => {
    onPromote(promotion);
    hide();
  };

  return (
    <Modal header="Pawn promotion" isOpen={isOpen} onClose={hide}>
      <div className="flex gap-2 justify-center">
        <SparePiece
          color={color}
          role="queen"
          selectPiece={() => promoteTo('q')}
        />
        <SparePiece
          color={color}
          role="rook"
          selectPiece={() => promoteTo('r')}
        />
        <SparePiece
          color={color}
          role="bishop"
          selectPiece={() => promoteTo('b')}
        />
        <SparePiece
          color={color}
          role="knight"
          selectPiece={() => promoteTo('n')}
        />
      </div>
    </Modal>
  );
};

export default Promote;
