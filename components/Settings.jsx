import React from 'react';
import Modal from 'react-pure-modal';
import useDisclosure from '../hooks/use-disclosure';
import StyleBoard from './StyleBoard';
import Coordinates from './Coordinates';
import HighlightMove from './HighlightMove';
import ShowLegalMoves from './ShowLegalMoves';
import StylePieces from './StylePieces';
import PlaySounds from './PlaySounds';
import Sounds from './Sounds';

const Settings = () => {
  const { isOpen, show, hide } = useDisclosure();

  return (
    <>
      <button
        type="button"
        className="next-button next-settings"
        title="Settings"
        onClick={show}
      >
        <i className="next-cog"></i>
      </button>

      <Modal header="Settings" isOpen={isOpen} onClose={hide}>
        <div className="grid grid-cols-2 gap-3 items-center text-sm">
          <StylePieces />
          <StyleBoard />
          <HighlightMove />
          <ShowLegalMoves />
          <PlaySounds />
          <Sounds />
          <Coordinates />
        </div>
      </Modal>
    </>
  );
};

export default Settings;
