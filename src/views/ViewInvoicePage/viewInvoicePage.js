import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import { useParams } from 'react-router';

const InvoicePage = () => {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/order/fetchById/${id}`);
        setInvoiceData(response.data);
      } catch (error) {
        setError('Failed to fetch invoice data');
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [id]);

    const handleApprove = async () => {
      try {
        const response = await axios.patch(`http://localhost:4200/order/approve/${id}`);

        if (response.status === 200) {
          setInvoiceData((prev) => ({
            ...prev,
            order_status: 'Completed'
          }));
          window.alert('Order approved successfully!');
        }
      } catch (error) {
        console.error('Error during approval:', error);
        window.alert('Failed to approve purchase');
      }
    };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  const {
    products = [],
    date,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    order_status,
    subtotal = 0,
    tax = 0,
    total = 0,
    invoice_no
  } = invoiceData || {};

  return (
    <Box sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Order Details
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4">
          <strong>Status:</strong>
        </Typography> &nbsp;&nbsp;
        <Box
          sx={{
            backgroundColor: order_status === 'Completed' ? '#34a853' : order_status === 'Pending' ? '#f44336' : '',
              color: order_status === 'Completed' ? 'white' : 'white',
            padding: '0.3rem 1rem',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            width: 'fit-content',
            textTransform: 'uppercase',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            gap: '0.5rem',
            fontSize: '12px'
          }}
        >
          {order_status || 'Pending'}
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ backgroundColor: '#2196F3', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Customer Details
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Invoice No:</strong> {invoice_no}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Date:</strong> {moment(date).format('DD-MM-YYYY')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {customerName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {customerPhone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {customerEmail}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Address:</strong> {customerAddress}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ backgroundColor: '#2196F3', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Product Details
                </Typography>
              </Box>
              {products.map((product, index) => {
                const subtotalProduct = product.quantity * product.price;
                return (
                  <Box key={product.id || index} sx={{ marginBottom: 2, borderBottom: '1px solid #e0e0e0', paddingBottom: 1 }}>
                    <Typography variant="h5">
                      <strong>
                        {index + 1}. {product.productName}
                      </strong>
                    </Typography>
                    <Typography>Quantity: {product.quantity}</Typography>
                    <Typography>Price: ${product.price.toFixed(2)}</Typography>
                    <Typography>Subtotal: ${subtotalProduct.toFixed(2)}</Typography>
                  </Box>
                );
              })}
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1">
                  <strong> Subtotal:</strong> ${subtotal.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong> Tax:</strong> ${tax.toFixed(2)}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  <strong>Total:</strong> ${total.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {order_status !== 'Completed' && (
          <Button variant="contained" color="secondary" onClick={handleApprove}>
            Approve Order
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default InvoicePage;
