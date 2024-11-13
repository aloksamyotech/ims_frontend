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
import { useState } from 'react';
import { addSupplier } from 'apis/api.js';

const AddSupplier = ({ open, handleClose, supplier, onSupplierAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    suppliernm: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
      .min(2, 'Min 2 character are allowed')
      .max(30, 'Max 30 character are allowed')
      .required('Supplier Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
      .required('Phone number is required'),
    shopName: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
      .min(5, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Shop name is required'),
    address: yup.string().min(10, 'Address must be at least 10 characters').max(50, 'Max 50 characters are allowed').required('Address is required'),
    typeOfSupplier: yup.string().required('Type of supplier is required'),
    accountHolder: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed')
      .max(30, 'Too Long!'),
    accountNumber: yup.string().max(12, 'Max 12 numbers are allowed').matches(/^[0-9]+$/, 'Account number must be numeric'),
  });

  const initialValues = {
    suppliernm: '',
    phone: '',
    email: '',
    shopName: '',
    address: '',
    accountHolder: '',
    accountNumber: '',
    typeOfSupplier: '',
    bankName: '',
  };

  const formik = useFormik({
    initialValues: supplier || initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await addSupplier(values);
        onSupplierAdded(response.data);
        toast.success('Supplier added successfully');
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error('Failed to add supplier');
      } finally {
        setIsSubmitting(false);
        handleClose();
      }
    }
  });

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
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">{supplier ? 'Edit Supplier' : 'Add Supplier'}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Typography style={{ marginBottom: '15px' }} variant="h4">
            Supplier Details
          </Typography>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12}>
              <FormLabel>Name</FormLabel>
              <TextField
                required
                id="suppliernm"
                name="suppliernm"
                size="large"
                fullWidth
                value={formik.values.suppliernm}
                onChange={formik.handleChange}
                error={formik.touched.suppliernm && Boolean(formik.errors.suppliernm)}
                helperText={formik.touched.suppliernm && formik.errors.suppliernm}
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
            <Grid item xs={12} sm={6}>
              <FormLabel>Phone Number</FormLabel>
              <TextField
                required
                id="phone"
                name="phone"
                size="large"
                type="number"
                fullWidth
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Shop Name</FormLabel>
              <TextField
                required
                id="shopName"
                name="shopName"
                size="large"
                fullWidth
                value={formik.values.shopName}
                onChange={formik.handleChange}
                error={formik.touched.shopName && Boolean(formik.errors.shopName)}
                helperText={formik.touched.shopName && formik.errors.shopName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Type of Supplier</FormLabel>
                <Select
                  required
                  id="typeOfSupplier"
                  name="typeOfSupplier"
                  size="small"
                  value={formik.values.typeOfSupplier}
                  onChange={formik.handleChange}
                  error={formik.touched.typeOfSupplier && Boolean(formik.errors.typeOfSupplier)}
                >
                  <MenuItem value="">Select a type</MenuItem>
                  <MenuItem value="Distributer">Distributer</MenuItem>
                  <MenuItem value="Wholesaler">Wholesaler</MenuItem>
                  <MenuItem value="Producer">Producer</MenuItem>
                </Select>
                <FormHelperText error={formik.touched.typeOfSupplier && Boolean(formik.errors.typeOfSupplier)}>
                  {formik.touched.typeOfSupplier && formik.errors.typeOfSupplier}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Bank Name</FormLabel>
              <Select required id="bankName" name="bankName" size="small" value={formik.values.bankName} onChange={formik.handleChange}>
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
                size="small"
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
                size="small"
                type="number"
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
                size="large"
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={isSubmitting} variant="contained" color="secondary" onClick={formik.handleSubmit}>
          {isSubmitting ? 'Submitting...' :  'Add'}
        </Button>
        <Button
         variant="contained"
          color="error"
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSupplier;
