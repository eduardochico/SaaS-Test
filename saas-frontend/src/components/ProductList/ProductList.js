import React, { useState, useEffect } from 'react';
import mockProducts from '../../data/products.js';
import './ProductList.css';
import ProductForm from '../ProductForm/ProductForm';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState(mockProducts); // Allow updates
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [itemsPerPage] = useState(5);

  // Effect to reset pagination when allProducts changes (e.g., after delete/add)
  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter products based on search term
  const filteredProducts = allProducts.filter(product => {
    const term = searchTerm.toLowerCase();
    return (product.productName?.toLowerCase() || '').includes(term) ||
           (product.sku?.toLowerCase() || '').includes(term) ||
           (product.brand?.toLowerCase() || '').includes(term) ||
           (Array.isArray(product.categories) ? product.categories.join(', ').toLowerCase() : '').includes(term);
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

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setAllProducts(prevProducts =>
        prevProducts.filter(p => p.id !== productId)
      );
    }
  };

  const handleSaveProduct = (productData) => {
    console.log("Save product:", productData);
    if (editingProduct) {
      // Edit existing product
      setAllProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === editingProduct.id ? { ...editingProduct, ...productData } : p
        )
      );
    } else {
      // Create new product
      const newProductId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
      const newProduct = { ...productData, id: newProductId };
      setAllProducts(prevProducts => [newProduct, ...prevProducts]); // Add to the beginning of the list
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (!allProducts) { // Removed length check to allow showing create button for empty list
    return <div className="product-list-container"><p>Loading products...</p></div>;
  }

  return (
    <div className="product-list-container">
      <h2>Product List</h2>

      <button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="btn-create">Create Product</button>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      )}

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
                <th>Brand</th>
                <th>Categories</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.productImage || 'https://via.placeholder.com/50'} // Fallback image
                      alt={product.productName}
                      className="product-image"
                    />
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.productName}</td>
                  <td>{product.brand}</td>
                  <td>{Array.isArray(product.categories) ? product.categories.join(', ') : ''}</td>
                  <td>${(product.price || 0).toFixed(2)}</td>
                  <td>{(product.discount || 0)}%</td>
                  <td>
                    <button onClick={() => handleEdit(product)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="btn-delete">Delete</button>
                  </td>
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
        <p>No products match your search criteria or no products available.</p>
      )}
    </div>
  );
};

export default ProductList;
