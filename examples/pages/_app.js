import React from 'react';
import { AppHead, NoSsr } from '../components';
import '../css/menu.css';

const Root = (props) => {
  const { Component, pageProps } = props;

  return (
    <NoSsr>
      <AppHead />
      <Component {...pageProps} />
    </NoSsr>
  );
};

export default Root;
