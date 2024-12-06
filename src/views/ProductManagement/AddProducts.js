import React, { useState, useEffect } from 'react';
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
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { addProduct, fetchCategories, fetchUnits } from 'apis/api.js';

const AddProductPage = ({ open, handleClose, product, onProductAdded }) => {
  const [image, setImage] = useState('');
  const [products, setProducts] = useState([]);
  const [clist, setCatList] = useState([]);
  // const [ulist, setUnitList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    productnm: yup.string().max(50, 'Max 30 characters are allowed').required('Product name is required'),
    catnm: yup.string().required('Product Category is required'),
    // unitnm: yup.string().required('Unit is required'),
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
    tax: yup.number().max(20, 'Max 20% tax is allowed').required('Tax is required'),
    notes: yup.string().max(400, 'Max 400 words are allowed')
  });

  const initialValues = {
    productnm: '',
    catnm: '',
    unitnm: 'pieces',
    buyingPrice: '',
    sellingPrice: '',
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
      try {
        const formData = new FormData();
        formData.append('productnm', values.productnm);
        formData.append('categoryId', values.catnm);
        // formData.append('unitId', values.unitnm);
        formData.append('buyingPrice', values.buyingPrice);
        formData.append('sellingPrice', values.sellingPrice);
        formData.append('tax', values.tax);
        formData.append('margin', values.margin);
        formData.append('notes', values.notes);
        if (values.image) {
          formData.append('image', values.image);
        }
        const response = await axios.post('http://localhost:4200/product/save', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (onProductAdded) {
          onProductAdded(response.data);
          toast.success('Product added successfully');
        }
        resetForm();
        setImage(null);
        window.location.reload();
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
        setCatList(categoryResult?.data);
        // const unitResult = await fetchUnits();
        // setUnitList(unitResult?.data);
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
        <form onSubmit={formik.handleSubmit}>
          <Typography style={{ marginBottom: '15px' }} variant="h4">
            Product Details
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 5, md: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Product Name</FormLabel>
              <TextField
                required
                id="productnm"
                name="productnm"
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
                <Select required id="catnm" name="catnm" value={formik.values.catnm} onChange={formik.handleChange}>
                  {clist.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.catnm}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{formik.touched.catnm && formik.errors.catnm}</FormHelperText>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Unit</FormLabel>
                <Select required id="unitnm" name="unitnm" value={formik.values.unitnm} onChange={formik.handleChange}>
                  {ulist.map((unit) => (
                    <MenuItem key={unit._id} value={unit._id}>
                      {unit.unitnm}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{formik.touched.unitnm && formik.errors.unitnm}</FormHelperText>
              </FormControl>
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <FormLabel>Buying Price</FormLabel>
              <TextField
                required
                id="buyingPrice"
                name="buyingPrice"
                type="number"
                fullWidth
                value={formik.values.buyingPrice}
                onChange={formik.handleChange}
                error={formik.touched.buyingPrice && Boolean(formik.errors.buyingPrice)}
                helperText={formik.touched.buyingPrice && formik.errors.buyingPrice}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Selling Price</FormLabel>
              <TextField
                required
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                fullWidth
                value={formik.values.sellingPrice}
                onChange={formik.handleChange}
                error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Tax(%)</FormLabel>
              <TextField
                required
                id="tax"
                name="tax"
                type="number"
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
