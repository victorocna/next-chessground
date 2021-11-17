import { useState } from 'react';
import { local } from 'store2';

const useChessground = () => {
  const defaults = {
    board: 'green',
    pieces: 'cburnett',
    playSounds: true,
    sounds: 'robot',
    highlight: true,
    coordinates: true,
  };

  const cache = {
    board: local.get('chessground.board'),
    pieces: local.get('chessground.pieces'),
    playSounds: local.get('chessground.playSounds'),
    sounds: local.get('chessground.sounds'),
    highlight: local.get('chessground.highlight'),
    coordinates: local.get('chessground.coordinates'),
  };

  for (const key of Object.keys(cache)) {
    if (cache[key]) {
      defaults[key] = cache[key];
    }
  }
  const [config, setConfig] = useState(defaults);

  return [config, setConfig];
};

export default useChessground;
