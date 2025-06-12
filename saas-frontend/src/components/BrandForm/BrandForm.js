import React, { useState, useEffect } from 'react';
import { TextField, Button, DialogTitle, DialogActions, DialogContent, Box, Grid, Avatar, Typography } from '@mui/material';

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
    setErrors({});
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name' && !value.trim()) {
      setErrors(prev => ({ ...prev, name: 'Brand name is required.' }));
    } else if (name === 'name') {
      setErrors(prev => ({ ...prev, name: null }));
    }
  };

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required.';
    }
    if (formData.website_url && !validateURL(formData.website_url)) {
      newErrors.website_url = 'Please enter a valid URL (e.g., http://example.com).';
    }
    if (formData.logo_url && !validateURL(formData.logo_url)) {
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
    <>
      <DialogTitle>{brand ? 'Edit Brand' : 'Create New Brand'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Avatar
                src={formData.logo_url}
                alt={formData.name ? `${formData.name} Logo` : 'Brand Logo Preview'}
                sx={{ width: 80, height: 80, mr: 2, bgcolor: 'grey.300' }}
              >
                {!formData.logo_url && formData.name ? formData.name.charAt(0) : null}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Brand Name"
                name="name"
                autoComplete="organization"
                autoFocus={!brand} // Autofocus on create
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
                id="logo_url"
                label="Logo URL"
                name="logo_url"
                autoComplete="url"
                value={formData.logo_url}
                onChange={handleChange}
                error={!!errors.logo_url}
                helperText={errors.logo_url || "e.g., https://example.com/logo.png"}
                placeholder="https://example.com/logo.png"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                id="website_url"
                label="Website URL"
                name="website_url"
                autoComplete="url"
                value={formData.website_url}
                onChange={handleChange}
                error={!!errors.website_url}
                helperText={errors.website_url || "e.g., https://example.com"}
                placeholder="https://example.com"
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
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {brand ? 'Save Changes' : 'Create Brand'}
        </Button>
      </DialogActions>
    </>
  );
};

export default BrandForm;
