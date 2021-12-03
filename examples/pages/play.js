import NextChessground from '../dynamic/NextChessground';
import Layout from '../components/Layout';
import { Highlight } from '../components';
import { play } from '../utils/code-samples';

const Page = () => {
  return (
    <Layout title="Play computer">
      <div className="grid md:grid-cols-2 gap-12">
        <NextChessground />
        <div>
          <h2 className="text-xl mb-2">Code sample</h2>
          <Highlight>{play}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
