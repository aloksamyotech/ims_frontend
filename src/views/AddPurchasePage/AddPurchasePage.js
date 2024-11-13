import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import {
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  Box,
  MenuItem,
  FormLabel,
  FormControl,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconTrash } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { addPurchase, fetchProducts, fetchSuppliers } from 'apis/api.js';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  input: {
    backgroundColor: '#ffff'
  }
});

const TAX_RATE = 0.07;

const PurchaseForm = () => {
  const classes = useStyles();
  const [supplierList, setSupplierList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [rows, setRows] = useState([{ product: '', quantity: 1, price: 0, subtotal: 0 }]);
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const validationSchema = yup.object({ 
    date: yup.date().required('Date is required'),
    supplierId: yup.string().required('Supplier is required')
  });

  const formik = useFormik({
    validationSchema,
    initialValues: {
      date: formattedDate,
      supplierId: '',
      reference: 'LRS',
      total: 0,
      tax: 0
    },
    onSubmit: async (values) => {
      const purchaseData = {
        ...values,
        products: rows.map((row) => {
          const selectedProduct = productList.find((product) => product._id === row.product);
          return {
            productId: row.product,
            productName: selectedProduct ? selectedProduct.productnm : '', 
            categoryName: row.categoryName,
            quantity: row.quantity,
            price: row.price || 0,
            subtotal: row.subtotal || 0,
          };
        }),
        subtotal: purchaseSubtotal,
        tax: purchaseTaxes,
        total: purchaseTotal,
      };
    

      try {
        const response = await addPurchase(purchaseData);
        toast.success('Purchase added successfully');
        formik.resetForm();
        setRows([{ product: '', quantity: 1, price: 0, subtotal: 0 }]);
      } catch (error) {
        toast.error('Failed to add purchase');
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResult = await fetchProducts();
        setProductList(productResult.data);
        const supplierResult = await fetchSuppliers();
        setSupplierList(supplierResult.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddRow = () => {
    setRows([...rows, { product: '', quantity: 1, price: 0, subtotal: 0 }]);
  };

  const handleProductChange = (index, event) => {
    const productId = event.target.value;
    const selectedProduct = productList.find((product) => product._id === productId);
    const newRows = [...rows];
    
    newRows[index].product = productId;
    newRows[index].categoryName = selectedProduct ? selectedProduct.categoryName : '';
    newRows[index].price = selectedProduct ? selectedProduct.buyingPrice : 0; 
    newRows[index].subtotal = newRows[index].quantity * newRows[index].price;
    
    setRows(newRows);
  };

  const handleQuantityChange = (index, event) => {
    const quantity = event.target.value;
    const newRows = [...rows];
    newRows[index].quantity = quantity;
    newRows[index].subtotal = quantity * newRows[index].price;
    setRows(newRows);
  };

  const handleRemoveRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const calculateSubtotal = () => {
    return rows.reduce((acc, row) => acc + (row.subtotal || 0), 0); 
  };

  const purchaseSubtotal = calculateSubtotal();
  const purchaseTaxes = purchaseSubtotal * TAX_RATE;
  const purchaseTotal = purchaseSubtotal + purchaseTaxes;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Link to="/dashboard/purchases">
        <Button  sx={{marginTop:'5px'}} variant="contained" color="primary" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
      </Link>
      <Typography marginTop={5} variant="h3" gutterBottom>
        Add Purchase
      </Typography>
      <Grid container spacing={3} sx={{marginTop:'8px'}}>
        <Grid item xs={12} sm={4} md={4}>
          <FormLabel>Purchase Date</FormLabel>
          <TextField
            fullWidth
            id="date"
            name="date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            value={formik.values.date}
            onChange={formik.handleChange}
            InputProps={{
              className: classes.input
            }}
          />
          {formik.touched.date && formik.errors.date && <FormHelperText error>{formik.errors.date}</FormHelperText>}
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControl fullWidth>
            <FormLabel>Supplier *</FormLabel>
            <Select
              id="supplierId"
              name="supplierId"
              value={formik.values.supplierId}
              onChange={formik.handleChange}
              sx={{
                bgcolor: '#ffff', 
                '& .MuiSelect-select': {
                  bgcolor: '#ffff', 
                },
              }}
            >
              <MenuItem value="">Select a supplier</MenuItem>
              {supplierList.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.suppliernm}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error={formik.touched.supplierId && Boolean(formik.errors.supplierId)}>
              {formik.touched.supplierId && formik.errors.supplierId}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControl fullWidth>
            <FormLabel>Reference</FormLabel>
            <TextField id="reference" name="reference" value={formik.values.reference} 
            onChange={formik.handleChange}
            InputProps={{
              className: classes.input
            }} />
          </FormControl>
        </Grid>
        <Grid item xs={12} margin={2}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor:'#1976d2'}}>
                <TableRow>
                  <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
                  <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        fullWidth
                        value={row.product}
                        onChange={(event) => handleProductChange(index, event)}
                        displayEmpty
                      >
                        <MenuItem value="">Select a product</MenuItem>
                        {productList.map((product) => (
                          <MenuItem key={product._id} value={product._id}>
                            {product.productnm}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="string"
                        value={row.categoryName}
                        inputProps={{ readOnly: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={row.quantity}
                        onChange={(event) => handleQuantityChange(index, event)}
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={(row.price || 0).toFixed(2)}
                        inputProps={{ readOnly: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography>{row.subtotal.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveRow(index)} color="error">
                        <IconTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            <TableCell colSpan={6} align="right">
          <Button variant="contained" color="primary" onClick={handleAddRow}>
            +
          </Button>
          </TableCell>
          <TableRow>
            <TableCell colSpan={5} align="right">
              Subtotal
            </TableCell>
            <TableCell align="right">{purchaseSubtotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} align="right">
              Tax
            </TableCell>
            <TableCell align="right">{purchaseTaxes.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', color: 'black' }}>
              Total
            </TableCell>
            <TableCell align="right">{purchaseTotal.toFixed(2)}</TableCell>
          </TableRow>
          </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          <Button  variant="contained" color="secondary" type="submit">
           Add Purchase
          </Button>
          </ Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default PurchaseForm;
