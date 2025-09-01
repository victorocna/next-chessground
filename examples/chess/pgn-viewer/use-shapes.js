import { compact } from 'lodash';
import { useState } from 'react';
import useVariationArrows from './use-variation-arrows';

const useShapes = ({ userMoves, current, variations }) => {
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);

  const variationArrow = useVariationArrows(current, variations, selectedVariationIndex);

  const shapes = compact([...(!userMoves && current.shapes ? current.shapes : []), variationArrow]);

  return { shapes, refocusModal: setSelectedVariationIndex };
};

export default useShapes;
