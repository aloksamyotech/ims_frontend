import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateProduct, fetchCategories } from 'apis/api.js';
import ClearIcon from '@mui/icons-material/Clear';
import { getUserId } from 'apis/constant.js';

const UpdateProduct = ({ open, handleClose, product, onProductUpdated, loadProducts }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clist, setCatList] = useState([]);

  const validationSchema = yup.object({
    productnm: yup.string().max(20, 'Max 20 characters are allowed').required('Product name is required'),
    buyingPrice: yup
      .number()
      .required('Buying Price is required')
      .positive('Must be a positive number')
      .max(1000000, 'Price cannot exceed Rs.1000000'),
    sellingPrice: yup
      .number()
      .required('Selling price is required')
      .positive('Must be a positive number')
      .max(1500000, 'Price cannot exceed Rs.1500000'),
    tax: yup.number().max(50, 'Max 50% tax is allowed').required('Tax is required'),
    margin: yup.number().max(10000, 'Max 10000 margin is allowed').required('Margin is required'),
    notes: yup.string().max(400, 'Max 400 words are allowed'),
    catnm: yup.string().required('Category is required')
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
      catnm: product?.categoryId || '',
      image: product?.imageUrl ? product.imageUrl : null
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (!product || !product._id) {
          toast.error('No product data available for update');
          return;
        }

        const formData = new FormData();
        formData.append('productnm', values.productnm);
        formData.append('buyingPrice', values.buyingPrice);
        formData.append('sellingPrice', values.sellingPrice);
        formData.append('quantity', values.quantity);
        formData.append('tax', values.tax);
        formData.append('margin', values.margin);
        formData.append('notes', values.notes);
        formData.append('categoryId', values.catnm);
        formData.append('_id', product._id);

        if (values.image && values.image instanceof File) {
          formData.append('image', values.image);
        }

        const response = await updateProduct(product._id, formData);
        if (response?.data) {
          onProductUpdated(response.data);
        } else {
          console.error('Update API response is missing product data.');
        }
        loadProducts();
        toast.success('Product updated successfully');
        handleClose();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update product');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResult = await fetchCategories();
        const allCategories = categoryResult?.data;
        const userId = getUserId();
        const filteredCategories = allCategories.filter((category) => category.userId === userId);
        setCatList(filteredCategories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const { buyingPrice, sellingPrice } = formik.values;
    if (buyingPrice && sellingPrice && sellingPrice > 0) {
      const margin = ((sellingPrice - buyingPrice) / sellingPrice) * 100;
      formik.setFieldValue('margin', margin.toFixed(2));
    }
  }, [formik.values.buyingPrice, formik.values.sellingPrice]);

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
          <Typography style={{ marginBottom: '15px' }} variant="h4">
            Product Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormLabel>Product Name</FormLabel>
              <TextField
                required
                id="productnm"
                name="productnm"
                fullWidth
                size="small"
                value={formik.values.productnm}
                onChange={formik.handleChange}
                error={formik.touched.productnm && Boolean(formik.errors.productnm)}
                helperText={formik.touched.productnm && formik.errors.productnm}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Product Category</FormLabel>
                <Select required id="catnm" name="catnm" size="small" value={formik.values.catnm} onChange={formik.handleChange}>
                  {clist.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.catnm}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{formik.touched.catnm && formik.errors.catnm}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormLabel>Buying Price</FormLabel>
              <TextField
                required
                id="buyingPrice"
                name="buyingPrice"
                type="number"
                size="small"
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
                size="small"
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
                size="small"
                fullWidth
                value={formik.values.tax}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <FormLabel>Margin(%)</FormLabel>
              <TextField id="margin" name="margin" size="small" fullWidth value={formik.values.margin} disabled />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>Upload Image</FormLabel>
              {formik.values.image ? (
                <Box mt={1}>
                  <img
                    src={typeof formik.values.image === 'string' ? formik.values.image : URL.createObjectURL(formik.values.image)}
                    alt="Product Preview"
                    style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Box>
              ) : null}

              <input type="file" accept="image/*" onChange={(e) => formik.setFieldValue('image', e.target.files[0])} />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button type="submit" disabled={isSubmitting} variant="contained" color="secondary" onClick={formik.handleSubmit}>
          {isSubmitting ? 'Submitting...' : 'Update'}
        </Button>
        <Button variant="contained" color="error" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProduct;
