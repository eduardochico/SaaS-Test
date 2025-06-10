import React from 'react';
import { NavLink } from 'react-router-dom';
import './LateralMenu.css';

const LateralMenu = () => {
  return (
    <aside className="lateral-menu"> {/* Changed nav to aside for semantic appropriateness */}
      <nav>
        <ul>
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/brands" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Brands
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Categories
            </NavLink>
          </li>
          {/* Add other links here as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default LateralMenu;
