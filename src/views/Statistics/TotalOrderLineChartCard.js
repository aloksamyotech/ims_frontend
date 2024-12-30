import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserId } from 'apis/constant.js';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// ==============================|| DASHBOARD - TOP 3 CATEGORIES CARD ||============================== //

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor:'#eeeeee',
  overflow: 'hidden',
  position: 'relative'
}));

const CategoryBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: 10,
  backgroundColor: '#fff',
  height: '100%',
  textAlign: 'center',
  color: theme.palette.text.primary
}));

// ==============================|| DASHBOARD - TOP 3 CATEGORIES CARD ||============================== //

const TopCategoriesCard = ({ isLoading }) => {
  const theme = useTheme();
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopCategories = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.log('User ID is missing');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:4200/order/total-category?userId=${userId}`);
        if (response?.data?.data) {
          setTopCategories(response.data.data);
        } else {
          setTopCategories([]);
        }
      } catch (err) {
        console.error('Error fetching top categories:', err);
        setError('Failed to fetch top categories');
      } finally {
        setLoading(false);
      }
    };

    getTopCategories();
  }, []);

  return (
    <>
      {isLoading || loading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box>
            <Grid container spacing={2}>
              {topCategories.length > 0 ? (
                topCategories.slice(0, 3).map((category, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <CategoryBox>
                      <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                        {category.category}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'gray' }}>
                        Total Quantity: {category.totalQuantity}
                      </Typography>
                    </CategoryBox>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>No categories found</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TopCategoriesCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TopCategoriesCard;
