import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { countCustomers } from 'apis/api.js';
import { getUserId } from 'apis/constant.js';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconUser } from '@tabler/icons';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import axios from 'axios';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

const TopRightIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '10px',
  color: theme.palette.primary[100],
  backgroundColor: '#ffff',
  borderRadius: '50%',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCustomerCount = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.log('User ID is missing');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:4200/customer/count?userId=${userId}`);
        if (response?.data?.count !== undefined) {
          setCustomerCount(response.data.count);
        } else {
          setCustomerCount(0);
        }
      } catch (err) {
        console.error('Error fetching customer count:', err);
        setError('Failed to fetch customer count');
      } finally {
        setLoading(false);
      }
    };

    getCustomerCount();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
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
                  {customerCount}
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
                  Active Customers
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
              <IconUser size={30} color="#1e88e5" />
            </TopRightIcon>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
