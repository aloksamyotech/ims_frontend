import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateUnits } from 'apis/api.js';
import ClearIcon from '@mui/icons-material/Clear';

const UpdateUnit = ({ open, handleClose, unit, onUnitUpdated }) => {
  const formik = useFormik({
    initialValues: {
      unitnm: unit?.unitnm || '',
      shortcode: unit?.shortcode || ''
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      unitnm: yup.string().max(10, 'Max 10 characters are allowed').required('Unit name is required'),
      shortcode: yup.string().max(5, 'Max 5 characters are required').required('Shortcode is required')
    }),
    onSubmit: async (values) => {
      try {
        const response = await updateUnits({ ...unit, ...values });
        onUnitUpdated(response?.data);
        toast.success('Unit updated successfully');
      } catch (error) {
        toast.error('Failed to update unit');
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose}>
     <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Unit</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Unit Name"
          fullWidth
          value={formik.values.unitnm}
          onChange={formik.handleChange('unitnm')}
          error={formik.touched.unitnm && Boolean(formik.errors.unitnm)}
          helperText={formik.touched.unitnm && formik.errors.unitnm}
        />
        <TextField
          margin="dense"
          label="Shortcode"
          fullWidth
          value={formik.values.shortcode}
          onChange={formik.handleChange('shortcode')}
          error={formik.touched.shortcode && Boolean(formik.errors.shortcode)}
          helperText={formik.touched.shortcode && formik.errors.shortcode}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="secondary" onClick={formik.handleSubmit}>
          Update
        </Button>
        <Button onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUnit;
