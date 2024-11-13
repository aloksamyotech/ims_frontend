import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  Button,
  Card,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchProducts } from 'apis/api.js';
import { AccessTime } from '@mui/icons-material';
import moment from 'moment';

const ViewProduct = ({ open, handleClose, product }) => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (product) {
        try {
          const response = await fetchProducts(product);
          setProductData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          setLoading(false);
        }
      }
    };

    loadProduct();
  }, [product]);

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle variant="h3" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Product Details
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Card variant="outlined" sx={{ padding: 2 }}>
        <Box mb={2}>
          <Typography variant="h4">Product Name: {product.productnm}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Category: {product.categoryName}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Unit: {product.unitName}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Buying Price: Rs. {product.buyingPrice}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Selling Price: Rs. {product.sellingPrice}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Quantity: {product.quantity}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Tax: {product.tax}%</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Margin: {product.margin}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">Notes: {product.notes || 'No notes available'}</Typography>
        </Box>
        <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ marginRight: 1 }} />
            <Typography variant="body2">Created At: {moment(product.createdAt).format('DD-MM-YYYY')}</Typography>
          </Box>
      </Card>
    </Dialog>
  );
};

export default ViewProduct;
