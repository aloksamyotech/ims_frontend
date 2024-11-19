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
import { addCustomer } from 'apis/api.js';

const AddCustomer = ({ open, handleClose,customer, onCustomerAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    customernm: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
      .min(2, 'Min 2 character are allowed')
      .max(30, 'Max 30 character are allowed')
      .required('Customer Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
      .required('Phone number is required'),
    address: yup.string().min(10, 'Address must be at least 10 characters').max(50, 'Max 50 characters are allowed').required('Address is required'),
    accountHolder: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
      .max(30, 'Max 30 characters are allowed')
      .required('Account holder name is required'),
    accountNumber: yup.string().max(12, 'Max 12 numbers are allowed').matches(/^[0-9]+$/, 'Account number must be numeric'),
    bankName: yup.string().required('Bank name is required'),
  });

  const initialValues = {
    customernm: '',
    phone: '',
    email: '',
    address: '',
    accountHolder: '',
    accountNumber: '',
    bankName: '',
  };

  const formik = useFormik({
    initialValues: customer || initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await addCustomer(values);
        console.log(response);
        onCustomerAdded(response.data);
        toast.success('Customer added successfully');
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error('Failed to add customer');
      } finally {
        setIsSubmitting(false);
        handleClose();
      }
    },
  });

  const throttledSubmit = useCallback(throttle(formik.handleSubmit, 20000), [formik.handleSubmit]);

  return (
    <Dialog open={open} onClose={handleClose}
    PaperProps={{
      style: {
        width: '900px', 
        height: '900px', 
        maxWidth: 'none', 
      },
    }}>
      <DialogTitle
        id="scroll-dialog-title"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="h3">Add Customer</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={throttledSubmit}>
          <Typography style={{ marginBottom: '15px' }} variant="h4">Customer Details</Typography>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 5, md: 2 }} >
            <Grid item xs={12} sm={6}>
              <FormLabel>Name</FormLabel>
              <TextField
                required
                id="customernm"
                name="customernm"
                fullWidth
                value={formik.values.customernm}
                onChange={formik.handleChange}
                error={formik.touched.customernm && Boolean(formik.errors.customernm)}
                helperText={formik.touched.customernm && formik.errors.customernm}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Email</FormLabel>
              <TextField
                required
                id="email"
                name="email"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Phone number</FormLabel>
              <TextField
                required
                id="phone"
                name="phone"
                fullWidth
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Bank Name</FormLabel>
                <Select
                  required
                  id="bankName"
                  name="bankName"
                  value={formik.values.bankName}
                  onChange={formik.handleChange}
                  error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                >
                  <MenuItem value="">Select a bank</MenuItem>
                  <MenuItem value="BRI">BRI</MenuItem>
                  <MenuItem value="BNI">BNI</MenuItem>
                  <MenuItem value="BSI">BSI</MenuItem>
                </Select>
                <FormHelperText error={formik.touched.bankName && Boolean(formik.errors.bankName)}>
                  {formik.touched.bankName && formik.errors.bankName}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Account Holder</FormLabel>
              <TextField
                id="accountHolder"
                name="accountHolder"
                fullWidth
                value={formik.values.accountHolder}
                onChange={formik.handleChange}
                error={formik.touched.accountHolder && Boolean(formik.errors.accountHolder)}
                helperText={formik.touched.accountHolder && formik.errors.accountHolder}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Account Number</FormLabel>
              <TextField
                id="accountNumber"
                name="accountNumber"
                type="text"
                fullWidth
                value={formik.values.accountNumber}
                onChange={formik.handleChange}
                error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                helperText={formik.touched.accountNumber && formik.errors.accountNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Address</FormLabel>
              <TextField
                required
                id="address"
                name="address"
                multiline
                fullWidth
                rows={3}
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

export default AddCustomer;
