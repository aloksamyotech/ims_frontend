import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { countCustomers } from 'apis/api.js';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconUser } from '@tabler/icons';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// const CardWrapper = styled(MainCard)(({ theme }) => ({
//   backgroundColor: theme.palette.secondary.dark,
//   color: '#fff',
//   overflow: 'hidden',
//   position: 'relative', 
// }));

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
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
  justifyContent: 'center',
}));

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const getCustomerCount = async () => {
      try {
        const response = await countCustomers();
        setCustomerCount(response?.data?.count || 0);
      } catch (err) {
        console.log(err);
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
                    mb: 0.75,
                  }}
                >
                  {customerCount}
                </Typography>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#ffff',
                  }}
                >
                  Active Customer
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
              <IconUser size={30} color='#673ab7' />
            </TopRightIcon>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default EarningCard;
