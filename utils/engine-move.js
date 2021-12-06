const engineMove = (moveString) => {
  /**
   * Engine reply format: bestmove e6f5 ponder a1b2,
   * where e6 is sqare_from, f5 is square_to
   * */
  const moveInfo = moveString.split(' ')[1]; //e6f5
  const from = moveInfo.substr(0, 2); //e6
  const to = moveInfo.substr(2, 2); //f5
  return {
    from,
    to,
    promotion: 'q',
  };
};

export default engineMove;
