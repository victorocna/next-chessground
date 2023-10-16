import React from 'react';

const Hydrate = ({ children }) => {
  return (
    <React.Fragment>
      {typeof window === 'undefined' ? null : children}
    </React.Fragment>
  );
};

export default Hydrate;
