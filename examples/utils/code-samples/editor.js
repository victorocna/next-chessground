const editor = `import { NextEditor } from 'next-chessground';

const Page = () => {
  const ref = useRef();

  const handleSelect = (fen) => {
    ...
  };

  return (
    <NextEditor ref={ref} onSelect={handleSelect} />
  );
};

export default Page;`;

export default editor;
