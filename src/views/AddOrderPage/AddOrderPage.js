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
  Autocomplete,
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
  IconButton,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { IconTrash, IconShoppingCart, IconSearch } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCustomers, addCustomer } from 'apis/api.js';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ConfirmDialog from 'confirmDeletion/deletion';

const OrderForm = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [discounts, setDiscounts] = useState({});
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
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const validationSchema = yup.object({
    date: yup.date().required('Date is required'),
    customernm: yup.string().required('Customer is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 12 digits and cannot start with 0')
      .required('Phone number is required'),
    address: yup.string().max(50, 'Max 50 characters are allowed'),
    quantity: yup.number().min(1, 'Quantity must be at least 1')
  });

  const formik = useFormik({
    initialValues: {
      date: formattedDate,
      customernm: '',
      phone: '',
      email: '',
      address: '',
      discount: 0,
      quantity: 1,
      productnm: '',
      sellingPrice: 0
    },
    validationSchema
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId();
      try {
        const productResult = await fetchProducts();
        const filteredProducts = productResult?.data.filter((product) => product.userId === userId);
        setProductList(filteredProducts);
        const customerResult = await fetchCustomers();
        const filteredCustomers = customerResult?.data.filter((customer) => customer.userId === userId);
        setCustomerList(filteredCustomers);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const filteredProducts = productList?.filter((product) => product?.productnm.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectProduct = (product) => {
    const selectedQuantity = quantity[product._id] || 1;

    if (product.quantity <= 0) {
      toast.error('This product is out of stock.');
      return;
    }

    if (selectedQuantity > product.quantity) {
      return;
    }

    const productInCart = products?.find((item) => item._id === product._id);
    if (productInCart) {
      toast.info('Product is already added to the cart');
      return;
    }

    setProducts((prevProducts) => [
      ...prevProducts,
      {
        ...product,
        quantity: selectedQuantity,
        subtotal: selectedQuantity * product.sellingPrice,
        tax: product.tax
      }
    ]);

    const isAlreadySelected = selectedProductIds.includes(product._id);
    if (isAlreadySelected) {
      setSelectedProductIds(selectedProductIds?.filter((id) => id !== product._id));
    } else {
      setSelectedProductIds([...selectedProductIds, product._id]);
    }
    setQuantity((prev) => ({
      ...prev,
      [product._id]: 1
    }));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products?.find((prod) => prod._id === productId);

    if (!product) {
      console.error('Product not found');
      return;
    }

    const availableStock = productList?.find((prod) => prod._id === productId)?.quantity;
    if (newQuantity < 1) return;
    if (newQuantity > availableStock) {
      toast.info(`Quantity exceeds available stock (: ${availableStock})`);
      return;
    }
    const updatedProducts = products?.map((item) =>
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

  const handleOpenDialog = (productId) => {
    setSelectedId(productId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    try {
      const updatedProducts = products?.filter((product) => product?._id !== selectedId);
      setProducts(updatedProducts);
      toast.success('Deleted successfully!');
    } catch (error) {
      console.error('Error deleting subscription:', error);
    } finally {
      handleCloseDialog();
    }
  };

  const handleDiscountChange = (productId, value) => {
    const maxDiscount = products.find((product) => product._id === productId).subtotal;
    const discountValue = Math.max(0, Math.min(value, maxDiscount));
    setDiscounts((prev) => ({ ...prev, [productId]: discountValue }));
  };

  const calculateSubtotal = () => {
    return products.reduce((acc, product) => {
      const discount = discounts[product._id] || 0;
      const discountedSubtotal = product.subtotal - discount;
      return acc + discountedSubtotal;
    }, 0);
  };

  const calculateTaxes = () => {
    return products.reduce((totalTax, product) => {
      const discount = discounts[product._id] || 0;
      const discountedSubtotal = product.subtotal - discount;
      const productTax = discountedSubtotal * (product.tax / 100);
      return totalTax + productTax;
    }, 0);
  };

  const invoiceTaxes = calculateTaxes();
  const invoiceSubtotal = calculateSubtotal();
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  const handleCustomerChange = (event, newValue) => {
    const customerName = newValue ? newValue.customernm : '';
    const customer = customerList?.find((c) => c.customernm === customerName);

    setSelectedCustomer(customer);
    formik.setFieldValue('customernm', customerName);
  };

  const isCreateInvoiceDisabled =
    products.length === 0 || (isWholesale && !selectedCustomer) || (isWalkIn && (!walkInData.phone || walkInData.phone.trim() === ''));

  const handleCreateInvoice = async () => {
    if (!isWalkIn && !isWholesale && !selectedCustomer && !products) {
      toast.error('Please select a customer before creating the invoice.');
      return;
    }

    let customerData = {};
    if (isWalkIn) {
      customerData = {
        customernm: walkInData.customernm || 'N/A',
        email: walkInData.email,
        phone: walkInData.phone,
        address: walkInData.address || 'N/A',
        isWholesale: false,
        userId: getUserId()
      };

      try {
        const savedCustomer = await addCustomer(customerData);
        if (savedCustomer && savedCustomer.data) {
          customerData._id = savedCustomer.data._id;
          toast.success('Walk-in customer is created');
        } else {
          toast.error('Failed to create walk-in customer');
          return;
        }
      } catch (error) {
        toast.error('Error creating walk-in customer');
        return;
      }
    } else if (isWholesale && selectedCustomer) {
      customerData = {
        ...selectedCustomer,
        isWholesale: true
      };
    }

    const orderData = {
      date: formik.values.date,
      customer: customerData,
      products: products?.map((product) => ({
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
    <>
      <ConfirmDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleDelete} />
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
          <Typography variant="h4">Add Order</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <MuiLink component={Link} to="/dashboard/orders" color="inherit">
              <Typography color="text.primary">Orders</Typography>
            </MuiLink>
            <Typography color="text.primary">AddOrder</Typography>
          </Breadcrumbs>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ marginTop: '4px' }}>
            <Grid item xs={12}>
              <Paper style={{ padding: '5px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
                <Grid container spacing={2} sx={{ padding: '10px' }}>
                  <Grid item xs={4}>
                    <FormLabel>Date *</FormLabel>
                    <TextField
                      fullWidth
                      id="date"
                      name="date"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      error={formik.touched.date && Boolean(formik.errors.date)}
                      helperText={formik.touched.date && formik.errors.date}
                    />
                  </Grid>
                  <Grid item xs={4}>
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
                      <Grid item xs={4}>
                        <FormLabel>Name</FormLabel>
                        <TextField
                          fullWidth
                          id="customernm"
                          name="customernm"
                          size="small"
                          value={walkInData.customernm}
                          onChange={(e) => setWalkInData({ ...walkInData, customernm: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormLabel>Phone *</FormLabel>
                        <TextField
                          fullWidth
                          id="phone"
                          name="phone"
                          size="small"
                          value={walkInData.phone}
                          onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormLabel>Email *</FormLabel>
                        <TextField
                          fullWidth
                          id="email"
                          name="email"
                          size="small"
                          value={walkInData.email}
                          onChange={(e) => setWalkInData({ ...walkInData, email: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormLabel>Address</FormLabel>
                        <TextField
                          fullWidth
                          id="address"
                          name="address"
                          size="small"
                          value={walkInData.address}
                          onChange={(e) => setWalkInData({ ...walkInData, address: e.target.value })}
                        />
                      </Grid>
                    </>
                  )}

                  {isWholesale && (
                    <Grid item xs={4}>
                      <FormLabel>Wholesale Customer</FormLabel>
                      <Autocomplete
                        options={customerList.filter((customer) => customer.isWholesale)}
                        getOptionLabel={(option) => option.customernm}
                        value={customerList.find((cust) => cust.customernm === formik.values.customernm) || null}
                        onChange={handleCustomerChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            variant="outlined"
                            fullWidth
                            error={formik.touched.customernm && Boolean(formik.errors.customernm)}
                            helperText={formik.touched.customernm && formik.errors.customernm}
                            sx={{
                              '& .MuiInputBase-root': { height: 40 }
                            }}
                          />
                        )}
                        ListboxProps={{
                          style: {
                            maxHeight: 200,
                            overflow: 'auto'
                          }
                        }}
                      />
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={12} margin={1}>
                  <TableContainer component={Paper} elevation={1} style={{ maxWidth: '1000px' }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#1976d2' }}>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Discount</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price/unit</TableCell>
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
                                  value={quantity[product._id]}
                                  onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                  inputProps={{ min: 1 }}
                                  size="small"
                                  sx={{ width: '80px', textAlign: 'center' }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={discounts[product._id] || ''}
                                onChange={(e) => handleDiscountChange(product._id, parseFloat(e.target.value))}
                                inputProps={{
                                  min: 0,
                                  max: product.subtotal
                                }}
                                size="small"
                                sx={{ width: '80px', textAlign: 'center' }}
                              />
                            </TableCell>
                            <TableCell>
                              {currencySymbol} {product.sellingPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {currencySymbol} {(product.subtotal - (discounts[product._id] || 0)).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleOpenDialog(product._id)}
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
                          <TableCell colSpan={5} align="right">
                            Subtotal
                          </TableCell>
                          <TableCell align="center">
                            {currencySymbol} {invoiceSubtotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right">
                            Tax
                          </TableCell>
                          <TableCell align="center">
                            {' '}
                            {currencySymbol} {invoiceTaxes.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', color: 'black' }}>
                            Total
                          </TableCell>
                          <TableCell align="center">
                            {currencySymbol} {invoiceTotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, marginRight: '12px' }}>
                  <Button variant="contained" color="secondary" onClick={handleCreateInvoice} disabled={isCreateInvoiceDisabled}>
                    Create Invoice
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper style={{ padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
                <Box
                  sx={{
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
                    size="small"
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

                <TableContainer component={Paper} elevation={3} sx={{ maxHeight: '400px', overflow: 'auto', alignContent: 'center' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#1976d2' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Available Quantity</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price/unit</TableCell>
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
                            backgroundColor: selectedProductIds.includes(product._id) ? '#e3f2fd' : 'transparent',
                            '&:hover': {
                              backgroundColor: selectedProductIds.includes(product._id) ? '#c1e1fc' : 'transparent'
                            }
                          }}
                        >
                          <TableCell>{product.productnm}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {currencySymbol} {product.sellingPrice.toFixed(2)}
                          </TableCell>
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
      </Grid>
    </>
  );
};

export default OrderForm;
