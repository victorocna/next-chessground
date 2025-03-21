import { MenuItem } from '.';

const Menu = () => {
  return (
    <>
      <input
        type="checkbox"
        id="menu"
        className="hidden"
        aria-label="Menu open/close"
      />
      <label
        htmlFor="menu"
        aria-label="Menu open/close"
        className="backdrop bg-gray-300 fixed lg:hidden h-screen w-screen inset-0"
      />
      <nav className="nav-menu overflow-y-auto bg-white border-r border-gray-200">
        <div className="flex flex-col py-8 lg:sticky lg:top-0">
          <MenuItem href="/">Basic example</MenuItem>
          <MenuItem href="/rook">With rook</MenuItem>
          <MenuItem href="/queen">With queen</MenuItem>
          <MenuItem href="/pawn">Pawn promotion</MenuItem>
          <MenuItem href="/shapes">Shapes</MenuItem>
          <MenuItem href="/play">Play computer</MenuItem>
          <MenuItem href="/watch">Watch computers play</MenuItem>
          <MenuItem href="/editor">Chess editor</MenuItem>
        </div>
      </nav>
    </>
  );
};

export default Menu;
