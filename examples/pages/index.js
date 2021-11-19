import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

const NextChessground = dynamic(() => import('next-chessground'), {
  ssr: false,
});

const Page = () => (
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

export default Page;
