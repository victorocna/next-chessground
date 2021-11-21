/**
 * Constructor requires a path to stockfish to run correctly in a web browser
 */

const DEFAULT_PATH = '/chess/engine/stockfish.asm.js';
const DEFAULT_SKILL = 20;
const DEFAULT_CP_TOLERANCE = 25;
const DEFAULT_MATE_TOLERANCE = 0;

class Engine {
  constructor(props) {
    const { path = DEFAULT_PATH, skill = DEFAULT_SKILL, onInfoMessage } =
      props || {};
    if (!window.chessEngineWorker) {
      window.chessEngineWorker = new Worker(path);
    }
    this.onInfoMessage = onInfoMessage;
    this.skillLevel = skill;
    this.resolveTimeout = null;
    this.isAnalyzing = false;
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.MAX_DEPTH = 40;
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
    /**
     * OLD WAY OF COMPUTING SKILL LEVEL VALUES;
     * const maxError = (20 - this.skillLevel) * 250;
     * const probability = 1000 - (20 - this.skillLevel) * 50;
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
    /**
     * info depth 21 seldepth 30 multipv 1 score cp 9 nodes 2733558 nps 401050 hashfull 864 time 6816 pv e6d5 c1f4 f8d6 f4d6 d8d6 e2e3 c8f5 g1e2 b8d7 e2g3 f5g6 f1d3 c7c6 e1g1 e8g8 d3g6 h7g6 h2h3 a8c8 a1c1 f8e8 d1b3 c8b8 c3e2 g8h7 bmc 1.86128e-06
     */
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

  async new_position(fen) {
    await this.stop();
    await this.is_ready();
    this.set_position(fen);
    this.go_infinite();
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
        if (
          this.isInfoMessage(message) &&
          typeof this.onInfoMessage === 'function'
        ) {
          this.onInfoMessage(message.data);
        }
        if (message.data.startsWith('bestmove')) {
          resolve(message.data);
        }
      };
    });
  }

  go_infinite() {
    window.chessEngineWorker.postMessage('go infinite');
    this.isAnalyzing = true;
    window.chessEngineWorker.onmessage = (message) => {
      if (
        this.isInfoMessage(message) &&
        typeof this.onInfoMessage === 'function'
      ) {
        const msgData = this.parseData(message.data);
        const { depth } = msgData;
        if (depth > this.MAX_DEPTH) {
          this.stop();
        }
        this.onInfoMessage(msgData);
      }
    };
  }

  async isSimilarEval({ firstFen, secondFen, depth, tolerance }) {
    const firstScore = await this.get_score(firstFen, depth);
    const secondScore = await this.get_score(secondFen, depth);
    if (firstScore.type !== secondScore.type) {
      return false;
    }

    if (firstScore.type === 'cp') {
      const acceptedCpTolernace =
        (tolerance && tolerance.cp) || DEFAULT_CP_TOLERANCE;

      return (
        Math.abs(firstScore.value - secondScore.value) <= acceptedCpTolernace
      );
    } else {
      const acceptedMateTolerance =
        (tolerance && tolerance.mate) || DEFAULT_MATE_TOLERANCE;

      return (
        Math.abs(firstScore.value - secondScore.value) <= acceptedMateTolerance
      );
    }
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

module.exports = Engine;
module.exports.Stockfish = Engine;
