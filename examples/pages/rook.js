import NextChessground from '../dynamic/NextChessground';
import Layout from '../components/Layout';

const Page = () => (
  <Layout title="With rook">
    <div className="grid md:grid-cols-2 gap-12">
      <NextChessground fen="5k2/8/5K2/8/3R4/8/8/8 w - - 0 1" />
      <div>
        <h2 className="text-xl">Code sample</h2>
        <p className="text-gray-700">Coming soon...</p>
      </div>
    </div>
  </Layout>
);

export default Page;
