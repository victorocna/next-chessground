import NextChessground from '../dynamic/NextChessground';
import Layout from '../components/Layout';

const Page = () => {
  return (
    <Layout title="Play computer">
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
