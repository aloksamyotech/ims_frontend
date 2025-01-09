import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
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

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { countPurchases } from 'apis/api.js';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

const TopRightIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '10px',
  color: theme.palette.secondary[100],
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
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeValue, setTimeValue] = useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  useEffect(() => {
    const getPurchaseCount = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.log('User ID is missing');
          setLoading(false);
          return;
        }
        const response = await countPurchases({userId});
        if (response && response?.data && response?.data?.count !== undefined) {
          setPurchaseCount(response.data.count || 0);
        } else {
          setPurchaseCount(0);
        }
      } catch (err) {
        console.error('Error fetching purchase count:', err);
        setError('Failed to purchase order count');
      } finally {
        setLoading(false);
      }
    };
    getPurchaseCount();
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
                  {purchaseCount}
                </Typography>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#ffff'
                  }}
                >
                  Total Purchases
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
              <IconShoppingCartPlus size={30} color="#673ab7" />
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
