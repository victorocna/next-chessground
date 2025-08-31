import classnames from 'merge-class-names';

const FeedbackIcon = ({ firstTurn, feedback, lastMove }) => {
  if (!feedback || !lastMove) {
    return null;
  }

  // Get the destination square of the last move
  const targetSquare = lastMove;

  // Calculate position based on algebraic notation
  let file = targetSquare.charCodeAt(0) - 97; // 'a' is 97 in ASCII, so a=0, b=1, etc.
  let rank = Number(targetSquare[1]) - 1; // Convert rank to 0-based index

  // Mirror the coordinates if the first turn is black
  if (firstTurn === 'b') {
    file = 7 - file;
    rank = 7 - rank;
  }

  const leftClasses = [
    'left-0',
    'left-[12.5%]',
    'left-[25%]',
    'left-[37.5%]',
    'left-[50%]',
    'left-[62.5%]',
    'left-[75%]',
    'left-[87.5%]',
  ];

  const bottomClasses = [
    'bottom-0',
    'bottom-[12.5%]',
    'bottom-[25%]',
    'bottom-[37.5%]',
    'bottom-[50%]',
    'bottom-[62.5%]',
    'bottom-[75%]',
    'bottom-[87.5%]',
  ];

  const leftClass = leftClasses[file];
  const bottomClass = bottomClasses[rank];

  return (
    <div className={classnames('top-right w-[14%] h-[14%]', leftClass, bottomClass)}>
      <div className="relative w-4 h-4 md:w-5 md:h-5 animate-feedback-in rounded-full z-100">
        {feedback === 'success' && (
          <div className="absolute bg-green-500 inset-0 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-white text-xs 2xl:text-sm"></i>
          </div>
        )}
        {feedback === 'error' && (
          <div className="absolute bg-red-500 inset-0 rounded-full flex items-center justify-center">
            <i className="fas fa-times text-white text-xs 2xl:text-sm"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackIcon;
