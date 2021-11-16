import { Chessground } from 'next-chessground';

const IndexPage = () => (
  <main className="min-h-screen px-4 py-8 flex flex-col items-center justify-center">
    <div className="flex flex-col w-full px-4 lg:px-12 py-8 my-8 bg-white rounded-lg max-w-xl">
      <h2 className="font-bold text-2xl mb-4">Next Chessground</h2>
      <Chessground coordinates={true} sound="lisp" />
    </div>
  </main>
);

export default IndexPage;
