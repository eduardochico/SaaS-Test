import React, { useState, useEffect } from 'react';
import mockCategoriesData from '../../data/mockCategories.js';
import CategoryForm from '../CategoryForm/CategoryForm.js';
import './CategoryList.css';

const CategoryList = () => {
  const [allCategories, setAllCategories] = useState(mockCategoriesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [allCategories.length, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getCategoryNameById = (id) => {
    if (!id) return 'N/A (Top Level)';
    const parent = allCategories.find(cat => cat.id === id);
    return parent ? parent.name : `Unknown ID: ${id}`;
  };

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect subcategories or product associations in a real application.')) {
      setAllCategories(prev => prev.filter(c => c.id !== categoryId));
    }
  };

  const handleSave = (categoryData) => {
    if (editingCategory) {
      setAllCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...editingCategory, ...categoryData } : c));
    } else {
      const newId = allCategories.length > 0 ? Math.max(...allCategories.map(c => c.id)) + 1 : 1;
      setAllCategories(prev => [{ ...categoryData, id: newId }, ...prev]);
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="category-list-container">
      <h2>Manage Categories</h2>
      <button onClick={handleCreate} className="btn-create-category">Create New Category</button>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={handleCancel}
          categories={allCategories} // Pass all categories for parent selection
        />
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Categories..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {currentItems.length > 0 ? (
        <>
          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Parent Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description || 'N/A'}</td>
                  <td>{getCategoryNameById(category.parent_category_id)}</td>
                  <td>
                    <button onClick={() => handleEdit(category)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(category.id)} className="btn-delete">Delete</button>
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
        <p>No categories found{searchTerm && ' matching your search criteria'}.</p>
      )}
    </div>
  );
};

export default CategoryList;
