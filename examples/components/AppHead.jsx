import React from 'react';
import Head from 'next/head';
import * as config from '../site.config';

const AppHead = () => {
  const showStylesheets = (href) => {
    return <link key={href} rel="stylesheet" href={href} />;
  };

  return (
    <Head>
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {config.stylesheets.map(showStylesheets)}
    </Head>
  );
};

export default AppHead;
