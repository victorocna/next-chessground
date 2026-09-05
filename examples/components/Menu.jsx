import pkg from 'next-chessground/package.json';
import { MenuItem } from '.';
import * as config from '../site.config';

const Menu = () => {
  return (
    <>
      <input
        aria-label="Menu open/close"
        className="site-menu-checkbox"
        id="menu"
        type="checkbox"
      />
      <label aria-label="Close menu" className="site-backdrop" htmlFor="menu" />
      <nav className="site-nav">
        <div className="site-brand">
          <span className="site-wordmark">next-chessground</span>
          <span className="site-version">v{pkg.version}</span>
        </div>
        <div className="site-links">
          <MenuItem href="/">Basic example</MenuItem>
          <MenuItem href="/rook">With rook</MenuItem>
          <MenuItem href="/queen">With queen</MenuItem>
          <MenuItem href="/pawn">Pawn promotion</MenuItem>
          <MenuItem href="/shapes">Shapes</MenuItem>
          <MenuItem href="/play">Play computer</MenuItem>
          <MenuItem href="/watch">Watch computers play</MenuItem>
          <MenuItem href="/undo">Undo last move</MenuItem>
        </div>
        <div className="site-nav-footer">
          <a className="site-external" href={config.repo} rel="noreferrer" target="_blank">
            GitHub
          </a>
          <a className="site-external" href={config.npm} rel="noreferrer" target="_blank">
            npm
          </a>
        </div>
      </nav>
    </>
  );
};

export default Menu;
