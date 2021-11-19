import React from 'react';
import Modal from 'react-pure-modal';
import useDisclosure from '../hooks/use-disclosure';
import Board from './Board';
import Coordinates from './Coordinates';
import HighlightMove from './HighlightMove';
import Pieces from './Pieces';
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
          <Pieces />
          <Board />
          <HighlightMove />
          <PlaySounds />
          <Sounds />
          <Coordinates />
        </div>
      </Modal>
    </>
  );
};

export default Settings;
