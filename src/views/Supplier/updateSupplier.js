import  { useEffect, useState } from 'react';
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
import { updateSupplier } from 'apis/api.js';

const UpdateSupplier = ({ open, handleClose, supplier, onSupplierUpdated }) => {
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
  });

  const initialValues = {
    suppliernm: supplier?.suppliernm || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    shopName: supplier?.shopName || '',
    address: supplier?.address || '',
    typeOfSupplier: supplier?.typeOfSupplier || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        if (!supplier) {
          toast.error('No supplier data available for update');
          return;
        }

        const response = await updateSupplier({ ...values, _id: supplier._id });
        onSupplierUpdated(response?.data);
        toast.success('Supplier updated successfully');
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to update supplier');
      } finally {
        setIsSubmitting(false);
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (supplier) {
      formik.setValues(initialValues);
    }
  }, [supplier]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Supplier</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Typography style={{ marginBottom: '15px' }} variant="h4">Supplier Details</Typography>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <FormLabel>Name</FormLabel>
              <TextField
                required
                id="suppliernm"
                name="suppliernm"
                size="small"
                fullWidth
                value={formik.values.suppliernm}
                onChange={formik.handleChange}
                error={formik.touched.suppliernm && Boolean(formik.errors.suppliernm)}
                helperText={formik.touched.suppliernm && formik.errors.suppliernm}
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
              <FormLabel>Shop Name</FormLabel>
              <TextField
                required
                id="shopName"
                name="shopName"
                size="small"
                fullWidth
                value={formik.values.shopName}
                onChange={formik.handleChange}
                error={formik.touched.shopName && Boolean(formik.errors.shopName)}
                helperText={formik.touched.shopName && formik.errors.shopName}
              />
            </Grid>
            <Grid item xs={6}>
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
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          color="secondary"
          onClick={formik.handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Update'}
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

export default UpdateSupplier;
