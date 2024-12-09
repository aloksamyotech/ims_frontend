import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateProduct } from 'apis/api.js';
import ClearIcon from '@mui/icons-material/Clear';
import { FormLabel } from '@mui/material';

const UpdateProduct = ({ open, handleClose, product, onProductUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    productnm: yup.string().max(20, 'Max 20 characters are allowed')
    .required('Product name is required'),
    buyingPrice: yup.number()
      .required('Buying Price is required')
      .positive('Must be a positive number')
      .max(1000000, 'Price cannot exceed Rs.1000000'),
    sellingPrice: yup.number()
      .required('Selling price is required')
      .positive('Must be a positive number')
      .max(1500000, 'Price cannot exceed Rs.1500000'),
    tax: yup.number()
      .max(50, 'Max 50% tax is allowed')
      .required('Tax is required'),
    margin: yup.number()
      .max(10000, 'Max 10000 margin is allowed')
      .required('Margin is required'),
    notes: yup.string()
      .max(400, 'Max 400 words are allowed'),
  });

  const formik = useFormik({
    initialValues: {
      productnm: product?.productnm || '',
      buyingPrice: product?.buyingPrice || '',
      sellingPrice: product?.sellingPrice || '',
      quantity: product?.quantity || '',
      tax: product?.tax || '',
      margin: product?.margin || '',
      notes: product?.notes || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (!product) {
          toast.error('No product data available for update');
          return;
        }

        const response = await updateProduct({ ...values, _id: product._id });
        onProductUpdated(response.data);
        toast.success('Product updated successfully');
        handleClose();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update product');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm(); 
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Product</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Typography style={{ marginBottom: '15px' }} variant="h4">Product Details</Typography>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
            <FormLabel>Product Name</FormLabel>
              <TextField
                required
                id="productnm"
                name="productnm"
                fullWidth
                size='small'
                value={formik.values.productnm}
                onChange={formik.handleChange}
                error={formik.touched.productnm && Boolean(formik.errors.productnm)}
                helperText={formik.touched.productnm && formik.errors.productnm}
              />
            </Grid>
            <Grid item xs={6}>
            <FormLabel>Buying Price</FormLabel>
              <TextField
                required
                id="buyingPrice"
                name="buyingPrice"
                type="number"
                size='small'
                fullWidth
                value={formik.values.buyingPrice}
                onChange={formik.handleChange}
                error={formik.touched.buyingPrice && Boolean(formik.errors.buyingPrice)}
                helperText={formik.touched.buyingPrice && formik.errors.buyingPrice}
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Selling Price</FormLabel>
              <TextField
                required
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                size='small'
                fullWidth
                value={formik.values.sellingPrice}
                onChange={formik.handleChange}
                error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
              />
            </Grid>
            <Grid item xs={6}>
            <FormLabel>Tax(%)</FormLabel>
              <TextField
                required
                id="tax"
                name="tax"
                type="number"
                size='small'
                fullWidth
                value={formik.values.tax}
                onChange={formik.handleChange}
                error={formik.touched.tax && Boolean(formik.errors.tax)}
                helperText={formik.touched.tax && formik.errors.tax}
              />
            </Grid>
            <Grid item xs={6}>
            <FormLabel>Margin(%)</FormLabel>
              <TextField
                id="margin"
                name="margin"
                type="number"
                size='small'
                fullWidth
                value={formik.values.margin}
                onChange={formik.handleChange}
                error={formik.touched.margin && Boolean(formik.errors.margin)}
                helperText={formik.touched.margin && formik.errors.margin}
              />
            </Grid>
            <Grid item xs={12}>
            <FormLabel>Notes</FormLabel>
              <TextField
                id="notes"
                name="notes"
                size='small'
                fullWidth
                multiline
                rows={2}
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
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

export default UpdateProduct;
