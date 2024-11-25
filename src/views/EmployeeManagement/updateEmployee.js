import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, Grid, FormLabel, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateUser } from 'apis/api.js';
import ClearIcon from '@mui/icons-material/Clear';

const UpdateUser = ({ open, handleClose, user, onUpdateUser }) => {
  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup
        .string()
        .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
        .min(2, 'Min 2 character are allowed')
        .max(30, 'Max 30 character are allowed')
        .required('User Name is required'),
      email: yup.string().email('Invalid email format').required('Email is required'),
      phone: yup
        .string()
        .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
        .required('Phone number is required')
    }),
    onSubmit: async (values) => {
      try {
        const response = await updateUser({ ...user, ...values });
        onUpdateUser(response?.data);
        toast.success('User updated successfully');
      } catch (error) {
        toast.error('Failed to update user');
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update User</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12}>
              <FormLabel>Name</FormLabel>
              <TextField
                required
                id="name"
                name="name"
                size="large"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Email</FormLabel>
              <TextField
                required
                id="email"
                name="email"
                size="large"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Phone Number</FormLabel>
              <TextField
                required
                id="phone"
                name="phone"
                size="large"
                type="text"
                fullWidth
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
          </Grid>
        </form>
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

export default UpdateUser;
