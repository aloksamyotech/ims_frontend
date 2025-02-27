import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormHelperText, FormLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';
import { throttle } from 'lodash';
import { addEmployee } from 'apis/api.js';
import { getUserId } from 'apis/constant.js';

const AddEmployee = ({ open, handleClose, employee, onEmployeeAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
      .min(2, 'Min 2 character are allowed')
      .max(30, 'Max 30 character are allowed')
      .required('Employee Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password cannot be longer than 20 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    phone: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
      .required('Phone number is required'),
    address: yup
      .string()
      .min(10, 'Address must be at least 10 characters')
      .max(50, 'Max 50 characters are allowed')
      .required('Address is required')
  });

  const initialValues = {
    name: '',
    phone: '',
    email: '',
    address: '',
    password: ''
  };

  const formik = useFormik({
    initialValues: employee || initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      const userId = getUserId();

      try {
        const payload = { ...values, userId };
        const response = await addEmployee(payload);

        if (response?.data && response?.data?.message) {
          toast.error(response.data.message);
        } else {
          onEmployeeAdded(response?.data);
          toast.success('Employee added successfully');
          resetForm();
          handleClose();
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to add employee');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const throttledSubmit = useCallback(throttle(formik.handleSubmit, 3000), [formik.handleSubmit]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: '600px',
          height: 'auto',
          maxWidth: 'none'
        }
      }}
    >
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Add Enployee</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={throttledSubmit}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <FormLabel>Password</FormLabel>
              <TextField
                required
                id="password"
                name="password"
                size="small"
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Phone number</FormLabel>
              <TextField
                required
                id="phone"
                name="phone"
                size="small"
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
          <DialogActions>
            <Button type="submit" disabled={isSubmitting} variant="contained" color="secondary">
              {isSubmitting ? 'Submitting...' : 'Add'}
            </Button>
            <Button
              variant="contained"
              style={{ textTransform: 'capitalize' }}
              color="error"
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
