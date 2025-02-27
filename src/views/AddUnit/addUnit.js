import React, { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, FormLabel,Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import ClearIcon from '@mui/icons-material/Clear';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { addUnit } from 'apis/api.js';

const AddUnit = ({ open, handleClose, onUnitAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      unitnm: '',
      shortcode: ''
    },
    validationSchema: yup.object().shape({
      unitnm: yup.string().max(10, 'Max 10 characters are allowed').required('Unit name is required'),
      shortcode: yup.string().max(5, 'Max 5 characters are required').required('Shortcode is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await addUnit(values);
        onUnitAdded(response?.data);
        handleClose();
        toast.success('Unit added successfully');
        resetForm();
      } catch (error) {
        toast.error('Failed to add unit');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Add Unit</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormLabel>Name</FormLabel>
              <TextField
                autoFocus
                margin="dense"
                required
                id="unitnm"
                name="unitnm"
                fullWidth
                type="text"
                value={formik.values.unitnm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.unitnm && Boolean(formik.errors.unitnm)}
                helperText={formik.touched.unitnm && formik.errors.unitnm}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Shortcode</FormLabel>
              <TextField
                required
                margin="dense"
                id="shortcode"
                name="shortcode"
                fullWidth
                type="text"
                value={formik.values.shortcode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.shortcode && Boolean(formik.errors.shortcode)}
                helperText={formik.touched.shortcode && formik.errors.shortcode}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button type="submit" disabled={isSubmitting} variant="contained" color="secondary">
              {isSubmitting ? 'Submitting...' : 'Add Unit'}{' '}
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

export default AddUnit;
