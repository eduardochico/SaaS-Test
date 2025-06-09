import React, { useState } from 'react';
import mockProducts from '../../data/products.js';
import './ProductList.css';

const ProductList = () => {
  const [allProducts] = useState(mockProducts); // Source of truth, no longer set directly
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter products based on search term
  const filteredProducts = allProducts.filter(product => {
    const term = searchTerm.toLowerCase();
    return product.productName.toLowerCase().includes(term) ||
           product.sku.toLowerCase().includes(term);
  });

  // Pagination logic using filteredProducts
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const nextPage = () => {
    // Ensure nextPage doesn't go beyond available filtered items
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!allProducts || allProducts.length === 0) {
    return <div className="product-list-container"><p>No products initially available.</p></div>;
  }

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or SKU..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      {currentItems.length > 0 ? (
        <>
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Categories</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="product-image"
                    />
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.productName}</td>
                  <td>{product.categories.join(', ')}</td>
                  <td>${product.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && ( // Only show pagination if there's more than one page
            <div className="pagination-controls">
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={nextPage} disabled={currentPage === totalPages || indexOfLastItem >= filteredProducts.length}>
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No products match your search criteria.</p>
      )}
    </div>
  );
};

export default ProductList;
