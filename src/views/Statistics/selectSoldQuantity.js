import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid, Paper, Divider, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getUserId } from 'apis/constant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useTheme, styled } from '@mui/material/styles';
import { fetchCurrencySymbol } from 'apis/constant.js';
import { countOrders, countPurchases, soldQuantityByDate, soldSalesByDate, getTopSellingCatgeory } from 'apis/api.js';

const CategoryBox = styled(Box)(({ theme, borderColor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: 10,
  backgroundColor: '#fff',
  height: '100%',
  textAlign: 'center',
  color: theme.palette.text.primary,
  border: `2px solid ${borderColor || theme.palette.primary.main}`
}));

const SoldQuantityDisplay = () => {
  const [soldQuantity, setSoldQuantity] = useState(null);
  const [soldSales, setSoldSales] = useState(null);
  const [orderCount, setOrdersCount] = useState(null);
  const [purchaseCount, setPurchasesCount] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const handleApplyClick = async () => {
    if (fromDate && toDate) {
      setLoading(true);
      setError(null);
  
      try {
        const userId = getUserId();

        const formattedFromDate = new Date(fromDate.setHours(0, 0, 0, 0)).toISOString();
        const formattedToDate = new Date(toDate.setHours(23, 59, 59, 999)).toISOString();
  
        const response = await soldQuantityByDate({
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          userId
        });
        if (response?.data?.success) {
          setSoldQuantity(response.data.data || 0);
        } else {
          setSoldQuantity(0);
        }
  
        const result = await soldSalesByDate({
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          userId
        });
        if (result?.data?.success) {
          setSoldSales(result.data.data || 0);
        } else {
          setSoldSales(0);
        }
  
        const countOrder = await countOrders({
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          userId
        });
        if (countOrder?.data?.success) {
          setOrdersCount(countOrder.data.count || 0);
        } else {
          setOrdersCount(0);
        }
  
        const countPurchase = await countPurchases({
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          userId
        });
        if (countPurchase?.data?.success) {
          setPurchasesCount(countPurchase.data.count || 0);
        } else {
          setPurchasesCount(0);
        }
  
        const topCategory = await getTopSellingCatgeory({
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          userId
        });
        if (topCategory?.data?.data) {
          setTopCategories(topCategory.data.data || []);
        } else {
          setTopCategories([]);
        }
      } catch (err) {
        setError('No sold data');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please select both from and to dates');
    }
  };
  
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          padding: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
            border: '1px solid #673ab7',
            borderRadius: 2,
            padding: '4px 8px'
          }}
        >
          <CalendarMonthIcon sx={{ color: '#673ab7' }} />
          <Box sx={{ flexShrink: 0 }}>
            <span>From Date</span>
          </Box>

          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select Date"
              isClearable
              maxDate={toDate}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '280px',
            border: '1px solid #673ab7',
            borderRadius: 2,
            padding: '4px 8px'
          }}
        >
          <CalendarMonthIcon sx={{ color: '#673ab7' }} />
          <Box sx={{ flexShrink: 0 }}>
            <span>To Date</span>
          </Box>

          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select Date"
              isClearable
              minDate={fromDate}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyClick}
          sx={{
            px: 2,
            py: 0.7,
            fontWeight: 600,
            borderRadius: 2,
            width: '100%',
            maxWidth: '250px'
          }}
        >
          Apply Filter
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 1 }} />}

      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 2.5 }}>
        <Grid container spacing={2}>
          {soldQuantity !== null && !loading && !error && (
            <Grid item xs={6} sm={3} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center',boxShadow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Inventory2Icon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <div>
                  <Typography variant="h6">Sold Quantity</Typography>
                  <Typography variant="h4">{soldQuantity}</Typography>
                </div>
              </Paper>
            </Grid>
          )}

          {soldSales !== null && !loading && !error && (
            <Grid item xs={6} sm={3} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', boxShadow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUpIcon sx={{ mr: 2, fontSize: 40, color: 'secondary.main' }} />
                <div>
                  <Typography variant="h6">Sales Amount</Typography>
                  <Typography variant="h4">
                    {currencySymbol} {soldSales}
                  </Typography>
                </div>
              </Paper>
            </Grid>
          )}

          {orderCount !== null && !loading && !error && (
            <Grid item xs={6} sm={3} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center',boxShadow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCartIcon sx={{ mr: 2, fontSize: 40, color: '#4caf50' }} />
                <div>
                  <Typography variant="h6">Orders</Typography>
                  <Typography variant="h4">{orderCount}</Typography>
                </div>
              </Paper>
            </Grid>
          )}

          {purchaseCount !== null && !loading && !error && (
            <Grid item xs={6} sm={3} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center',boxShadow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StoreIcon sx={{ mr: 2, fontSize: 40, color: '#ffa726' }} />
                <div>
                  <Typography variant="h6">Purchases </Typography>
                  <Typography variant="h4">{purchaseCount}</Typography>
                </div>
              </Paper>
            </Grid>
          )}

          <Grid container spacing={2} sx={{ mt: 1, pl: 2 }}>
            {topCategories &&
              topCategories.length > 0 &&
              topCategories.slice(0, 3).map((category, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <CategoryBox borderColor={index === 0 ? '#1e88e5' : index === 1 ? '#6034a7' : 'green'}>
                    <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                      {category.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      Total Quantity: {category.totalQuantity}
                    </Typography>
                  </CategoryBox>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SoldQuantityDisplay;
