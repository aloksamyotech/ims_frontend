import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { getUserId, fetchCurrencySymbol } from 'apis/constant.js';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import MainCard from 'ui-component/cards/MainCard';
import { IconShoppingBag, IconShoppingCart, IconUser, IconTruck } from '@tabler/icons';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  padding: '16px',
  height: '150px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const TopRightIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    color: 'white',
    fontSize: '3rem',
  },
}));

const EarningCard = ({ title, value, icon: Icon, isLoading }) => {
  return (
    <CardWrapper>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h5">{value}</Typography>
          <TopRightIcon>
            <Icon />
          </TopRightIcon>
        </Box>
      )}
    </CardWrapper>
  );
};

const Analytics = () => {
  const theme = useTheme();
  const [currencySymbol, setCurrencySymbol] = useState('');

  const [customerData, setCustomerData] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        const response = await axios.get(`http://localhost:4200/customer/count?userId=${userId}`);
        setCustomerData(response.data.success ? response.data.data : []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
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

  return (
    <Box sx={{ padding: '5px' }}>
      <Grid container spacing={2}>
     
        <Grid item xs={12} sm={6} md={3}>
          <EarningCard
            title="Total Sales"
            value={0}
            icon={IconShoppingBag}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EarningCard
            title="Total Orders"
            value={0}
            icon={IconShoppingCart}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EarningCard
            title="Total Customers"
            value={customerData}
            icon={IconUser}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EarningCard
            title="Total Purchases"
            value={0}
            icon={IconTruck}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
