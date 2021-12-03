import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

const Highlight = ({ children }) => {
  const ref = useRef();

  useEffect(() => {
    hljs.highlightElement(ref.current);
  }, []);

  return (
    <pre>
      <code ref={ref} className="language-javascript">
        {children}
      </code>
    </pre>
  );
};

export default Highlight;
