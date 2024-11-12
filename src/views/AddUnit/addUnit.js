import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import ClearIcon from '@mui/icons-material/Clear';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { addUnit } from 'apis/api.js';

const AddUnit = ({ open, handleClose, onUnitAdded }) => {
  const formik = useFormik({
    initialValues: {
      unitnm: '',
      shortcode: '',
    },
    validationSchema: yup.object().shape({
      unitnm: yup.string().min(5 , 'Min 5 characters are required').max(10, 'Max 10 characters are allowed').required('Unit name is required'),
      shortcode: yup.string().max(5, 'Max 5 characters are required').required('Shortcode is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await addUnit(values);
        onUnitAdded(response.data); 
      } catch (error) {
        toast.error('Failed to add unit');
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}
>
    <DialogTitle
    id="scroll-dialog-title"
    style={{ display: 'flex', justifyContent: 'space-between' }}
  >
    <Typography variant="h3">Create Unit</Typography>
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
       
        <Button onClick={formik.handleSubmit} variant="contained" color="secondary" type="submit">Create</Button>
        <Button onClick={handleClose} variant="contained" color="error" >Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUnit;
