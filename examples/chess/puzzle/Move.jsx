import classnames from 'merge-class-names';

const Move = ({ isCurrent, move }) => {
  return (
    <div
      className={classnames(
        'col-span-5 flex items-center px-3 py-1 cursor-default text-gray-500 bg-secondary',
        isCurrent && 'font-bold'
      )}
    >
      <span className="font-chess">{move?.san}</span>
    </div>
  );
};

export default Move;
