import { getMoveSuffix, showMoveIndex } from '../functions/pgn-helpers';

const Move = ({ move, fen, depth, previous, isActive, onClick }) => {
  const classes = ['inline-flex items-end cursor-pointer mx-1 px-0.5'];
  if (depth === 1) {
    classes.push('font-semibold');
  }
  if (depth > 1 && !isActive) {
    classes.push('text-gray-400');
  }
  if (isActive) {
    classes.push('text-white bg-accent rounded');
  }

  return (
    <span className={classes.join(' ')} onClick={onClick}>
      {showMoveIndex(previous, fen, depth) && <span className="mr-1">{getMoveSuffix(fen)}</span>}
      <span className="font-chess">{move}</span>
    </span>
  );
};

export default Move;
