import { Menu, MenuButton } from '.';

const Layout = ({ title, children }) => {
  return (
    <div className="site-shell">
      <Menu />
      <main className="site-main">
        <div className="site-header">
          <h1 className="site-title">{title}</h1>
          <MenuButton />
        </div>
        <section className="site-card">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
