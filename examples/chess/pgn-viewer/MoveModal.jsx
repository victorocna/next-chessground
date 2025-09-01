import { isFunction } from 'lodash';
import classnames from 'merge-class-names';
import { useEffect, useRef, useState } from 'react';
import { getMoveSuffix } from '../functions/pgn-helpers';

const MoveModal = ({
  variations = [],
  onChoice = () => {},
  onCancel = () => {},
  onFocusChange = () => {},
}) => {
  const ref = useRef(null);
  const [focus, setFocus] = useState(0);

  // Set focus on the container when mounted
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  // Notify parent component when focus changes so it can update the arrow
  useEffect(() => {
    if (isFunction(onFocusChange)) {
      onFocusChange(focus);
    }
  }, [focus, onFocusChange]);

  // Handle keyboard events to change focus or choose a variation
  const onKeyDown = (event) => {
    event.preventDefault();

    if (event.key === 'ArrowDown') {
      setFocus((prev) => (prev + 1) % variations.length);
    }
    if (event.key === 'ArrowUp') {
      setFocus((prev) => (prev - 1 + variations.length) % variations.length);
    }
    if (event.key === 'ArrowLeft') {
      onCancel();
    }
    if (event.key === 'ArrowRight') {
      if (isFunction(onChoice)) {
        onChoice(variations[focus].index);
      }
    }
  };

  const handleCancel = () => {
    if (isFunction(onCancel)) {
      onCancel();
    }
  };

  // Render each variation button with hover support to update focus
  const showVariations = (variation, index) => {
    return (
      <button
        key={variation.index}
        className={classnames(
          'flex rounded-lg hover:bg-tertiary gap-4 py-1 px-2',
          'items-center cursor-pointer text-white/80 hover:text-white',
          focus === index && 'bg-tertiary'
        )}
        onClick={() => onChoice(variation.index)}
        onMouseEnter={() => setFocus(index)}
      >
        <span>{getMoveSuffix(variation.fen)}</span>
        <p className="flex items-center">
          <span className="font-chess">{variation.move}</span>
        </p>
      </button>
    );
  };

  return (
    <div className="bg-secondary w-full rounded-xl max-h-[250px] max-w-80 overflow-y-auto">
      <div
        className="flex gap-2 text-white items-center justify-between
      font-semibold border-b p-2.5 border-tertiary outline-none"
      >
        <div className="flex items-center gap-2">
          <p>Choose variation</p>
        </div>
        <button
          className="text-white bg-tertiary h-6 w-6 border cursor-pointer rounded aspect-square
          flex items-center justify-center hover:bg-secondary"
          onClick={handleCancel}
        >
          <i className="fas fa-times text-sm" />
        </button>
      </div>
      <div
        ref={ref}
        onKeyDown={onKeyDown}
        tabIndex={0}
        className="flex flex-col gap-1 p-2 text-gray-300 outline-none"
      >
        {variations.map(showVariations)}
      </div>
    </div>
  );
};

export default MoveModal;
