import React, { useState, useEffect } from 'react';
import mockProducts from '../../data/products.js';
import ProductForm from '../ProductForm/ProductForm';
import mockCategoriesData from '../../data/mockCategories.js'; // For ProductForm
import mockBrandsData from '../../data/mockBrands.js'; // For ProductForm
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField,
  Dialog, DialogActions, DialogContent, Pagination, Box, Typography, Paper, Avatar
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = allProducts.filter(product => {
    const term = searchTerm.toLowerCase();
    return (product.productName?.toLowerCase() || '').includes(term) ||
           (product.sku?.toLowerCase() || '').includes(term) ||
           (product.brandName?.toLowerCase() || '').includes(term) || // Assuming brand is an object with name
           (Array.isArray(product.categoryNames) ? product.categoryNames.join(', ').toLowerCase() : '').includes(term); // Assuming categories are objects with names
  }).sort((a,b) => a.productName.localeCompare(b.productName));


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteInitiate = (productId) => {
    setProductToDelete(productId);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setAllProducts(prevProducts =>
        prevProducts.filter(p => p.id !== productToDelete)
      );
    }
    setProductToDelete(null);
  };

  const handleDeleteCancel = () => {
    setProductToDelete(null);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setAllProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === editingProduct.id ? { ...editingProduct, ...productData } : p
        )
      );
    } else {
      const newProductId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
      // Ensure brandName and categoryNames are populated from IDs if necessary
      const brand = mockBrandsData.find(b => b.id === productData.brand_id);
      const categories = mockCategoriesData.filter(c => productData.category_ids?.includes(c.id));

      const newProduct = {
        ...productData,
        id: newProductId,
        brandName: brand ? brand.name : 'Unknown Brand',
        categoryNames: categories.map(c => c.name),
        // Ensure price and discount are numbers
        price: parseFloat(productData.price) || 0,
        discount: parseFloat(productData.discount) || 0,
      };
      setAllProducts(prevProducts => [newProduct, ...prevProducts]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ mb: 2 }}>
        Manage Products
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Products (Name, SKU, Brand, Category)"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '50%' }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ height: 'fit-content' }}
        >
          Create New Product
        </Button>
      </Box>

      <Dialog open={showForm} onClose={handleCancelForm} maxWidth="md" fullWidth>
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
          // Pass brands and categories for the form's Select components
          brands={mockBrandsData}
          categories={mockCategoriesData}
        />
      </Dialog>

      {currentItems.length > 0 ? (
        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{width: '5%'}}>Image</TableCell>
                  <TableCell sx={{width: '10%'}}>SKU</TableCell>
                  <TableCell sx={{width: '25%'}}>Product Name</TableCell>
                  <TableCell sx={{width: '15%'}}>Brand</TableCell>
                  <TableCell sx={{width: '20%'}}>Categories</TableCell>
                  <TableCell sx={{width: '10%'}} align="right">Price</TableCell>
                  <TableCell sx={{width: '5%'}} align="right">Disc.</TableCell>
                  <TableCell sx={{width: '10%'}} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Avatar
                        src={product.productImage || 'https://via.placeholder.com/50'}
                        alt={product.productName}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell component="th" scope="row">
                      {product.productName}
                    </TableCell>
                    <TableCell>{product.brandName || product.brand_id}</TableCell> {/* Display brand name */}
                    <TableCell>{Array.isArray(product.categoryNames) ? product.categoryNames.join(', ') : ''}</TableCell> {/* Display category names */}
                    <TableCell align="right">${(product.price || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{(product.discount || 0)}%</TableCell>
                    <TableCell align="center">
                      <Button startIcon={<Edit />} size="small" onClick={() => handleEdit(product)} sx={{ mr: 0.5 }}>
                        Edit
                      </Button>
                      <Button startIcon={<Delete />} size="small" color="error" onClick={() => handleDeleteInitiate(product.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Paper>
      ) : (
        <Typography variant="subtitle1" sx={{ mt: 2, textAlign: 'center' }}>
          No products found{searchTerm && ' matching your search criteria'}.
        </Typography>
      )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!productToDelete} onClose={handleDeleteCancel}>
            <DialogContent>
                <Typography>Are you sure you want to delete this product?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteCancel}>Cancel</Button>
                <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default ProductList;
