import React, { useState, useEffect } from 'react';
import {
  TextField, Button, DialogTitle, DialogActions, DialogContent, Box, Grid,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';

const CategoryForm = ({ category, onSave, onCancel, categories }) => {
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
    // parent_category_id is now a select, so direct string->number validation might not be needed
    // unless you allow free-text entry somehow. Assuming it's always a valid ID from the list or empty.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        parent_category_id: formData.parent_category_id ? Number(formData.parent_category_id) : null,
      };
      onSave(dataToSave);
    }
  };

  // Filter out the current category from the list of potential parents to avoid self-referencing
  const availableParentCategories = categories.filter(cat => !category || cat.id !== category.id);

  return (
    <>
      <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Category Name"
                name="name"
                autoFocus={!category}
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={!!errors.parent_category_id}>
                <InputLabel id="parent-category-select-label">Parent Category (Optional)</InputLabel>
                <Select
                  labelId="parent-category-select-label"
                  id="parent_category_id"
                  name="parent_category_id"
                  value={formData.parent_category_id}
                  label="Parent Category (Optional)"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None (Top Level)</em>
                  </MenuItem>
                  {availableParentCategories.map((cat) => (
                    <MenuItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.parent_category_id && <FormHelperText>{errors.parent_category_id}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {category ? 'Save Changes' : 'Create Category'}
        </Button>
      </DialogActions>
    </>
  );
};

export default CategoryForm;
