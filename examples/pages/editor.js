import { useEffect, useRef, useState } from 'react';
import { NextEditor } from 'next-chessground';
import Layout from '../components/Layout';

const Page = () => {
  const ref = useRef();
  const [value, setValue] = useState('');
  useEffect(() => {
    if (ref.current.board) {
      setValue(`${ref.current.board.getFen()} w - - 0 1`);
    }
  }, [ref]);

  const handleSelect = (fen) => {
    setValue(fen);
  };

  return (
    <Layout title="Chess Editor">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <NextEditor ref={ref} onSelect={handleSelect} />
          <div className="my-2 flex flex-col">
            <label>
              FEN: <small>Forsyth-Edwards Notation</small>
            </label>
            <input
              type="text"
              className="rounded px-2 py-1 border border-gray-300"
              value={value}
              readOnly={true}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl">Code sample</h2>
          <p className="text-gray-700">Coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
