import { isEmpty } from 'lodash';
import { parseFen } from '../functions/fen-helpers';
import EmptyMoveList from './EmptyMoveList';
import Move from './Move';

const MoveList = ({ history, initialFen }) => {
  const fenParts = parseFen(initialFen);
  const { fullmoveNumber, activeColor } = fenParts || {};

  // Skip first move when black has the first move
  const moves = activeColor === 'b' ? [null, ...history] : history;

  const showMoves = (whiteMove, index) => {
    const moveNumber = (fullmoveNumber || 1) + index;
    const blackMove = moves[index * 2 + 1];
    const whiteIndex = index * 2;
    const blackIndex = index * 2 + 1;
    const lastMoveIndex = moves.length - 1;

    return (
      <div className="w-full grid grid-cols-12" key={index}>
        <div className="col-span-2 flex items-center justify-center bg-tertiary text-gray-500 py-1">
          <p>{moveNumber}.</p>
        </div>
        {whiteMove ? (
          <Move move={whiteMove} isCurrent={whiteIndex === lastMoveIndex} />
        ) : (
          <div className="col-span-5 flex items-center px-3 py-1 cursor-default text-gray-500 bg-secondary">
            <p>...</p>
          </div>
        )}
        <Move move={blackMove} isCurrent={blackIndex === lastMoveIndex} />
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-secondary flex-1 overflow-hidden h-full rounded">
      <div className="flex flex-col overflow-y-auto flex-1">
        {isEmpty(moves) ? (
          <EmptyMoveList initialFen={initialFen} />
        ) : (
          moves.filter((_, index) => index % 2 === 0).map(showMoves)
        )}
      </div>
    </div>
  );
};

export default MoveList;
