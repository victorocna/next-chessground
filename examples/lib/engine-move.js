/**
 * Reads the UCI move out of a Stockfish reply.
 * The reply looks like "bestmove e2e4 ponder e7e5", or "bestmove e7e8q" when the
 * engine promotes. Returns the bare UCI string ("e2e4", "e7e8q"), or null when the
 * engine has no move to make ("bestmove (none)").
 */
const engineMove = (reply) => {
  const uci = String(reply ?? '').split(' ')[1];
  if (!uci || uci === '(none)') {
    return null;
  }
  return uci;
};

export default engineMove;
