import { isEmpty } from 'lodash';
import EmptyMoveList from './EmptyMoveList';
import Move from './Move';
import { usePuzzleContext } from './PuzzleContext';

const MoveList = () => {
  const { history } = usePuzzleContext();

  const showMoves = (whiteMove, index) => {
    const moveNumber = index + 1;
    const blackMove = history[index * 2 + 1];
    const whiteIndex = index * 2;
    const blackIndex = index * 2 + 1;
    const lastMoveIndex = history.length - 1;

    return (
      <div className="w-full grid grid-cols-12">
        <div className="col-span-2 flex items-center justify-center bg-tertiary text-gray-500 py-1">
          <p>{moveNumber}.</p>
        </div>
        <Move move={whiteMove} isCurrent={whiteIndex === lastMoveIndex} />
        <Move move={blackMove} isCurrent={blackIndex === lastMoveIndex} />
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-secondary flex-1 overflow-hidden h-full rounded">
      <div className="flex flex-col overflow-y-auto flex-1">
        {isEmpty(history) ? (
          <EmptyMoveList />
        ) : (
          history.filter((_, index) => index % 2 === 0).map(showMoves)
        )}
      </div>
    </div>
  );
};

export default MoveList;
