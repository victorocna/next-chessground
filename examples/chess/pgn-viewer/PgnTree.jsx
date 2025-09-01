import { omit } from 'lodash';
import classnames from 'merge-class-names';
import { Fragment, useEffect, useRef } from 'react';
import { getMoveNumber, isMoveActive } from '../functions/pgn-helpers';
import Comment from './Comment';
import Move from './Move';
import Shape from './Shape';

const PgnTree = ({ tree, current, onMoveClick }) => {
  const containerRef = useRef();
  const momentsDictionaryRef = useRef({});

  useEffect(() => {
    if (containerRef.current && current.index) {
      const childEl = momentsDictionaryRef.current[current.index];
      if (childEl) {
        childEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [current.index]);

  const showMomentAsGrid = (moment, inBlockIndex, block) => {
    const { move, fen, index, shapes, comment, suffix } = moment;
    let { previous } = moment;
    if (!previous) {
      previous = block[inBlockIndex - 1];
    }
    const isActive = isMoveActive(current, moment);
    const isWhiteMove = fen?.split(' ')[1] === 'b';
    const shouldShowAddOn =
      (isWhiteMove && (comment || !block[inBlockIndex + 1])) ||
      (!isWhiteMove && (!previous?.move || previous?.comment));
    const shouldShowMoveNumber = move && (isWhiteMove || shouldShowAddOn);

    return (
      <Fragment key={`${move}-${fen}-${index}`}>
        {move && (
          <>
            {shouldShowMoveNumber && (
              <div className="col-span-2 flex items-center justify-center bg-tertiary text-gray-500 border-gray-600">
                <p>{getMoveNumber(fen)}.</p>
              </div>
            )}
            {!isWhiteMove && shouldShowAddOn && (
              <div className="col-span-5 flex items-center px-3 py-1 bg-secondary">
                <p>...</p>
              </div>
            )}
            <div
              ref={(el) => (momentsDictionaryRef.current[moment.index] = el)}
              className={classnames(
                'col-span-5 flex items-center px-3 py-1 cursor-pointer hover:bg-accent hover:text-white',
                isActive ? 'bg-accent text-white font-bold' : 'bg-secondary'
              )}
              onClick={() => onMoveClick(moment)}
            >
              <span className="font-chess">{move}</span>
              {suffix && <span className="ml-1 font-bold text-lg text-green-500">{suffix}</span>}
              {shapes && <Shape extraClass="ml-2" />}
            </div>
            {isWhiteMove && shouldShowAddOn && (
              <div className="col-span-5 flex items-center px-3 py-1 bg-secondary">
                <p>...</p>
              </div>
            )}
          </>
        )}
        {comment && (
          <div className="col-span-12 my-2 px-2">
            {showMomentAsBlock(omit(moment, ['move']), inBlockIndex, block)}
          </div>
        )}
      </Fragment>
    );
  };

  const showMomentAsBlock = (moment, inBlockIndex, block) => {
    const { comment, move, fen, shapes, index, suffix } = moment;
    let { previous } = moment;
    if (!previous) {
      previous = block[inBlockIndex - 1];
    }
    const isActive = isMoveActive(current, moment);

    return (
      <Fragment key={`${move}-${fen}-${index}`}>
        {move && (
          <div
            ref={(el) => (momentsDictionaryRef.current[moment.index] = el)}
            className="inline-block"
            onClick={() => onMoveClick(moment)}
          >
            <Move isActive={isActive} previous={previous} suffix={suffix} {...moment} />
          </div>
        )}
        {shapes && <Shape />}
        {comment && <Comment comment={comment} />}
      </Fragment>
    );
  };

  const showBlock = (block = [], index, array) => {
    if (!block.length) {
      return null;
    }
    if (index) {
      block[0].previous = array[index - 1][array[index - 1].length - 1];
    }
    const isLowestDepth = block[0].depth === 1;
    const paddingLeft = `${(block[0].depth - 1) * 0.75}rem`;

    return (
      <>
        {isLowestDepth ? (
          <div key={index} className="w-full grid grid-cols-12">
            {block.map(showMomentAsGrid)}
          </div>
        ) : (
          <div key={index} className="text-wrap my-2" style={{ paddingLeft }}>
            {block.map(showMomentAsBlock)}
          </div>
        )}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-secondary text-gray-300 text-sm leading-relaxed min-h-0"
    >
      <div className="h-full flex flex-col">
        {tree.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p>No moves to display yet</p>
          </div>
        ) : (
          tree.map(showBlock)
        )}
      </div>
    </div>
  );
};

export default PgnTree;
