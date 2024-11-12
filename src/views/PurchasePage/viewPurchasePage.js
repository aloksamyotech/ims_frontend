import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import { useParams } from 'react-router';

const PurchasePage = () => {
  const { id } = useParams();
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/purchase/fetchById/${id}`);
        setPurchaseData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch purchase data');
      } finally {
        setLoading(false);
      }
    };

    loadPurchase();
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await axios.patch(`http://localhost:4200/purchase/approve/${id}`);

      if (response.status === 200) {
        setPurchaseData((prev) => ({ ...prev, status: response.data.status }));
        window.confirm('Purchase approved successfully!');
      } 
    } catch (error) {
      console.error('Error during approval:', error);
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
    supplierName,
    supplierPhone,
    supplierEmail,
    status,
    subtotal = 0,
    tax = 0,
    total = 0,
    purchase_no
  } = purchaseData || {};

  return (
    <Box sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Purchase Details
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4">
          <strong>Status:</strong>
        </Typography>
        <Box
          sx={{
            backgroundColor: status === 'Completed' ? '#4CAF50' : '#F44336', 
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: 1,
            marginLeft: 2 
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            {status || 'Pending'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ backgroundColor: '#2196F3', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Supplier Details
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Purchase No:</strong> {purchase_no}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Date:</strong> {moment(date).format('DD-MM-YYYY')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {supplierName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {supplierPhone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {supplierEmail}
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
                  <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>Tax:</strong> ${tax.toFixed(2)}
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
        {status !== 'Completed' && (
          <Button variant="contained" color="secondary" onClick={handleApprove}>
            Approve Purchase
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PurchasePage;
