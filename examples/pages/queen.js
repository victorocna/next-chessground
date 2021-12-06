import NextChessground from '../dynamic/NextChessground';
import Layout from '../components/Layout';
import { Highlight } from '../components';
import { queen } from '../utils/code-samples';

const Page = () => (
  <Layout title="With queen">
    <div className="grid md:grid-cols-2 gap-12">
      <NextChessground fen="8/8/8/8/6q1/5k2/8/7K b - - 0 1" />
      <div>
        <h2 className="text-xl mb-2">Code sample</h2>
        <Highlight>{queen}</Highlight>
      </div>
    </div>
  </Layout>
);

export default Page;
