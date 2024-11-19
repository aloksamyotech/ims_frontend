import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Card, CardContent, Button, Divider } from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
        </Typography>{' '}
        &nbsp;&nbsp;
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
              <Box sx={{ borderRadius: 1, marginBottom: 1 }}>
                <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
                  Customer Details
                </Typography>
              </Box>
              <Divider sx={{ marginY: 2, borderColor: 'gray', borderWidth: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Invoice No:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{invoice_no}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Date:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{moment(date).format('DD-MM-YYYY')}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Name:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerName}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Phone:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerPhone}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Email:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerEmail}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Address:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerAddress}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ borderRadius: 1, marginBottom: 1 }}>
                <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
                  Product Details
                </Typography>
              </Box>
              <Divider sx={{ marginY: 2, borderColor: 'gray', borderWidth: 1 }} />
              {products.map((product, index) => {
                const subtotalProduct = product.quantity * product.price;
                return (
                  <Box
                    key={product.id || index}
                    sx={{
                      marginBottom: 2,
                      borderBottom: '1px solid #e0e0e0',
                      paddingBottom: 1
                    }}
                  >
                    <Typography variant="h5">
                      <strong>
                        {index + 1}. {product.productName}
                      </strong>
                    </Typography>

                    <Grid container spacing={1} sx={{ marginTop: 1 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            <strong>Quantity:</strong>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">{product.quantity}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            <strong>Price:</strong>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            <strong>Subtotal:</strong>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">${subtotalProduct.toFixed(2)}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}

              <Box sx={{ marginTop: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Subtotal:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1"> ${subtotal.toFixed(2)}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Tax:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">${tax.toFixed(2)}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Total:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        {' '}
                        <strong>${total.toFixed(2)}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                  <Link to={`/dashboard/orders/download-invoice/${id}`}>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        fontSize : '18px',
                        fontWeight: 'bold',
                        textDecoration: 'underline', 
                        cursor: 'pointer'
                      }}
                    >
                      View Invoice
                    </Typography>
                  </Link>
                </Box>
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
