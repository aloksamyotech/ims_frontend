import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Paper, TextField, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { getUserId } from 'apis/constant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const SoldQuantityDisplay = () => {
  const [soldQuantity, setSoldQuantity] = useState(null);
  const [soldSales, setSoldSales] = useState(null);
  const [orderCount , setOrdersCount] = useState(null);
  const [purchaseCount , setPurchasesCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState(null);

  const handleApplyClick = async () => {
    if (fromDate && toDate) {
      setLoading(true);
      setError(null);

      try {
        const userId = getUserId();

        const formattedFromDate = fromDate.toISOString();
        const formattedToDate = toDate.toISOString();

        const response = await axios.get('http://localhost:4200/order/sold-quantity-date', {
          params: {
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            userId
          }
        });
        if (response.data.success) {
          setSoldQuantity(response.data.data);
        } else {
          setSoldQuantity(0);
        }

        const result = await axios.get('http://localhost:4200/order/sold-sales-date', {
          params: {
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            userId
          }
        });
        if (result.data.success) {
          setSoldSales(result.data.data);
        } else {
          setSoldSales(0);
        }

        const countOrder = await axios.get('http://localhost:4200/order/count', {
            params: {
              fromDate: formattedFromDate,
              toDate: formattedToDate,
              userId
            }
          });
          console.log(countOrder.data.count);
          if (countOrder.data.success) {
            setOrdersCount(countOrder.data.count);
          } else {
            setOrdersCount(0);
          }

          const countPurchase = await axios.get('http://localhost:4200/purchase/count', {
            params: {
              fromDate: formattedFromDate,
              toDate: formattedToDate,
              userId
            }
          });
          if (countPurchase.data.success) {
            setPurchasesCount(countPurchase.data.count);
          } else {
            setPurchasesCount(0);
          }
      } catch (err) {
        setError('Error fetching sold data');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please select both from and to dates');
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">From Date</Typography>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select From Date"
            isClearable
            maxDate={toDate}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">To Date</Typography>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select To Date"
            isClearable
            minDate={fromDate}
          />
        </Grid>

        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleApplyClick} fullWidth>
            Apply
          </Button>
        </Grid>
      </Grid>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 3 }} />}

      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Box sx={{ padding: '5px', mt: 3 }}>
        <Grid container spacing={2}>
          {soldQuantity !== null && !loading && !error && (
            <Grid item xs={12} sm={6} md={6}>
              <Paper sx={{ p: 2, textAlign: 'center', boxShadow: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUpIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <div>
                  <Typography variant="h6">Total Sold Quantity</Typography>
                  <Typography variant="h4">{soldQuantity}</Typography>
                </div>
              </Paper>
            </Grid>
          )}

          {soldSales !== null && !loading && !error && (
            <Grid item xs={12} sm={6} md={6}>
              <Paper sx={{ p: 2, textAlign: 'center', boxShadow: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCartIcon sx={{ mr: 2, fontSize: 40, color: 'secondary.main' }} />
                <div>
                  <Typography variant="h6">Sold Amount</Typography>
                  <Typography variant="h4">{soldSales}</Typography>
                </div>
              </Paper>
            </Grid>
          )}

          {orderCount !== null && !loading && !error && (
            <Grid item xs={12} sm={6} md={6}>
              <Paper sx={{ p: 2, textAlign: 'center', boxShadow: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCartIcon sx={{ mr: 2, fontSize: 40, color: 'secondary.main' }} />
                <div>
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography variant="h4">{orderCount}</Typography>
                </div>
              </Paper>
            </Grid>
          )}

{purchaseCount !== null && !loading && !error && (
            <Grid item xs={12} sm={6} md={6}>
              <Paper sx={{ p: 2, textAlign: 'center', boxShadow: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCartIcon sx={{ mr: 2, fontSize: 40, color: 'secondary.main' }} />
                <div>
                  <Typography variant="h6">Total Purchases</Typography>
                  <Typography variant="h4">{purchaseCount}</Typography>
                </div>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default SoldQuantityDisplay;
