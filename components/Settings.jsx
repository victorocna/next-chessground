import React from 'react';
import Modal from 'react-pure-modal';
import useChessground from '../hooks/use-chessground';
import useDisclosure from '../hooks/use-disclosure';
import Board from './Board';
import Coordinates from './Coordinates';
import Pieces from './Pieces';

const Settings = () => {
  // eslint-disable-next-line
  const [config, setConfig] = useChessground();
  const { isOpen, show, hide } = useDisclosure();

  return (
    <>
      <button
        type="button"
        className="cursor-pointer flex outline-none"
        title="Settings"
        onClick={show}
      >
        <i className="fas fa-cog"></i>
      </button>

      <Modal header="Settings" isOpen={isOpen} onClose={hide}>
        <div className="grid grid-cols-2 gap-3 items-center text-sm">
          <Pieces />
          <Board />

          <div>Highlight moves</div>
          <div className="flex justify-end">
            <input
              type="checkbox"
              className="checkbox rounded border border-gray-300"
              checked={config.highlight}
            />
          </div>

          <div>Play sounds</div>
          <div className="flex justify-end">
            <input
              type="checkbox"
              className="checkbox rounded border border-gray-300"
              checked={config.playSounds}
            />
          </div>

          <div>Sounds</div>
          <select className="bg-white border border-gray-300 px-2 py-1.5 w-full text-gray-800 rounded">
            <option value="robot">Robot</option>
            <option value="piano">Piano</option>
            <option value="lisp">Lisp</option>
            <option value="sfx">SFX</option>
          </select>

          <Coordinates />
        </div>
      </Modal>
    </>
  );
};

export default Settings;
