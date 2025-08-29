import { AppHead, NoSsr } from '../components';
import '../css/index.css';

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
