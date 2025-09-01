import { isEmpty } from 'lodash-es';
import cleanShapes from './shapes';

const cgProps = (props) => {
  const cgProps = {};

  // normalize orientation for Chessground
  if (props.orientation) {
    cgProps.orientation = props.orientation;
    if (cgProps.orientation === 'w') {
      cgProps.orientation = 'white';
    }
    if (cgProps.orientation === 'b') {
      cgProps.orientation = 'black';
    }
  }

  // pass props directly to Chessground
  const passProps = ['shapes', 'onSelect', 'drawable', 'lastMove'];
  for (const prop of passProps) {
    if (props[prop] && !isEmpty(props[prop])) {
      cgProps[prop] = props[prop];
    }
  }

  // helper that disables Chessground drawable option
  if (props.drawable === false) {
    cgProps.drawable = {
      enabled: false,
    };
  }

  // fix shapes
  if (cgProps.shapes) {
    cgProps.shapes = cleanShapes(cgProps.shapes);
  }

  // helper for Chessground editing mode
  if (props.editing) {
    cgProps.movable = { free: false };
    cgProps.drawable = { enabled: false };
  }

  if (props.viewOnly) {
    cgProps.draggable = false;
    cgProps.movable = { free: false };
    cgProps.drawable = { enabled: false };
  }

  if (props.readOnly) {
    cgProps.draggable = false;
    cgProps.movable = { free: false };
    cgProps.drawable = { enabled: false };
    cgProps.coordinates = false;
  }

  return cgProps;
};

export default cgProps;
