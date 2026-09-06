import React from 'react';
import { AppHead } from '../components';
import 'next-chessground/styles.css';
import 'next-chessground/pieces.css';
import 'highlight.js/styles/github.css';
import '../css/site.css';

const Root = (props) => {
  const { Component, pageProps } = props;

  // No NoSsr wrapper: the 2.0 board renders a sized placeholder on the server
  // and creates chessground after hydration.
  return (
    <>
      <AppHead />
      <Component {...pageProps} />
    </>
  );
};

export default Root;
