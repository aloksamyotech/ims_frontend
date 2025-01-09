import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { countCustomers } from 'apis/api.js';
import { getUserId } from 'apis/constant.js';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconCurrencyDollar } from '@tabler/icons';
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
    fontSize: '8rem', 
  }
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
        const response = await countCustomers({userId});
        if (response?.data?.count !== undefined) {
          setCustomerCount(response.data.count || 0);
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
                  Revenue
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
                  {customerCount}
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
            <IconCurrencyDollar  size={70}  />
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
