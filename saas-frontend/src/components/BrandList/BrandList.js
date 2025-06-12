import React, { useState, useEffect } from 'react';
import mockBrandsData from '../../data/mockBrands.js';
import BrandForm from '../BrandForm/BrandForm.js';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField,
  Dialog, DialogContent, Pagination, Box, Typography, Paper, Avatar
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const BrandList = () => {
  const [allBrands, setAllBrands] = useState(mockBrandsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null); // For confirmation dialog

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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDeleteInitiate = (brandId) => {
    setBrandToDelete(brandId);
  };

  const handleDeleteConfirm = () => {
    if (brandToDelete) {
      setAllBrands(prev => prev.filter(b => b.id !== brandToDelete));
    }
    setBrandToDelete(null); // Close confirmation dialog
  };

  const handleDeleteCancel = () => {
    setBrandToDelete(null); // Close confirmation dialog
  };


  const handleSave = (brandData) => {
    if (editingBrand) {
      setAllBrands(prev => prev.map(b => b.id === editingBrand.id ? { ...editingBrand, ...brandData } : b));
    } else {
      const newId = allBrands.length > 0 ? Math.max(...allBrands.map(b => b.id)) + 1 : 1;
      setAllBrands(prev => [{ ...brandData, id: newId }, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
    }
    setShowForm(false);
    setEditingBrand(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ mb: 2 }}>
        Manage Brands
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Brands"
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
          Create New Brand
        </Button>
      </Box>

      <Dialog open={showForm} onClose={handleCancel} maxWidth="sm" fullWidth>
        <BrandForm
          brand={editingBrand}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Dialog>

      {currentItems.length > 0 ? (
        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="brands table">
              <TableHead>
                <TableRow>
                  <TableCell>Logo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((brand) => (
                  <TableRow
                    key={brand.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Avatar src={brand.logo_url} alt={`${brand.name} Logo`}>
                        {!brand.logo_url && brand.name ? brand.name.charAt(0) : ''}
                      </Avatar>
                    </TableCell>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>
                      {brand.website_url ? (
                        <a href={brand.website_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          {brand.website_url}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{brand.description || 'N/A'}</TableCell>
                    <TableCell align="right">
                      <Button startIcon={<Edit />} onClick={() => handleEdit(brand)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button startIcon={<Delete />} color="error" onClick={() => handleDeleteInitiate(brand.id)}>
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
          No brands found{searchTerm && ' matching your search criteria'}.
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!brandToDelete} onClose={handleDeleteCancel}>
        <DialogContent>
          <Typography>Are you sure you want to delete this brand?</Typography>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:2 }}>
            <Button onClick={handleDeleteCancel} color="primary">
            Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
            </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BrandList;
