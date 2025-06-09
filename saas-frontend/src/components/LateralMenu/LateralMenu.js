import React from 'react';
import { Link } from 'react-router-dom';
import './LateralMenu.css';

const LateralMenu = () => {
  return (
    <nav className="lateral-menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/vendors">Vendors</Link></li>
        <li><Link to="/customers">Customers</Link></li>
      </ul>
    </nav>
  );
};

export default LateralMenu;
