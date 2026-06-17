import { local } from 'store2';

const themable = () => {
  const theme = {
    board: 'green',
    pieces: 'cburnett',
    playSounds: true,
    sounds: 'robot',
    highlight: true,
    coordinates: true,
    showLegalMoves: true,
  };

  const cache = {
    board: local.get('chessground.board'),
    pieces: local.get('chessground.pieces'),
    playSounds: local.get('chessground.playSounds'),
    sounds: local.get('chessground.sounds'),
    highlight: local.get('chessground.highlight'),
    coordinates: local.get('chessground.coordinates'),
    showLegalMoves: local.get('chessground.showLegalMoves'),
  };

  for (const key of Object.keys(cache)) {
    if (cache[key] !== null && cache[key] !== undefined) {
      theme[key] = cache[key];
    }
  }

  return theme;
};

export default themable;
