import React, { useState, useEffect } from 'react';
import {
  TextField, Button, DialogTitle, DialogActions, DialogContent, Box, Grid, Avatar, Typography,
  MenuItem, FormControl, InputLabel, Select, OutlinedInput, Chip, FormHelperText
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material'; // For image upload button icon

const ProductForm = ({ product, onSave, onCancel, brands = [], categories = [] }) => {
  const [formData, setFormData] = useState({
    productImageFile: null, // Store the File object
    productImagePreview: product?.productImage || '', // URL for existing or new preview
    sku: '',
    productName: '',
    brand_id: '', // Store ID
    category_ids: [], // Store array of IDs
    price: '',
    discount: 0,
    description: '', // Added description field
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        productImageFile: null,
        productImagePreview: product.productImage || '',
        sku: product.sku || '',
        productName: product.productName || '',
        brand_id: product.brand_id || '',
        category_ids: product.category_ids || [],
        price: product.price || '',
        discount: product.discount || 0,
        description: product.description || '',
      });
    } else {
      setFormData({
        productImageFile: null, productImagePreview: '', sku: '', productName: '',
        brand_id: '', category_ids: [], price: '', discount: 0, description: '',
      });
    }
    setErrors({});
  }, [product]);

  const validateField = (name, value) => {
    let errorMsg = null;
    switch (name) {
      case 'sku':
        if (!value.trim()) errorMsg = 'SKU is required.';
        else if (!/^[A-Z0-9]+$/.test(value)) errorMsg = 'SKU must be uppercase alphanumeric, no spaces.';
        break;
      case 'productName':
        if (!value.trim()) errorMsg = 'Product name is required.';
        else if (value.length > 70) errorMsg = 'Product name must be 70 characters or less.';
        break;
      case 'brand_id':
        if (!value) errorMsg = 'Brand is required.';
        break;
      case 'category_ids':
        if (!value.length) errorMsg = 'At least one category is required.';
        break;
      case 'price':
        if (value === '' || isNaN(Number(value))) errorMsg = 'Price must be a number.';
        else if (Number(value) < 0) errorMsg = 'Price cannot be negative.';
        break;
      case 'discount':
        if (value !== '' && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) {
          errorMsg = 'Discount must be a number between 0 and 100.';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        const file = files[0];
        setFormData(prev => ({
          ...prev,
          productImageFile: file,
          productImagePreview: URL.createObjectURL(file),
        }));
        setErrors(prev => ({ ...prev, productImage: null})); // Clear any previous image error
      }
    } else {
      let processedValue = value;
      if (name === 'sku') processedValue = value.toUpperCase();

      setFormData(prev => ({ ...prev, [name]: processedValue }));
      validateField(name, processedValue);
    }
  };

  const handleMultiSelectChange = (event) => {
    const { target: { value } } = event;
    const newCategoryIds = typeof value === 'string' ? value.split(',') : value;
    setFormData(prev => ({
        ...prev,
        category_ids: newCategoryIds,
    }));
    validateField('category_ids', newCategoryIds);
  };


  const validateForm = () => {
    let isValid = true;
    isValid = validateField('sku', formData.sku) && isValid;
    isValid = validateField('productName', formData.productName) && isValid;
    isValid = validateField('brand_id', formData.brand_id) && isValid;
    isValid = validateField('category_ids', formData.category_ids) && isValid;
    isValid = validateField('price', formData.price) && isValid;
    isValid = validateField('discount', formData.discount) && isValid;
    // productImage is optional for existing products, could add validation if required for new
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // alert('Please correct the form errors before submitting.');
      return;
    }

    const productDataToSave = {
      sku: formData.sku,
      productName: formData.productName,
      brand_id: formData.brand_id,
      category_ids: formData.category_ids,
      price: parseFloat(formData.price) || 0,
      discount: parseFloat(formData.discount) || 0,
      description: formData.description,
      productImage: formData.productImagePreview, // Use preview URL (real app: upload then use returned URL)
    };

    // In a real app, if productImageFile exists, you would upload it here
    // and then set productDataToSave.productImage to the returned URL.
    // For now, we're just using the preview URL.
    // If editing and no new image is selected, productImagePreview already holds the existing URL.

    onSave(productDataToSave);
  };


  return (
    <>
      <DialogTitle>{product ? 'Edit Product' : 'Create New Product'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
              <Avatar
                src={formData.productImagePreview || undefined}
                alt="Product Preview"
                variant="rounded"
                sx={{ width: 120, height: 120, mb: 1, bgcolor: 'grey.200' }}
              >
                {!formData.productImagePreview && <PhotoCamera sx={{ fontSize: 40, color: 'grey.400' }} />}
              </Avatar>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                size="small"
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleChange}
                  name="productImageFile" // Ensure name matches state if needed, though direct file handling is used
                />
              </Button>
              {errors.productImage && <FormHelperText error sx={{textAlign: 'center'}}>{errors.productImage}</FormHelperText>}
            </Grid>

            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="productName"
                    label="Product Name"
                    name="productName"
                    autoFocus={!product}
                    value={formData.productName}
                    onChange={handleChange}
                    error={!!errors.productName}
                    helperText={errors.productName || "Max 70 characters"}
                    inputProps={{ maxLength: 70 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="sku"
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    error={!!errors.sku}
                    helperText={errors.sku || "Uppercase alphanumeric, no spaces"}
                  />
                </Grid>
              </Grid>
              <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  rows={2} // Adjust as needed
                  value={formData.description}
                  onChange={handleChange}
                  // No specific validation for description in this example
                />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.brand_id}>
                <InputLabel id="brand-select-label">Brand</InputLabel>
                <Select
                  labelId="brand-select-label"
                  id="brand_id"
                  name="brand_id"
                  value={formData.brand_id}
                  label="Brand"
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>Select Brand</em></MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                  ))}
                </Select>
                {errors.brand_id && <FormHelperText>{errors.brand_id}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.category_ids}>
                <InputLabel id="category-multiselect-label">Categories</InputLabel>
                <Select
                  labelId="category-multiselect-label"
                  id="category_ids"
                  multiple
                  name="category_ids"
                  value={formData.category_ids}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const category = categories.find(c => c.id === id);
                        return <Chip key={id} label={category ? category.name : id} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category_ids && <FormHelperText>{errors.category_ids}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="price"
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography> }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="discount"
                label="Discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                error={!!errors.discount}
                helperText={errors.discount || "0-100%"}
                InputProps={{ endAdornment: <Typography sx={{ ml: 0.5 }}>%</Typography> }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? 'Save Changes' : 'Create Product'}
        </Button>
      </DialogActions>
    </>
  );
};

export default ProductForm;
