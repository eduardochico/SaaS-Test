import React, { useState, useEffect } from 'react';
import mockCategoriesData from '../../data/mockCategories.js';
import CategoryForm from '../CategoryForm/CategoryForm.js';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField,
  Dialog, DialogActions, DialogContent, Pagination, Box, Typography, Paper
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const CategoryList = () => {
  const [allCategories, setAllCategories] = useState(mockCategoriesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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
  ).sort((a, b) => a.name.localeCompare(b.name));


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteInitiate = (categoryId) => {
    setCategoryToDelete(categoryId);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      // Consider implications: what happens to sub-categories or products?
      // For now, just filter out. A real app might need more complex logic.
      setAllCategories(prev => prev.filter(c => c.id !== categoryToDelete));
    }
    setCategoryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setCategoryToDelete(null);
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ mb: 2 }}>
        Manage Categories
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Categories"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '40%' }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ height: 'fit-content' }}
        >
          Create New Category
        </Button>
      </Box>

      <Dialog open={showForm} onClose={handleCancel} maxWidth="sm" fullWidth>
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={handleCancel}
          categories={allCategories}
        />
      </Dialog>

      {currentItems.length > 0 ? (
        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="categories table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Parent Category</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((category) => (
                  <TableRow
                    key={category.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description || 'N/A'}</TableCell>
                    <TableCell>{getCategoryNameById(category.parent_category_id)}</TableCell>
                    <TableCell align="right">
                      <Button startIcon={<Edit />} onClick={() => handleEdit(category)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button startIcon={<Delete />} color="error" onClick={() => handleDeleteInitiate(category.id)}>
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
          No categories found{searchTerm && ' matching your search criteria'}.
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!categoryToDelete} onClose={handleDeleteCancel}>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
          <Typography variant="body2" color="text.secondary">
            This might affect subcategories or product associations in a real application.
          </Typography>
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

export default CategoryList;
