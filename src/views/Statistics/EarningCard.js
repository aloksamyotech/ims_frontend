import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getTotalPurchase } from 'apis/api.js';
import { getUserId } from 'apis/constant.js';
import { fetchCurrencySymbol } from 'apis/constant.js'; 

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconCurrencyDollar } from '@tabler/icons';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

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
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const userId = getUserId();
        const amount = await getTotalPurchase({ userId });
        console.log(amount);
        if (amount?.data?.success && Array.isArray(amount?.data?.data)) {
          const filteredPurchaseData = amount.data.data.filter(item => item.companyId === userId);
          if (filteredPurchaseData.length > 0) {
            setPurchaseData(filteredPurchaseData[0]);
          } else {
            setPurchaseData([]);
          }
        } else {
          setPurchaseData([]); 
        }
      } catch (error) {
        setPurchaseData([]);
      }
    };
  
    fetchPurchaseData();
  }, []);
  
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
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
                  Expenditure
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
                   {currencySymbol} {purchaseData.total_purchase_amount}
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
