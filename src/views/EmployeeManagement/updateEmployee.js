import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, Grid, FormLabel, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateEmployee } from 'apis/api.js';
import ClearIcon from '@mui/icons-material/Clear';

const Employee = ({ open, handleClose, employee, onUpdateEmployee }) => {
  const formik = useFormik({
    initialValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      address: employee?.address || '',
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup
        .string()
        .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
        .min(2, 'Min 2 character are allowed')
        .max(30, 'Max 30 character are allowed')
        .required('Employee Name is required'),
      email: yup.string().email('Invalid email format').required('Email is required'),
      phone: yup
        .string()
        .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
        .required('Phone number is required'),
      address: yup
        .string()
        .min(10, 'Address must be at least 10 characters')
        .max(50, 'Max 50 characters are allowed')
        .required('Address is required')
    }),
    onSubmit: async (values) => {
      try {
        const response = await updateEmployee({ ...employee, ...values });
        onUpdateEmployee(response.data);
        toast.success('Employee updated successfully');
      } catch (error) {
        console.log(error);
        toast.error('Failed to update employee');
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Employee</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Name</FormLabel>
              <TextField
                required
                id="name"
                name="name"
                size="small"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Email</FormLabel>
              <TextField
                required
                id="email"
                name="email"
                size="small"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Phone Number</FormLabel>
              <TextField
                required
                id="phone"
                name="phone"
                size="small"
                type="text"
                fullWidth
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Address</FormLabel>
              <TextField
                required
                id="address"
                name="address"
                size="small"
                multiline
                fullWidth
                rows={2}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
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

export default Employee;
