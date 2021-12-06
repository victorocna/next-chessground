import { useEffect, useRef, useState } from 'react';
import { NextEditor } from 'next-chessground';
import { editor } from '../utils/code-samples';
import { Highlight, Layout } from '../components';

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
    <Layout title="Chess editor">
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
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{editor}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
