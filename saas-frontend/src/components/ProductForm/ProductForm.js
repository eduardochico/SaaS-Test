import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    productImage: null, // Will be File object or null
    productImagePreview: product?.productImage || '', // URL for existing image
    sku: '',
    productName: '',
    brand: '',
    categories: '', // Comma-separated string
    price: '',
    discount: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productImage: null,
        productImagePreview: product.productImage || '',
        sku: product.sku || '',
        productName: product.productName || '',
        brand: product.brand || '',
        categories: Array.isArray(product.categories) ? product.categories.join(', ') : '',
        price: product.price || '',
        discount: product.discount || 0,
      });
      setErrors({}); // Clear errors when loading a product
    } else {
      // Reset for new product
      setFormData({
        productImage: null,
        productImagePreview: '',
        sku: '',
        productName: '',
        brand: '',
        categories: '',
        price: '',
        discount: 0,
      });
      setErrors({}); // Clear errors for new form
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let currentErrors = { ...errors };

    if (type === 'file') {
      setFormData({
        ...formData,
        productImage: files[0],
        productImagePreview: URL.createObjectURL(files[0]),
      });
    } else {
      let processedValue = value;
      if (name === 'sku') {
        processedValue = value.toUpperCase();
        const skuRegex = /^[A-Z0-9]+$/;
        if (!skuRegex.test(processedValue) && processedValue !== '') { // Allow empty to clear, then validate on submit
          currentErrors.sku = 'SKU must be alphanumeric, no spaces or special characters.';
        } else {
          currentErrors.sku = null;
        }
      } else if (name === 'productName') {
        if (value.length > 50) {
          currentErrors.productName = 'Product Name must be 50 characters or less.';
        } else {
          currentErrors.productName = null;
        }
      }
      setFormData({ ...formData, [name]: processedValue });
      setErrors(currentErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple check for active errors
    if (Object.values(errors).some(error => error !== null)) {
      alert('Please correct the form errors before submitting.');
      return;
    }
    // Re-validate critical fields like SKU on submit, in case they were empty and not caught by handleChange
    if (formData.sku === '' || (errors.sku && errors.sku !== null) ) { // Check if SKU is empty or still has an error
        setErrors(prev => ({ ...prev, sku: 'SKU is required and must be alphanumeric.' }));
        alert('Please correct the form errors before submitting.');
        return;
    }


    const productDataToSave = {
      ...formData,
      // Convert categories from string to array
      categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
      price: parseFloat(formData.price) || 0,
      discount: parseFloat(formData.discount) || 0,
    };
    // If editing and no new image is selected, retain the original image URL
    if (product && !formData.productImage) {
        productDataToSave.productImage = product.productImage;
    } else if (formData.productImage) {
        // For new images, we'd typically upload and get a URL.
        // For now, we'll use the preview URL, but this needs proper handling.
        productDataToSave.productImage = formData.productImagePreview;
    }
    onSave(productDataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h3>{product ? 'Edit Product' : 'Create Product'}</h3>

      <div className="form-group">
        <label htmlFor="productImage">Product Image</label>
        <input type="file" id="productImage" name="productImage" onChange={handleChange} />
        {formData.productImagePreview && (
          <img src={formData.productImagePreview} alt="Preview" className="image-preview" />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU</label>
        <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="Alphanumeric, no spaces, uppercase" className={errors.sku ? 'invalid' : ''} />
        {errors.sku && <p className="error-message">{errors.sku}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="productName">Product Name (max 50 chars)</label>
        <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} maxLength="50" className={errors.productName ? 'invalid' : ''} />
        {errors.productName && <p className="error-message">{errors.productName}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="brand">Brand</label>
        <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="categories">Categories (comma-separated)</label>
        <input type="text" id="categories" name="categories" value={formData.categories} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" />
      </div>

      <div className="form-group">
        <label htmlFor="discount">Discount (%)</label>
        <input type="number" id="discount" name="discount" value={formData.discount} onChange={handleChange} step="0.01" min="0" max="100" />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save">Save</button>
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
      </div>
    </form>
  );
};

export default ProductForm;
