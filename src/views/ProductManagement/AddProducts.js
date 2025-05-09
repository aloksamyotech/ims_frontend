import React, { useState, useEffect, useCallback } from 'react';
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
  Autocomplete,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import { addApi } from 'apis/common.js';
import { fetchCategories } from 'apis/api.js';
import { getUserId } from 'apis/constant.js';
import { throttle } from 'lodash';

const AddProductPage = ({ open, handleClose, product, onProductAdded, loadProducts }) => {
  const [image, setImage] = useState('');
  const [products, setProducts] = useState([]);
  const [clist, setCatList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    productnm: yup.string().max(50, 'Max 30 characters are allowed').required('Product name is required'),
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
    notes: yup.string().max(400, 'Max 400 words are allowed'),
    quantityAlert: yup.number().required('Quantity alert is required').max(50, 'Max 50 quantity is allowed')
  });

  const initialValues = {
    productnm: '',
    catnm: '',
    unitnm: 'pieces',
    buyingPrice: '',
    sellingPrice: '',
    quantityAlert: '',
    tax: '',
    notes: '',
    image: null
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      const userId = getUserId();
      try {
        const formData = new FormData();
        formData.append('productnm', values.productnm);
        formData.append('categoryId', values.catnm);
        formData.append('buyingPrice', values.buyingPrice);
        formData.append('sellingPrice', values.sellingPrice);
        formData.append('quantityAlert', values.quantityAlert);
        formData.append('tax', values.tax);
        formData.append('margin', values.margin);
        formData.append('notes', values.notes);
        formData.append('userId', userId);
        if (values.image) {
          formData.append('image', values.image);
        }
        const response = await addApi('/product/save', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (onProductAdded) {
          onProductAdded(response.data);
          loadProducts();
          toast.success('Product added successfully');
        }
        resetForm();
        setImage(null);
      } catch (error) {
        toast.error('Failed to add product');
      } finally {
        setIsSubmitting(false);
        handleClose();
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
    if (buyingPrice && sellingPrice) {
      const margin = ((sellingPrice - buyingPrice) / sellingPrice) * 100;
      formik.setFieldValue('margin', margin.toFixed(2));
    }
  }, [formik.values.buyingPrice, formik.values.sellingPrice]);

  const throttledSubmit = useCallback(throttle(formik.handleSubmit, 3000), [formik.handleSubmit]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: '600px',
          height: '600px',
          maxWidth: 'none'
        }
      }}
    >
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">{product ? 'Edit Product' : 'Add Product'}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={throttledSubmit}>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 5, md: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Product Name</FormLabel>
              <TextField
                required
                id="productnm"
                name="productnm"
                size="small"
                fullWidth
                value={formik.values.productnm}
                onChange={formik.handleChange}
                error={formik.touched.productnm && Boolean(formik.errors.productnm)}
                helperText={formik.touched.productnm && formik.errors.productnm}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Product Category</FormLabel>
                <Autocomplete
                  id="catnm"
                  options={clist}
                  getOptionLabel={(option) => option.catnm}
                  value={clist.find((cat) => cat._id === formik.values.catnm) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('catnm', newValue ? newValue._id : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      variant="outlined"
                      error={formik.touched.catnm && Boolean(formik.errors.catnm)}
                      helperText={formik.touched.catnm && formik.errors.catnm}
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: 200,
                      overflow: 'auto'
                    }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Buying Price / unit</FormLabel>
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

            <Grid item xs={12} sm={6}>
              <FormLabel>Selling Price / unit</FormLabel>
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

            <Grid item xs={12} sm={6}>
              <FormLabel>Quantity Alert</FormLabel>
              <TextField
                required
                id="quantityAlert"
                name="quantityAlert"
                type="number"
                size="small"
                fullWidth
                value={formik.values.quantityAlert}
                onChange={formik.handleChange}
                error={formik.touched.quantityAlert && Boolean(formik.errors.quantityAlert)}
                helperText={formik.touched.quantityAlert && formik.errors.quantityAlert}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                error={formik.touched.tax && Boolean(formik.errors.tax)}
                helperText={formik.touched.tax && formik.errors.tax}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Margin(%)</FormLabel>
              <TextField
                required
                id="margin"
                name="margin"
                type="number"
                size="small"
                fullWidth
                value={formik.values.margin}
                onChange={formik.handleChange}
                error={formik.touched.margin && Boolean(formik.errors.margin)}
                helperText={formik.touched.margin && formik.errors.margin}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>Notes</FormLabel>
              <TextField
                id="notes"
                name="notes"
                size="small"
                fullWidth
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ marginTop: '15px' }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="200px"
                border={1}
                borderColor="grey.300"
                borderRadius={1}
                bgcolor="background.paper"
                position="relative"
              >
                {formik.values.image ? (
                  <img src={URL.createObjectURL(formik.values.image)} alt="product" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Preview Image
                  </Typography>
                )}

                <Box position="absolute" left={0} bottom={0} p={2}>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(event) => formik.setFieldValue('image', event.target.files[0])}
                    style={{ display: 'block' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button type="submit" disabled={isSubmitting} variant="contained" color="secondary" onClick={formik.handleSubmit}>
          {isSubmitting ? 'Submitting...' : 'Add'}
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

export default AddProductPage;
