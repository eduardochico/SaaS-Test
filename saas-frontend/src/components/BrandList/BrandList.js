import React, { useState, useEffect } from 'react';
import mockBrandsData from '../../data/mockBrands.js';
import BrandForm from '../BrandForm/BrandForm.js';
import './BrandList.css'; // Assuming you'll create this

const BrandList = () => {
  const [allBrands, setAllBrands] = useState(mockBrandsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Or adjust as needed
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  // Reset pagination if items change
  useEffect(() => {
    setCurrentPage(1);
  }, [allBrands.length, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBrands = allBrands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDelete = (brandId) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      setAllBrands(prev => prev.filter(b => b.id !== brandId));
    }
  };

  const handleSave = (brandData) => {
    if (editingBrand) {
      setAllBrands(prev => prev.map(b => b.id === editingBrand.id ? { ...editingBrand, ...brandData } : b));
    } else {
      const newId = allBrands.length > 0 ? Math.max(...allBrands.map(b => b.id)) + 1 : 1;
      setAllBrands(prev => [{ ...brandData, id: newId }, ...prev]);
    }
    setShowForm(false);
    setEditingBrand(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  return (
    <div className="brand-list-container">
      <h2>Manage Brands</h2>
      <button onClick={handleCreate} className="btn-create-brand">Create New Brand</button>

      {showForm && (
        <BrandForm
          brand={editingBrand}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Brands..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {currentItems.length > 0 ? (
        <>
          <table className="brands-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Website</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((brand) => (
                <tr key={brand.id}>
                  <td>
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={`${brand.name} Logo`} className="brand-logo-preview" />
                    ) : (
                      'No Logo'
                    )}
                  </td>
                  <td>{brand.name}</td>
                  <td>
                    {brand.website_url ? (
                      <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                        {brand.website_url}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{brand.description || 'N/A'}</td>
                  <td>
                    <button onClick={() => handleEdit(brand)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(brand.id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
          )}
        </>
      ) : (
        <p>No brands found{searchTerm && ' matching your search criteria'}.</p>
      )}
    </div>
  );
};

export default BrandList;
