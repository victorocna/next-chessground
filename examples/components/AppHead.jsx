import React from 'react';
import Head from 'next/head';
import * as config from '../site.config';

const AppHead = () => (
  <Head>
    <title>{config.sitename}</title>
    <meta name="description" content={config.description} />
    {config.googleFonts && <link rel="stylesheet" href={config.googleFonts} />}
    {config.fontAwesome && <link rel="stylesheet" href={config.fontAwesome} />}
    {config.tailwindcss && <link rel="stylesheet" href={config.tailwindcss} />}
  </Head>
);

export default AppHead;
