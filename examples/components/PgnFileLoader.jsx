import { useRef } from 'react';
import Button from './Button';

const PgnFileLoader = ({ rerender, onPgnLoad }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.pgn')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const pgnText = e.target.result;
        localStorage.setItem('pgn', pgnText);
        onPgnLoad(pgnText);
        rerender();
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <Button
        onClick={handleFileSelect}
        className="bg-accent hover:bg-accent-dark text-white px-3 py-1.5 -my-1 rounded-md text-sm font-medium transition-colors"
      >
        Load PGN
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pgn"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default PgnFileLoader;
