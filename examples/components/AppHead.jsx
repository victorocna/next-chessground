import React from 'react';
import Head from 'next/head';
import * as config from '../site.config';

const AppHead = () => {
  const showStylesheets = (href) => {
    return <link key={href} rel="stylesheet" href={href} />;
  };
  const showScripts = (src) => {
    return <script key={src} type="text/javascript" src={src}></script>;
  };

  return (
    <Head>
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      {config.stylesheets.map(showStylesheets)}
      {config.scripts.map(showScripts)}
    </Head>
  );
};

export default AppHead;
