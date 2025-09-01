import { useMemo } from 'react';
import { getMoveArrow } from '../functions/shape-helpers';

/**
 * Custom hook that returns the variation arrow.
 *
 * @param {object} current - The current board state containing the FEN.
 * @param {array} variations - The list of variation objects.
 * @param {number} selectedVariationIndex - The index of the selected variation.
 * @returns {object|null} The arrow object or null if invalid.
 */
const useVariationArrows = (current, variations, selectedVariationIndex) => {
  return useMemo(() => {
    if (
      !variations ||
      variations?.length === 0 ||
      selectedVariationIndex < 0 ||
      selectedVariationIndex >= variations?.length
    ) {
      return null;
    }
    return getMoveArrow(current.fen, variations[selectedVariationIndex].move);
  }, [current.fen, variations, selectedVariationIndex]);
};

export default useVariationArrows;
