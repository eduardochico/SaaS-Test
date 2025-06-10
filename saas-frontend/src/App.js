import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LateralMenu from './components/LateralMenu/LateralMenu';
import ProductList from './components/ProductList/ProductList';
import BrandList from './components/BrandList/BrandList';
import CategoryList from './components/CategoryList/CategoryList';

// Placeholder for other sections if needed - for now, focusing on Products, Brands, Categories
// const Vendors = () => <div style={{padding: "20px"}}><h1>Vendors Page</h1><p>This is a placeholder for Vendors content.</p></div>;
// const Customers = () => <div style={{padding: "20px"}}><h1>Customers Page</h1><p>This is a placeholder for Customers content.</p></div>;


function App() {
  return (
    <Router>
      <div className="App">
        <LateralMenu />
        <main className="main-content"> {/* Changed div to main for semantics */}
          <Routes>
            <Route path="/" element={<Navigate replace to="/products" />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/brands" element={<BrandList />} />
            <Route path="/categories" element={<CategoryList />} />
            {/* <Route path="/vendors" element={<Vendors />} /> */}
            {/* <Route path="/customers"霎element={<Customers />} /> */}

            {/* Optional: 404 or catch-all route */}
            <Route path="*" element={
              <div style={{padding: "20px"}}>
                <h2>404: Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
