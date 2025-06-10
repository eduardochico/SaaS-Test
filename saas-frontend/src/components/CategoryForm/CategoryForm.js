import React, { useState, useEffect } from 'react';
import './CategoryForm.css';

const CategoryForm = ({ category, onSave, onCancel, categories }) => { // Added categories for parent selector
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_category_id: '', // Store as string, can be empty
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        parent_category_id: category.parent_category_id ? String(category.parent_category_id) : '',
      });
    } else {
      setFormData({ name: '', description: '', parent_category_id: '' });
    }
    setErrors({});
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name' && !value.trim()) {
      setErrors(prev => ({ ...prev, name: 'Category name is required.' }));
    } else if (name === 'name') {
      setErrors(prev => ({ ...prev, name: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required.';
    }
    if (formData.parent_category_id && isNaN(Number(formData.parent_category_id))) {
        newErrors.parent_category_id = 'Parent Category ID must be a number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert parent_category_id to number or null
      const dataToSave = {
        ...formData,
        parent_category_id: formData.parent_category_id ? Number(formData.parent_category_id) : null,
      };
      onSave(dataToSave);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <h3>{category ? 'Edit Category' : 'Create Category'}</h3>

      <div className="form-group">
        <label htmlFor="name">Category Name*</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'invalid' : ''}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="parent_category_id">Parent Category ID (Optional)</label>
        <input
          type="text" // Changed to text to allow empty or number
          id="parent_category_id"
          name="parent_category_id"
          value={formData.parent_category_id}
          onChange={handleChange}
          placeholder="Enter ID or leave blank for top-level"
          className={errors.parent_category_id ? 'invalid' : ''}
        />
        {/*
          // Simple select for parent category - more advanced would be a searchable dropdown
          <select
            name="parent_category_id"
            value={formData.parent_category_id}
            onChange={handleChange}
            className={errors.parent_category_id ? 'invalid' : ''}
          >
            <option value="">None (Top Level)</option>
            {categories && categories.filter(cat => !category || cat.id !== category.id).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        */}
        {errors.parent_category_id && <p className="error-message">{errors.parent_category_id}</p>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save-category">Save Category</button>
        <button type="button" onClick={onCancel} className="btn-cancel-category">Cancel</button>
      </div>
    </form>
  );
};

export default CategoryForm;
