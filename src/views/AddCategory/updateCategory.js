import React from 'react';
import { Dialog, DialogTitle, DialogContent,Typography, DialogActions, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateCategory } from 'apis/api.js';

const UpdateCategory = ({ open, handleClose, category, onUpdateCategory }) => {
  const formik = useFormik({
    initialValues: {
      catnm: category?.catnm || '',
      desc: category?.desc || ''
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      catnm: yup.string().min(5 , 'Min 5 characters are required').max(30, 'Max 30 characters are allowed').required('Category name is required'),
      desc: yup.string().min(10, 'Description must be at least 10 characters').max(100, 'Max 100 characters are allowed').required('Description is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await updateCategory({ ...category, ...values });
        onUpdateCategory(response.data);
        toast.success('Category updated successfully');
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>  <Typography variant="h4">Update Category</Typography></DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          fullWidth
          value={formik.values.catnm}
          onChange={formik.handleChange('catnm')}
          error={formik.touched.catnm && Boolean(formik.errors.catnm)}
          helperText={formik.touched.catnm && formik.errors.catnm}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={formik.values.desc}
          onChange={formik.handleChange('desc')}
          error={formik.touched.desc && Boolean(formik.errors.desc)}
          helperText={formik.touched.desc && formik.errors.desc}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit"  variant="contained" color="secondary" onClick={formik.handleSubmit}>
          Update</Button>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCategory;