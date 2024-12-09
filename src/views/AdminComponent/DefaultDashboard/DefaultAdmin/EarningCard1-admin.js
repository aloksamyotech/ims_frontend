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

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative', 
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
                    fontSize: '2.125rem',
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
                    color: theme.palette.secondary[200],
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
