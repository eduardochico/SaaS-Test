import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LateralMenu from './components/LateralMenu/LateralMenu';
import ProductList from './components/ProductList/ProductList'; // Import ProductList

// Placeholder for Home component
const Home = () => (
  <header className="App-header">
    {/* <img src={logo} className="App-logo" alt="logo" /> You might want to remove or replace the logo */}
    <h1>Welcome to the Dashboard!</h1>
    <p>Select an option from the menu to get started.</p>
  </header>
);

// Placeholder for Vendors component
const Vendors = () => <div style={{padding: "20px"}}><h1>Vendors Page</h1><p>This is a placeholder for Vendors content.</p></div>;

// Placeholder for Customers component
const Customers = () => <div style={{padding: "20px"}}><h1>Customers Page</h1><p>This is a placeholder for Customers content.</p></div>;


function App() {
  return (
    <Router>
      <div className="App">
        <LateralMenu />
        <main className="main-content"> {/* Changed div to main for semantics */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/customers"霎element={<Customers />} />
            {/* Default route for App-header content if needed, or remove App-header */}
            {/* <Route path="/learn-react" element={
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Edit <code>src/App.js</code> and save to reload.</p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                  Learn React
                </a>
              </header>
            } /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
