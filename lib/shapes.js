const cleanShapes = (shapes) => {
  try {
    // Iterate over each shape and remove the ']' character from the dest string
    shapes.forEach((shape) => {
      // Use a regular expression to remove all occurrences of ']'
      shape.dest = shape.dest.replace(/\]/g, '');
    });
    return shapes;
  } catch {
    return shapes;
  }
};

export default cleanShapes;
