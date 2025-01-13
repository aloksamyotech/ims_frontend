import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import {
  Grid,
  TextField,
  Typography,
  Button,
  Card,
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
  IconButton,
  Breadcrumbs,
  Tooltip,
  Link as MuiLink,
  Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconTrash } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { addPurchase, fetchProducts, fetchSuppliers } from 'apis/api.js';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';

const useStyles = makeStyles({
  input: {
    backgroundColor: '#ffff'
  }
});

const TAX_RATE = 0.07;

const PurchaseForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [supplierList, setSupplierList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');
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
      total: 0,
      tax: 0
    },
    onSubmit: async (values) => {
      const userId = getUserId();

      const purchaseData = {
        ...values,
        userId: userId,
        products: rows?.map((row) => {
          const selectedProduct = productList?.find((product) => product._id === row.product);
          return {
            productId: row.product,
            productName: selectedProduct ? selectedProduct.productnm : '',
            categoryName: row.categoryName,
            quantity: row.quantity,
            price: row.price || 0,
            subtotal: row.subtotal || 0
          };
        }),
        subtotal: purchaseSubtotal,
        tax: purchaseTaxes,
        total: purchaseTotal
      };

      try {
        const response = await addPurchase(purchaseData);
        toast.success('Purchase added successfully');
        formik.resetForm();
        navigate('/dashboard/purchases');
        setRows([{ product: '', quantity: 1, price: 0, subtotal: 0 }]);
      } catch (error) {
        toast.error('Failed to add purchase');
      }
    }
  });

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId();
      try {
        const productResult = await fetchProducts();
        const filteredProducts = productResult?.data.filter((product) => product.userId === userId);
        setProductList(filteredProducts);
        const supplierResult = await fetchSuppliers();
        const filteredSuppliers = supplierResult?.data.filter((supplier) => supplier.userId === userId);
        setSupplierList(filteredSuppliers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddRow = () => {
    const productNotSelected = rows?.some((row) => !row.product);

    if (productNotSelected) {
      toast.error('Product not selected! Please select a product before adding a row.');
      return;
    }

    setRows([...rows, { product: '', quantity: 1, price: 0, subtotal: 0 }]);
  };

  const handleAddPurchase = (event) => {
    event.preventDefault();
    const productNotSelected = rows?.some((row) => !row.product);
    if (productNotSelected) {
      toast.error('Product not selected! Please select a product before adding the purchase.');
      return;
    }
    formik.submitForm();
  };

  const handleProductChange = (index, event) => {
    const productId = event.target.value;
    const selectedProduct = productList?.find((product) => product._id === productId);
    const newRows = [...rows];

    newRows[index].product = productId;
    newRows[index].productName = selectedProduct ? selectedProduct.productnm : '';
    newRows[index].categoryName = selectedProduct ? selectedProduct.categoryName : '';
    newRows[index].price = selectedProduct ? selectedProduct.buyingPrice : 0;
    newRows[index].subtotal = newRows[index].quantity * newRows[index].price;

    setRows(newRows);
  };

  const handleQuantityChange = (index, event) => {
    let quantity = parseInt(event.target.value, 10);

    if (quantity > 1000) {
      toast.error('Quantity cannot be more than 1000!');
      quantity = 1000;
    } else if (quantity < 1) {
      quantity = 1;
    }

    const newRows = [...rows];
    newRows[index].quantity = quantity;
    newRows[index].subtotal = quantity * newRows[index].price;
    setRows(newRows);
  };

  const handleRemoveRow = (index) => {
    const newRows = rows?.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const calculateSubtotal = () => {
    return rows?.reduce((acc, row) => acc + (row.subtotal || 0), 0);
  };

  const purchaseSubtotal = calculateSubtotal();
  const purchaseTaxes = purchaseSubtotal * TAX_RATE;
  const purchaseTotal = purchaseSubtotal + purchaseTaxes;

  return (
    <Grid>
      <Box
        sx={{
          backgroundColor: '#ffff',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">Add Purchase</Typography>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/purchases" color="inherit">
            <Typography color="text.primary">Purchases</Typography>
          </MuiLink>
          <Typography color="text.primary">AddPurchase</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ padding: '10px', marginTop: '20px' }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={1} sx={{ padding: '5px' }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Purchase Date</FormLabel>
              <TextField
                fullWidth
                id="date"
                name="date"
                type="date"
                size="small"
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Supplier *</FormLabel>
                <Select
                  id="supplierId"
                  name="supplierId"
                  size="small"
                  value={formik.values.supplierId}
                  onChange={formik.handleChange}
                  sx={{
                    bgcolor: '#ffff',
                    '& .MuiSelect-select': {
                      bgcolor: '#ffff'
                    }
                  }}
                >
                  <MenuItem value="">Select a supplier</MenuItem>
                  {supplierList?.map((supplier) => (
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

            <Grid item xs={12} sx={{ margin: '2px' }}>
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#1976d2' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            fullWidth
                            value={row.product}
                            size="small"
                            onChange={(event) => handleProductChange(index, event)}
                            displayEmpty
                          >
                            <MenuItem value="">Select a product</MenuItem>
                            {productList
                              ?.filter((product) => !rows?.some((r) => r.product === product._id) || row.product === product._id)
                              ?.map((product) => (
                                <MenuItem key={product._id} value={product._id}>
                                  {product.productnm}
                                </MenuItem>
                              ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField type="string" size="small" value={row?.categoryName} inputProps={{ readOnly: true }} />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            inputProps={{
                              min: 1,
                              max: 1000
                            }}
                            value={row?.quantity}
                            onChange={(event) => handleQuantityChange(index, event)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={(row?.price || 0).toFixed(2)}
                            inputProps={{ readOnly: true }}
                            InputProps={{
                              startAdornment: <span>{currencySymbol}</span>
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={(row?.subtotal || 0).toFixed(2)}
                            inputProps={{
                              readOnly: true
                            }}
                            InputProps={{
                              startAdornment: <span>{currencySymbol}</span>
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton onClick={() => handleRemoveRow(index)} color="error">
                            <IconTrash />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={6} align="right">
                        <Button variant="contained" color="primary" onClick={handleAddRow}>
                          +
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right">
                        Subtotal
                      </TableCell>
                      <TableCell align="right">
                        {currencySymbol}
                        {purchaseSubtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right">
                        Tax
                      </TableCell>
                      <TableCell align="right">
                        {currencySymbol}
                        {purchaseTaxes.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', color: 'black' }}>
                        Total
                      </TableCell>
                      <TableCell align="right">
                        {currencySymbol}
                        {purchaseTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '5px' }}>
                <Button variant="contained" color="secondary" type="submit" onClick={handleAddPurchase}>
                  Add Purchase
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Grid>
  );
};

export default PurchaseForm;
