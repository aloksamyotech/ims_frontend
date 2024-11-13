import React, { useEffect, useState } from 'react';
import { Typography,
    Box,
    Grid,
    Card,
    CardContent,} from '@mui/material';
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

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  const {
    products = [],
    date,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    subtotal = 0,
    tax = 0,
    total = 0,
    invoice_no
  } = invoiceData || {};

  return (
    <Box sx={{ padding: 2, marginTop: 4 }}>
    <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>Order Details</Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box sx={{ backgroundColor: '#2196F3', padding: 2, borderRadius: 1, marginBottom: 2 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>Customer Details</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Invoice No:</strong> {invoice_no}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Date:</strong> {moment(date).format('DD-MM-YYYY')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Name:</strong> {customerName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Phone:</strong> {customerPhone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Email:</strong> {customerEmail}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Address:</strong> {customerAddress}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>


      <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
            <Box sx={{ backgroundColor: '#2196F3', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>Product Details</Typography>
              </Box>
              {products.map((product, index) => {
                const subtotalProduct = product.quantity * product.price;
                return (
                  <Box key={product.id || index} sx={{ marginBottom: 2, borderBottom: '1px solid #e0e0e0', paddingBottom: 1 }}>
                    <Typography variant="h5"><strong>{index + 1}. {product.productName}</strong></Typography>
                    <Typography>Quantity: {product.quantity}</Typography>
                    <Typography>Price: ${product.price.toFixed(2)}</Typography>
                    <Typography>Subtotal: ${subtotalProduct.toFixed(2)}</Typography>
                  </Box>
                );
              })}
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1"><strong> Subtotal:</strong> ${subtotal.toFixed(2)}</Typography>
                <Typography variant="body1"><strong> Tax:</strong> ${tax.toFixed(2)}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}><strong>Total:</strong> ${total.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoicePage;
