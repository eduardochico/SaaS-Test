import React, { useState, useEffect } from 'react';
import './BrandForm.css';

const BrandForm = ({ brand, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        logo_url: brand.logo_url || '',
        website_url: brand.website_url || '',
        description: brand.description || '',
      });
    } else {
      setFormData({ name: '', logo_url: '', website_url: '', description: '' });
    }
    setErrors({}); // Clear errors when form loads or brand changes
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Basic validation example: Name is required
    if (name === 'name' && !value.trim()) {
      setErrors(prev => ({ ...prev, name: 'Brand name is required.' }));
    } else if (name === 'name') {
      setErrors(prev => ({ ...prev, name: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required.';
    }
    // Add other validations if needed, e.g., URL format
    if (formData.website_url && !formData.website_url.startsWith('http')) {
        newErrors.website_url = 'Please enter a valid URL (e.g., http://example.com).';
    }
    if (formData.logo_url && !formData.logo_url.startsWith('http')) {
        // For simplicity, assuming logo_url is also a direct URL.
        // In a real app, this might be a file upload.
        newErrors.logo_url = 'Please enter a valid image URL.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="brand-form">
      <h3>{brand ? 'Edit Brand' : 'Create Brand'}</h3>

      <div className="form-group">
        <label htmlFor="name">Brand Name*</label>
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
        <label htmlFor="logo_url">Logo URL</label>
        <input
          type="url" // Use type="url" for better semantics
          id="logo_url"
          name="logo_url"
          value={formData.logo_url}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
          className={errors.logo_url ? 'invalid' : ''}
        />
        {formData.logo_url && !errors.logo_url && <img src={formData.logo_url} alt="Logo Preview" className="image-preview" />}
        {errors.logo_url && <p className="error-message">{errors.logo_url}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="website_url">Website URL</label>
        <input
          type="url" // Use type="url"
          id="website_url"
          name="website_url"
          value={formData.website_url}
          onChange={handleChange}
          placeholder="https://example.com"
          className={errors.website_url ? 'invalid' : ''}
        />
        {errors.website_url && <p className="error-message">{errors.website_url}</p>}
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

      <div className="form-actions">
        <button type="submit" className="btn-save">Save Brand</button>
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
      </div>
    </form>
  );
};

export default BrandForm;
