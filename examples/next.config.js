module.exports = {
  distDir: 'out',
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    STOCKFISH_PATH: process.env.STOCKFISH_PATH,
  },
};
