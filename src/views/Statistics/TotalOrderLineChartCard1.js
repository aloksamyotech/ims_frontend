import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserId } from 'apis/constant.js';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { IconShoppingCartPlus } from '@tabler/icons';

// third-party
import Chart from 'react-apexcharts';


// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IconUser } from '@tabler/icons';
import { countOrders } from 'apis/api.js';

const TopRightIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: '10%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  boxShadow: `0 0 0 5px rgba(255, 255, 255, 0.2), 0 0 0 10px rgba(255, 255, 255, 0.1)`,
  zIndex: 1,
  '& svg': {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '8rem'
  }
}));

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
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
        if (response?.data?.count !== undefined) {
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
          <Box sx={{ p: 1.5 }}>
            <Grid container direction="column">
              <Grid item sx={{ mt: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#ffff'
                  }}
                >
                  Order Received
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    mr: 1,
                    mt: 1.75,
                    mb: 0.75
                  }}
                >
                  {orderCount}
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
              <IconUser size={70} />
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
