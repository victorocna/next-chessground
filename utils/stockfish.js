import constants from './constants';

class Stockfish {
  constructor() {
    if (typeof window === 'undefined') {
      return false;
    }
    if (!window.chessEngineWorker) {
      const worker = process.env.STOCKFISH_PATH;
      window.chessEngineWorker = new Worker(worker);
    }

    this.skillLevel = 20;
    this.resolveTimeout = null;
    this.isAnalyzing = false;
    this.fen = constants.initialFen;
  }
  getTurnFromFen(fen) {
    return fen.split(' ')[1];
  }
  normalizeScoreValue(value) {
    const { fen } = this;
    const turn = this.getTurnFromFen(fen);
    if (turn === 'b') {
      return -1 * value;
    }
    return value;
  }
  isInfoMessage(message) {
    if (!message || !message.data) {
      return false;
    }
    return message.data.startsWith('info');
  }
  setSkillLevel() {
    /**
     * skill level is 0-20, higher the stronger
     * skill level maximum error is 0-5000, lower the stronger
     * skill level probability is 1-1000, the higher the stronger
     * seems to be working with max value for maxError and min value for probability
     */
    const maxError = 5000;
    const probability = 1;
    window.chessEngineWorker.postMessage(
      'setoption name Skill Level value ' + this.skillLevel
    );
    window.chessEngineWorker.postMessage(
      'setoption name Skill Level Maximum Error value ' + maxError
    );
    window.chessEngineWorker.postMessage(
      'setoption name Skill Level Probability value ' + probability
    );
  }
  async init() {
    await this.use_uci();
    await this.is_ready();
    this.setSkillLevel();
  }

  getScoreFromInfo(msg) {
    if (msg.startsWith('info depth 0')) {
      // This happens when game is over.
      const split = msg.split(' ');
      const type = split[4];
      const value = this.normalizeScoreValue(Number(split[5]));
      this.isAnalyzing = false;
      return {
        type,
        value,
      };
    } else if (msg.startsWith('info depth ')) {
      const split = msg.split(' ');
      const type = split[8];
      const value = this.normalizeScoreValue(Number(split[9]));
      return {
        type,
        value,
      };
    }
    return {
      type: 'cp',
      value: 0,
    };
  }

  parseData(data) {
    const depth = data.split(' ')[2];
    let pv = '';
    if (data.indexOf(' pv ') > -1) {
      pv = data.split(' pv ')[1].split(' bmc ')[0];
    }
    const score = this.getScoreFromInfo(data);
    return {
      depth,
      pv,
      score,
    };
  }
  use_uci() {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('uci');

      window.chessEngineWorker.onmessage = (message) => {
        if (message.data === 'uciok') {
          resolve(message);
        }
      };
    });
  }
  is_ready() {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('isready');
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data === 'readyok') {
          resolve(message);
        }
      };
    });
  }
  set_position(fen) {
    return new Promise((resolve) => {
      this.fen = fen;
      window.chessEngineWorker.postMessage('position fen ' + fen);
      resolve();
    });
  }

  set_multipv(numPv) {
    window.chessEngineWorker.postMessage(
      'setoption name MultiPV value ' + numPv
    );
  }
  get_score(fen, depth = 15) {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('position fen ' + fen);
      window.chessEngineWorker.postMessage('go depth 15');
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data.startsWith('info depth ' + depth)) {
          const split = message.data.split(' ');
          const type = split[8];
          const value = Number(split[9]);
          resolve({
            type,
            value,
          });
        } else if (message.data.startsWith('info depth 0')) {
          // This happens when game is over.
          const split = message.data.split(' ');
          const type = split[4];
          const value = Number(split[5]);
          resolve({
            type,
            value,
          });
        }
      };
    });
  }
  go_depth(depth) {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('go depth ' + depth);
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          resolve(message.data);
        }
      };
    });
  }
  go_time(time) {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('go movetime ' + time);
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          resolve(message.data);
        }
      };
    });
  }
  stop() {
    return new Promise((resolve) => {
      if (!this.isAnalyzing) {
        resolve();
      }

      window.chessEngineWorker.postMessage('stop');
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          this.isAnalyzing = false;
          resolve(message.data);
        }
      };
    });
  }
  quit() {
    window.chessEngineWorker.postMessage('quit');
  }
}

export default Stockfish;
export { Stockfish };
