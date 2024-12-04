import React, { useState } from 'react';
import {
  Container,
  Card,
  Grid,
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addOrder } from 'apis/api.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const CreateInvoice = () => {
  const location = useLocation();
  const { orderData, products } = location.state || {};
  const customer = orderData.customer;

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const invoiceData = {
        date: orderData.date,
        customerId: customer._id,
        customerName: customer.customernm,
        products: products.map((product) => ({
          productId: product._id,
          productName: product.productnm,
          quantity: product.quantity
        })),
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total: orderData.total
      };

      const response = await addOrder(invoiceData);
      if (response) {
        toast.success('Invoice saved successfully! A confirmation email has been sent.');
        setIsSubmitted(true);
      } else {
        toast.error('Error saving invoice');
      }
    } catch (error) {
      toast.error('An error occurred while saving the invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
       <Box
          sx={{
            marginTop: '20px',
            backgroundColor: '#ffff',
            padding: '14px',
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h4">Invoice Details</Typography>

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
          <MuiLink component={Link} to="/dashboard/orders/add-order" color="inherit">
            <Typography color="text.primary">Add Orders</Typography>
          </MuiLink>
            <Typography color="text.primary">CreateInvoice</Typography>
          </Breadcrumbs>
        </Box>

      <Card sx={{marginTop:'20px'}}>
        <Grid container spacing={2} sx={{ marginBottom: 3, marginLeft: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold" sx={{paddingTop:'8px'}}>
              Invoice date: {orderData?.date}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginBottom: 1, marginLeft: 2 }}>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight="bold">
              Customer
            </Typography>
            <Typography>{customer?.customernm}</Typography>
            <Typography>Email: {customer?.email}</Typography>
            <Typography>Phone: {customer?.phone}</Typography>
            <Typography>Address: {customer?.address}</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{padding:'20px'}}>
            <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product?.productnm}</TableCell>
                    <TableCell>{product?.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell>{product?.quantity}</TableCell>
                    <TableCell>{product?.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    Subtotal
                  </TableCell>
                  <TableCell>{orderData?.subtotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    Tax (7%)
                  </TableCell>
                  <TableCell>{orderData?.tax.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{orderData?.total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Card>

      <Grid item xs={12} sx={{ textAlign: 'left', marginTop: 3 }}>
          <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={loading || isSubmitted}>
            {isSubmitted ? 'Submitted' : loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Grid>
    </Container>
  );
};

export default CreateInvoice;
