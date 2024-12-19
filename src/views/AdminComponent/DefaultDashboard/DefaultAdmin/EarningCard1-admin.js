import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { countSuppliers } from 'apis/api.js';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconUserCheck } from '@tabler/icons'; 
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// const CardWrapper = styled(MainCard)(({ theme }) => ({
//   backgroundColor: theme.palette.secondary.dark,
//   color: '#fff',
//   overflow: 'hidden',
//   position: 'relative', 
// }));

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background:'#2f9232',
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
    background:'#2f9232',
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
  color: '#54c758',
  backgroundColor: '#ffff', 
  borderRadius: '50%', 
  padding: '12px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  const [supplierCount, setSupplierCount] = useState(0);

  useEffect(() => {
    const getSupplierCount = async () => {
      try {
        const response = await countSuppliers();
        setSupplierCount(response.data.count);
      } catch (err) {
        console.log(err);
      }
    };
    getSupplierCount();
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
                  {supplierCount}
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
                  Active Suppliers
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
            <IconUserCheck size={30}  color='#673ab7' />
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
