import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getUserId } from 'apis/constant.js';
import { countOrders } from 'apis/api.js';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IconShoppingCart } from '@tabler/icons';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#f1af4c',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

const TopRightIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '10px',
  color:  '#f1af4c',
  backgroundColor: '#ffff',
  borderRadius: '50%',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));
// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
  const theme = useTheme();
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeValue, setTimeValue] = useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  useEffect(() => {
    const getOrderCount = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.log('User ID is missing');
          setLoading(false);
          return;
        }
          const response = await countOrders({userId});
        if (response && response?.data && response?.data?.count !== undefined) {
          setOrderCount(response.data.count || 0);
        } else {
          setOrderCount(0);
        }
      } catch (err) {
        console.error('Error fetching order count:', err);
        setError('Failed to fetch order count');
      } finally {
        setLoading(false);
      }
    };

    getOrderCount();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 3.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 500,
                    mr: 1,
                    mt: 1.75,
                    mb: 0.75
                  }}
                >
                  {orderCount}
                </Typography>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color:'#ffff',
                  }}
                >
                  Total Orders
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
              <IconShoppingCart size={30} color="#FFA726" />
            </TopRightIcon>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
