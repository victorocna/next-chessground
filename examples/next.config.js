const path = require('path');

module.exports = {
  distDir: 'out',
  agentRules: false,
  turbopack: {
    root: path.join(__dirname),
  },
  env: {
    STOCKFISH_PATH: process.env.STOCKFISH_PATH || '/stockfish.asm.js',
  },
};
