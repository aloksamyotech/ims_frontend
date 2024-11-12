import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { throttle } from 'lodash';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addProduct, fetchCategories, fetchUnits } from 'apis/api.js';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  input: {
    backgroundColor: '#ffff'
  }
});

const AddProductPage = () => {
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [clist, setCatList] = useState([]);
  const [ulist, setUnitList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('productnm', values.productnm);
      formData.append('categoryId', values.catnm);
      formData.append('unitId', values.unitnm);
      formData.append('buyingPrice', values.buyingPrice);
      formData.append('sellingPrice', values.sellingPrice);
      formData.append('tax', values.tax);
      formData.append('margin', values.margin);
      formData.append('notes', values.notes);
      if (image) {
        formData.append('file', image); 
      }

      const res = await addProduct(formData);
      console.log(res);
      toast.success('Product added successfully');
      resetForm();
      setImage(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const throttledSubmit = useCallback(throttle(handleSubmit, 20000), [handleSubmit]);

  const validationSchema = yup.object({
    productnm: yup
      .string()
      .min(3, 'Min 3 characters are required')
      .max(20, 'Max 20 characters are allowed')
      .required('Product name is required'),
    catnm: yup.string().required('Product Category is required'),
    unitnm: yup.string().required('Unit is required'),
    buyingPrice: yup
      .number()
      .required('Buying Price is required')
      .positive('Must be a positive number')
      .min(20000, 'Price must be at least Rs.20000')
      .max(200000, 'Price cannot exceed Rs.200000'),
    sellingPrice: yup
      .number()
      .required('Selling price is required')
      .positive('Must be a positive number')
      .min(20000, 'Price must be at least Rs.20000')
      .max(200000, 'Price cannot exceed Rs.200000')
      .moreThan(yup.ref('buyingPrice'), 'Selling price must be greater than buying price'),
    tax: yup.number().max(20, 'Max 20% tax is allowed').required('Tax is required'),
    margin: yup.number().max(20, 'Max 20% margin is allowed').required('Margin is required'),
    notes: yup.string().max(400, 'Max 400 words are allowed')
  });

  const initialValues = {
    productnm: '',
    catnm: '',
    unitnm: '',
    buyingPrice: '',
    sellingPrice: '',
    tax: '',
    margin: '',
    notes: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: throttledSubmit
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setImage(file);
      toast.success('Image added successfully!');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResult = await fetchCategories();
        setCatList(categoryResult.data);
        const unitResult = await fetchUnits();
        setUnitList(unitResult.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Link to="/dashboard/products">
        <Button sx={{ marginTop: '5px' }} variant="contained" color="primary" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
      </Link>
      <Typography marginTop={5} variant="h3" gutterBottom>
        Create Product
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="300px"
            border={1}
            borderColor="grey.300"
            borderRadius={1}
            bgcolor="background.paper"
            marginRight={2}
          >
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Product Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <Typography variant="body1" color="textSecondary">
                No image selected
              </Typography>
            )}
          </Box>
          <input accept="image/*" style={{ display: 'none' }} id="image-upload" type="file" onChange={handleImageChange} />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span" sx={{ marginTop: '10px' }}>
              Upload Image
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormLabel>Product Name</FormLabel>
                <TextField
                  id="productnm"
                  name="productnm"
                  fullWidth
                  value={formik.values.productnm}
                  onChange={formik.handleChange}
                  error={formik.touched.productnm && Boolean(formik.errors.productnm)}
                  helperText={formik.touched.productnm && formik.errors.productnm}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>Product Category</FormLabel>
                  <Select
                    id="catnm"
                    name="catnm"
                    value={formik.values.catnm}
                    onChange={formik.handleChange}
                    sx={{
                      backgroundColor: '#ffff',
                      '& .MuiSelect-root': {
                        backgroundColor: '#ffff',
                      },
                    }}
                  >
                    {clist.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.catnm}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>{formik.touched.catnm && formik.errors.catnm}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.unitnm && Boolean(formik.errors.unitnm)}>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    id="unitnm"
                    name="unitnm"
                    value={formik.values.unitnm}
                    onChange={formik.handleChange}
                    sx={{
                      backgroundColor: '#ffff',
                      '& .MuiSelect-root': {
                        backgroundColor: '#ffff',
                      },
                    }}
                  >
                    {ulist.map((unit) => (
                      <MenuItem key={unit._id} value={unit._id}>
                        {unit.unitnm}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{formik.touched.unitnm && formik.errors.unitnm}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Buying Price</FormLabel>
                <TextField
                  id="buyingPrice"
                  name="buyingPrice"
                  type="number"
                  fullWidth
                  value={formik.values.buyingPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.buyingPrice && Boolean(formik.errors.buyingPrice)}
                  helperText={formik.touched.buyingPrice && formik.errors.buyingPrice}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Selling Price</FormLabel>
                <TextField
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  fullWidth
                  value={formik.values.sellingPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                  helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Tax</FormLabel>
                <TextField
                  id="tax"
                  name="tax"
                  type="number"
                  fullWidth
                  value={formik.values.tax}
                  onChange={formik.handleChange}
                  error={formik.touched.tax && Boolean(formik.errors.tax)}
                  helperText={formik.touched.tax && formik.errors.tax}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Margin</FormLabel>
                <TextField
                  id="margin"
                  name="margin"
                  type="number"
                  fullWidth
                  value={formik.values.margin}
                  onChange={formik.handleChange}
                  error={formik.touched.margin && Boolean(formik.errors.margin)}
                  helperText={formik.touched.margin && formik.errors.margin}
                  InputProps={{
                    className: classes.input
                  }}
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
                  InputProps={{
                    className: classes.input
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  // disabled={isSubmitting}
                  sx={{ marginTop: '10px' , alignContent : 'end'}}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProductPage;
