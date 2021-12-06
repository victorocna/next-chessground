import NextChessground from '../dynamic/NextChessground';
import Layout from '../components/Layout';
import { Highlight } from '../components';
import { basic } from '../utils/code-samples';

const Page = () => (
  <Layout title="Basic example">
    <div className="grid md:grid-cols-2 gap-12">
      <NextChessground />
      <div>
        <h2 className="text-xl mb-2">Code sample</h2>
        <Highlight>{basic}</Highlight>
      </div>
    </div>
  </Layout>
);

export default Page;
