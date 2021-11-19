import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

const NextChessground = dynamic(() => import('next-chessground'), {
  ssr: false,
});

const Page = () => (
  <Layout title="With queen">
    <div className="grid md:grid-cols-2 gap-12">
      <NextChessground fen="8/8/8/8/6q1/5k2/8/7K b - - 0 1" />
      <div>
        <h2 className="text-xl">Code sample</h2>
        <p className="text-gray-700">Coming soon...</p>
      </div>
    </div>
  </Layout>
);

export default Page;
