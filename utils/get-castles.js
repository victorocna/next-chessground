const getCastles = (initial, option) => {
  if (!option) {
    return initial;
  }

  const all = ['K', 'Q', 'k', 'q'];

  const array = all.map((letter) => {
    if (letter !== option) {
      if (initial.includes(letter)) {
        return letter;
      }

      return '';
    }

    if (initial.includes(option)) {
      return '';
    }

    return option;
  });

  const string = array.join('');

  return string.length ? string : '-';
};

export default getCastles;
