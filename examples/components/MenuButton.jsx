import React from 'react';

const MenuButton = () => {
  return (
    <label aria-label="Open menu" className="site-menu-button" htmlFor="menu">
      <i aria-hidden="true" className="fas fa-bars" />
      <span>Menu</span>
    </label>
  );
};

export default MenuButton;
