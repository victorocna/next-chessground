const cgProps = (props) => {
  const cgProps = {};

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

  if (props.drawable === false) {
    cgProps.drawable = {
      enabled: false,
    };
  }

  // pass props directly to Chessground
  const passProps = ['shapes', 'onSelect'];
  for (const prop of passProps) {
    cgProps[prop] = props[prop];
  }

  return cgProps;
};

export default cgProps;
