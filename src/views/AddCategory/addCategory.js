import React, { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, FormLabel } from '@mui/material';
import { useFormik } from 'formik';
import ClearIcon from '@mui/icons-material/Clear';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import {getUserId} from 'apis/constant.js';
import { addCategory } from 'apis/api.js';

const AddCategory = ({ open, handleClose, onCategoryAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    catnm: yup.string().max(30, 'Max 30 characters are allowed').required('Category name is required'),
    desc: yup.string().max(100, 'Max 100 characters are allowed').required('Description is required')
  });

  const formik = useFormik({
    initialValues: {
      catnm: '',
      desc: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
    
      const userId = getUserId();
      if (!userId) {
        toast.error('User ID is missing. Please log in again.');
        setIsSubmitting(false);
        return;
      }
    
      try {
        const payload = { ...values, userId };
        const response = await addCategory(payload);
        onCategoryAdded(response?.data);
        handleClose();
        toast.success('Category added successfully');
        resetForm();
      } catch (error) {
        console.log(error);
        toast.error('Failed to add category');
      } finally {
        setIsSubmitting(false);
      }
    }
    
  });

  return (
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle
    id="scroll-dialog-title"
    style={{ display: 'flex', justifyContent: 'space-between' }}
  >
    <Typography variant="h3">Add Product Category</Typography>
    <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
  </DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <FormLabel>Name</FormLabel>
              <TextField
                autoFocus
                margin="dense"
                required
                id="catnm"
                name="catnm"
                size='small'
                fullWidth
                type="text"
                value={formik.values.catnm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.catnm && Boolean(formik.errors.catnm)}
                helperText={formik.touched.catnm && formik.errors.catnm}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormLabel>Description</FormLabel>
              <TextField
                required
                margin="dense"
                id="desc"
                name="desc"
                fullWidth
                type="text"
                size='small'
                value={formik.values.desc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.desc && Boolean(formik.errors.desc)}
                helperText={formik.touched.desc && formik.errors.desc}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button type="submit" disabled={isSubmitting} variant="contained" color="secondary">
              {isSubmitting ? 'Submitting...' : 'Add'}{' '}
            </Button>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
