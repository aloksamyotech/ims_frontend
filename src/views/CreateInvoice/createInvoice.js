import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addOrder } from 'apis/api.js';

const CreateInvoice = () => {
  const location = useLocation();
  const { orderData, products } = location.state || {};
  const customer = orderData.customer;
  console.log('customer',customer)

  const [loading, setLoading] = useState(false); 

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const invoiceData = {
        date: orderData.date,
        customerId: customer._id,  
        customerName: customer.customernm,
        products: products.map(product => ({
          productId: product._id,
          productName: product.productnm,
          quantity: product.quantity,
        })),
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total: orderData.total,
      };
  
      const response = await addOrder(invoiceData);
      console.log(response);
      if (response) {
        toast.success('Invoice saved successfully! A confirmation email has been sent.');
        console.log('Invoice saved successfully!');
      } else {
        toast.error('Error saving invoice');
        console.error('Failed to save the invoice:', response);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('An error occurred while saving the invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid container spacing={2} sx={{ marginBottom: 3, marginLeft: 35, paddingTop: 10 }}>
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold">
              Invoice Details
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: 3, marginLeft: 5 }}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Invoice date: {orderData?.date}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginBottom: 3, marginLeft: 5 }}>
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
          <TableContainer component={Paper}>
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

        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 3 }}>
          <Link to="/dashboard/orders/add-order">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#f1c40f',
                marginRight: 2,
                '&:hover': { backgroundColor: '#f39c12' },
              }}
            >
              Back to previous
            </Button>
          </Link>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'} 
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateInvoice;
