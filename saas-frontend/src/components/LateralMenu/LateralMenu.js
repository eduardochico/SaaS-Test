import React from 'react';
import './LateralMenu.css';

const LateralMenu = () => {
  return (
    <nav className="lateral-menu">
      <ul>
        <li><a href="#/home">Home</a></li>
        <li><a href="#/products">Products</a></li>
        <li><a href="#/vendors">Vendors</a></li>
        <li><a href="#/customers">Customers</a></li>
      </ul>
    </nav>
  );
};

export default LateralMenu;
