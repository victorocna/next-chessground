import { Highlight, Layout } from '.';

/**
 * The page template: a title and one row holding the board (with its optional
 * controls underneath) and the code sample.
 */
const Demo = ({ children, code, controls, title }) => {
  return (
    <Layout title={title}>
      <div className="demo">
        <div className="demo-board">
          {children}
          {controls && <div className="demo-controls">{controls}</div>}
        </div>
        <div className="demo-code">
          <h2 className="demo-code-title">Code</h2>
          <Highlight>{code}</Highlight>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;
