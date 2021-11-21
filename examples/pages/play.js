import React, { useState, useEffect } from 'react';
import NextChessground from '../dynamic/NextChessground';
import Stockfish from '../lib/stockfish';
import Layout from '../components/Layout';

const Page = () => {
  const [engine] = useState(new Stockfish());
  useEffect(() => {
    engine.init();
  }, []);

  return (
    <Layout title="Basic example">
      <div className="grid md:grid-cols-2 gap-12">
        <NextChessground />
        <div>
          <h2 className="text-xl">Code sample</h2>
          <p className="text-gray-700">Coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
