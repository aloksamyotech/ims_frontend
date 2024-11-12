import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  Table,
  TableBody,
  FormGroup,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconTrash, IconShoppingCart } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCustomers, addCustomer } from 'apis/api.js';
import { useNavigate } from 'react-router-dom';

const TAX_RATE = 0.07;

const OrderForm = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [isWholesale, setIsWholesale] = useState(false);
  const [walkInData, setWalkInData] = useState({
    customernm: '',
    phone: '',
    email: '',
    address: ''
  });

  const validationSchema = yup.object({
    date: yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past').required('Date is required'),
    customernm: yup.string().required('Customer is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
      .required('Phone number is required'),
    address: yup
      .string()
      .min(10, 'Address must be at least 10 characters')
      .max(50, 'Max 50 characters are allowed')
      .required('Address is required'),
    quantity: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    tax: yup.number().min(5, 'Min 5% is allowed').max(12, 'Max 12% is allowed').required('Tax is required')
  });

  const formik = useFormik({
    initialValues: {
      date: '',
      customernm: '',
      phone: '',
      email: '',
      address: '',
      quantity: 1,
      productnm: '',
      sellingPrice: 0
    },
    validationSchema
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResult = await fetchProducts();
        setProductList(productResult.data);
        const customerResult = await fetchCustomers();
        setCustomerList(customerResult.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSelectProduct = (product) => {
    const existingProductIndex = products.findIndex((p) => p._id === product._id);

    if (existingProductIndex !== -1) {
      const updatedProducts = [...products];
      const newQuantity = Math.max(1, formik.values.quantity);
      const maxQuantity = updatedProducts[existingProductIndex].availableQuantity;
      
      if (newQuantity > maxQuantity) {
        alert(`Quantity limit exceeded! Maximum available quantity is ${maxQuantity}`);
        return;
      }

      updatedProducts[existingProductIndex].quantity = newQuantity;
      updatedProducts[existingProductIndex].subtotal = newQuantity * updatedProducts[existingProductIndex].sellingPrice;
      setProducts(updatedProducts);
    } else {
      const newProduct = {
        _id: product._id,
        productnm: product.productnm,
        quantity: 1,
        sellingPrice: product.sellingPrice,
        subtotal: product.sellingPrice,
        availableQuantity: product.quantity
      };
      setProducts([...products, newProduct]);
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...products];
    const newQuantity = Math.max(1, quantity);
    const maxQuantity = updatedProducts[index].availableQuantity;

    if (newQuantity > maxQuantity) {
      alert(`Quantity limit exceeded! Maximum available quantity is ${maxQuantity}`);
      return;
    }
    updatedProducts[index].quantity = newQuantity;
    updatedProducts[index].subtotal = newQuantity * updatedProducts[index].sellingPrice;

    setProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const calculateSubtotal = () => {
    return products.reduce((acc, product) => acc + product.subtotal, 0);
  };

  const invoiceSubtotal = calculateSubtotal();
  const invoiceTaxes = invoiceSubtotal * TAX_RATE;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  const handleCustomerChange = (event) => {
    const customerName = event.target.value;
    const customer = customerList?.find((c) => c.customernm === customerName);
    console.log(customer);
    setSelectedCustomer(customer);
    formik.setFieldValue('customernm', customerName);
  };

  const handleCreateInvoice = async () => {
    let customerData = {};
  
    if (isWalkIn) {
      customerData = {
        customernm: `Walk-in ${walkInData.customernm}`,
        email: walkInData.email,
        phone: walkInData.phone,
        address: walkInData.address,
        isWholesale: false,  
      };
  
      const savedCustomer = await addCustomer(customerData); 
      customerData._id = savedCustomer?.data?._id;
    } else if (isWholesale && selectedCustomer) {
      customerData = {
        ...selectedCustomer,
        isWholesale: true , 
      };
    }
  
    const orderData = {
      date: formik.values.date,
      customer: customerData,
      products: products.map((product) => ({
        productId: product._id,
        productName: product.productnm,
        quantity: product.quantity
      })),
      tax: invoiceTaxes,
      subtotal: invoiceSubtotal,
      total: invoiceTotal
    };
    navigate('/dashboard/orders/add-order/create-invoice', { state: { orderData, products } });
  };
  
  return (
    <Container>
      <Link to="/dashboard/orders">
        <Button sx={{ marginTop: '5px' }} variant="contained" color="primary" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
      </Link>
      <form onSubmit={formik.handleSubmit}>
        <Typography marginTop={5} variant="h4" gutterBottom>
          New Order
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper style={{ padding: '10px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Date *</FormLabel>
                  <TextField
                    fullWidth
                    id="date"
                    name="date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>Customer Type *</FormLabel>
                  <FormControl>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox checked={isWalkIn} onChange={(e) => {
                        setIsWalkIn(e.target.checked);
                        setIsWholesale(false);
                      }} />}
                      label="Walk-in"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={isWholesale} onChange={(e) => {
                        setIsWholesale(e.target.checked);
                        setIsWalkIn(false);
                      }} disabled={isWalkIn} />}
                      label="Wholesale"
                    />
                     </FormGroup>
                  </FormControl>
                </Grid>

                {isWalkIn && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <FormLabel>Name *</FormLabel>
                      <TextField
                        fullWidth
                        id="customernm"
                        name="customernm"
                        value={walkInData.customernm}
                        onChange={(e) => setWalkInData({ ...walkInData, customernm: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormLabel>Phone *</FormLabel>
                      <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        value={walkInData.phone}
                        onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormLabel>Email *</FormLabel>
                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        value={walkInData.email}
                        onChange={(e) => setWalkInData({ ...walkInData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormLabel>Address *</FormLabel>
                      <TextField
                        fullWidth
                        id="address"
                        name="address"
                        value={walkInData.address}
                        onChange={(e) => setWalkInData({ ...walkInData, address: e.target.value })}
                      />
                    </Grid>
                  </>
                )}

                {isWholesale && (
                  <Grid item xs={12} sm={4}>
                    <FormLabel>Wholesale Customer</FormLabel>
                    <Select
                      value={formik.values.customernm}
                      onChange={handleCustomerChange}
                      error={formik.touched.customernm && Boolean(formik.errors.customernm)}
                      fullWidth
                    >
                      <MenuItem value="">Select a customer</MenuItem>
                      {customerList.map((customer) => (
                        <MenuItem key={customer._id} value={customer.customernm}>
                          {customer.customernm}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12} margin={2}>
                <TableContainer component={Paper} elevation={3} style={{ maxWidth: '800px' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#1976d2' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow key={product._id} hover sx={{ borderBottom: '1px solid #e0e0e0' }}>
                          <TableCell>{product.productnm}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                onClick={() => handleQuantityChange(index, product.quantity - 1)}
                                color="primary"
                                disabled={product.quantity <= 1}
                              >
                                <span>-</span>
                              </IconButton>
                              <TextField
                                type="number"
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                inputProps={{ min: 1 }}
                                size="small"
                                sx={{ width: '50px', textAlign: 'center' }}
                              />
                              <IconButton
                                onClick={() => handleQuantityChange(index, product.quantity + 1)}
                                color="primary"
                                disabled={product.quantity >= product.availableQuantity}
                              >
                                <span>+</span>
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>{product.sellingPrice.toFixed(2)}</TableCell>
                          <TableCell>{product.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleRemoveProduct(index)}
                              color="error"
                              sx={{
                                width: '40px',
                                height: '40px',
                                '&:hover': {
                                  backgroundColor: '#ae0703',
                                  color: '#ffffff'
                                }
                              }}
                            >
                              <IconTrash />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          Subtotal
                        </TableCell>
                        <TableCell align="right">{invoiceSubtotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          Tax
                        </TableCell>
                        <TableCell align="right">{invoiceTaxes.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', color: 'black' }}>
                          Total
                        </TableCell>
                        <TableCell align="right">{invoiceTotal.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color = "secondary"
                  onClick={handleCreateInvoice}
                >
                  Create Invoice
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper style={{ padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
              <Typography variant="h4" gutterBottom>
                Product List
              </Typography>
              <TableContainer component={Paper} elevation={3} style={{ maxWidth: '600px' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#1976d2' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unit</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productList.map((product) => (
                      <TableRow key={product._id} hover sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <TableCell>{product.productnm}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.unitName}</TableCell>
                        <TableCell>{product.sellingPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleSelectProduct(product)}
                            // onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                            color="primary"
                            sx={{
                              width: '40px',
                              height: '40px',
                              '&:hover': {
                                backgroundColor: '#206bc4',
                                color: '#ffffff'
                              }
                            }}
                          >
                            <IconShoppingCart />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default OrderForm;
