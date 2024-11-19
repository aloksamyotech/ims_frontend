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
  InputAdornment,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconTrash, IconShoppingCart, IconSearch } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCustomers, addCustomer } from 'apis/api.js';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const TAX_RATE = 0.07;

const OrderForm = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [isWholesale, setIsWholesale] = useState(false);
  const [walkInData, setWalkInData] = useState({
    customernm: '',
    phone: '',
    email: '',
    address: ''
  });
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const validationSchema = yup.object({
    date: yup.date().required('Date is required'),
    customernm: yup.string().required('Customer is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
      .required('Phone number is required'),
    address: yup.string().max(50, 'Max 50 characters are allowed').required('Address is required'),
    quantity: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    tax: yup.number().min(5, 'Min 5% is allowed').max(12, 'Max 12% is allowed').required('Tax is required')
  });

  const formik = useFormik({
    initialValues: {
      date: formattedDate,
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

  const filteredProducts = productList.filter((product) => product.productnm.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectProduct = (product) => {
    const selectedQuantity = quantity[product._id] || 1;

    if (product.quantity <= 0) {
      toast.error("This product is out of stock.");
      return; 
    }

    if (selectedQuantity > product.quantity) {
      return;
    }
  
    const productInCart = products.find((item) => item._id === product._id);
    if (productInCart) {
      toast.info('Product is already added to the cart');
      return;
    }

    setProducts((prevProducts) => [
      ...prevProducts,
      {
        ...product,
        quantity: selectedQuantity,
        subtotal: selectedQuantity * product.sellingPrice
      }
    ]);
  
    const isAlreadySelected = selectedProductIds.includes(product._id);
    if (isAlreadySelected) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== product._id));
    } else {
      setSelectedProductIds([...selectedProductIds, product._id]);
    }
    setQuantity((prev) => ({
      ...prev,
      [product._id]: 1
    }));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find((prod) => prod._id === productId);
    
    if (!product) {
      console.error('Product not found');
      return;
    }

    const availableStock = productList.find((prod) => prod._id === productId)?.quantity;
    if (newQuantity < 1) return; 
    if (newQuantity > availableStock) {
      toast.info(`Quantity exceeds available stock (: ${availableStock})`);
      return;
    }
    const updatedProducts = products.map((item) =>
      item._id === productId
        ? {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.sellingPrice
          }
        : item
    );
    setProducts(updatedProducts);
    setQuantity((prev) => ({
      ...prev,
      [productId]: newQuantity
    }));
  };
  
  const handleRemoveProduct = (productId) => {
    const updatedProducts = products.filter((product) => product._id !== productId);
    window.confirm('Are you sure you want to delete?');
    setProducts(updatedProducts);
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
    setSelectedCustomer(customer);
    formik.setFieldValue('customernm', customerName);
  };

  const handleCreateInvoice = async () => {

    if (!isWalkIn && !isWholesale && !selectedCustomer) {
      toast.error("Please select a customer before creating the invoice.");
      return; 
    }

    let customerData = {};
    if (isWalkIn) {
      customerData = {
        customernm: walkInData.customernm,
        email: walkInData.email,
        phone: walkInData.phone,
        address: walkInData.address,
        isWholesale: false
      };

      const savedCustomer = await addCustomer(customerData);
      customerData._id = savedCustomer?.data?._id;
    } else if (isWholesale && selectedCustomer) {
      customerData = {
        ...selectedCustomer,
        isWholesale: true
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
        </Button>
      </Link>
      <form onSubmit={formik.handleSubmit}>
        <Typography marginTop={5} variant="h3" gutterBottom>
          Add Order
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: '8px' }}>
          <Grid item xs={12}>
            <Paper style={{ padding: '10px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
              <Grid container spacing={3} sx={{ margin: '1px' }}>
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
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <FormGroup row>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isWalkIn}
                              onChange={(e) => {
                                setIsWalkIn(e.target.checked);
                                setIsWholesale(false);
                              }}
                            />
                          }
                          label="Walk-in"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isWholesale}
                              onChange={(e) => {
                                setIsWholesale(e.target.checked);
                                setIsWalkIn(false);
                              }}
                              disabled={isWalkIn}
                            />
                          }
                          label="Wholesale"
                        />
                      </Box>
                    </FormGroup>
                  </FormControl>
                </Grid>
                {isWalkIn && (
                  <>
                    <Grid item xs={12} sm={5}>
                      <FormLabel>Name *</FormLabel>
                      <TextField
                        fullWidth
                        id="customernm"
                        name="customernm"
                        value={walkInData.customernm}
                        onChange={(e) => setWalkInData({ ...walkInData, customernm: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <FormLabel>Phone *</FormLabel>
                      <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        value={walkInData.phone}
                        onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <FormLabel>Email *</FormLabel>
                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        value={walkInData.email}
                        onChange={(e) => setWalkInData({ ...walkInData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
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
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Wholesale Customer</FormLabel>
                    <Select
                      value={formik.values.customernm}
                      onChange={handleCustomerChange}
                      error={formik.touched.customernm && Boolean(formik.errors.customernm)}
                      fullWidth
                    >
                      <MenuItem value="">Select a customer</MenuItem>
                      {customerList
                        .filter((customer) => customer.isWholesale === true)
                        .map((customer) => (
                          <MenuItem key={customer._id} value={customer.customernm}>
                            {customer.customernm}
                          </MenuItem>
                        ))}
                    </Select>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12} margin={2}>
                <TableContainer component={Paper} elevation={3} style={{ maxWidth: '1000px' }}>
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
                      {products.map((product) => (
                        <TableRow key={product._id} hover sx={{ borderBottom: '1px solid #e0e0e0' }}>
                          <TableCell>{product.productnm}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TextField
                                type="number"
                                value={quantity[product._id] || 1}
                                onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                inputProps={{ min: 1 }}
                                size="large"
                                sx={{ width: '80px', textAlign: 'center' }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>{product.sellingPrice.toFixed(2)}</TableCell>
                          <TableCell>{product.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleRemoveProduct(product._id)}
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
                        <TableCell align="center">{invoiceSubtotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          Tax
                        </TableCell>
                        <TableCell align="center">{invoiceTaxes.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', color: 'black' }}>
                          Total
                        </TableCell>
                        <TableCell align="center">{invoiceTotal.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, marginRight: '12px' }}>
                <Button variant="contained" color="secondary" onClick={handleCreateInvoice}>
                  Create Invoice
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper style={{ padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
              <Box
                sx={{
                  marginTop: '10px',
                  marginRight: '10px',
                  marginLeft: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Product List
                </Typography>

                <TextField
                  label="Search Products"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch />
                      </InputAdornment>
                    )
                  }}
                  sx={{ maxWidth: '350px' }}
                />
              </Box>

              <TableContainer
                component={Paper}
                elevation={3}
                sx={{ marginLeft: '8px', alignContent: 'center' }}
                style={{ maxWidth: '975px' }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: '#1976d2' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Available Quantity</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unit</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product._id}
                        hover
                        sx={{
                          borderBottom: '1px solid #e0e0e0',
                          backgroundColor: selectedProductIds.includes(product._id) ? '#e3f2fd' : 'transparent',  // Highlight selected rows
                          '&:hover': {
                            backgroundColor: selectedProductIds.includes(product._id) ? '#c1e1fc' : 'transparent'
                          }
                        }}
                      >
                        <TableCell>{product.productnm}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.unitName}</TableCell>
                        <TableCell>{product.sellingPrice.toFixed(2)}</TableCell>
                        <TableCell>
                              <Button
                                onClick={() => handleSelectProduct(product)}
                                variant="contained"
                                color="primary"
                                startIcon={<IconShoppingCart />}
                              >
                                Add
                              </Button>
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
      <ToastContainer />
    </Container>
  );
};

export default OrderForm;
