import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { fetchProducts, fetchLowStock } from 'apis/api.js';

// material-ui
import { useTheme } from '@mui/material/styles';
import { CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard-admin';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const sortedProducts = [...products].sort((a, b) => b.quantity - a.quantity);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response?.data);
        const result = await fetchLowStock();
        setLowStockProducts(result?.data.data);
      } catch (error) {
        toast.error('Failed to fetch products');
      }
    };
    loadProducts();
  }, []);

  const top5Products = sortedProducts.slice(0, 5);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">Popular Stocks</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.primary[200],
                        cursor: 'pointer'
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Month</MenuItem>
                      <MenuItem onClick={handleClose}> This Year </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <BajajAreaChartCard />
              </Grid>
              {products && products.length > 0 && (
                <Grid item xs={12}>
                  <Grid container direction="column">
                    <Grid item>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Typography variant="h4" color="inherit" sx={{ marginBottom: 2 }}>
                          Available Stock
                        </Typography>

                        {top5Products.map((product, index) => (
                          <Grid container key={index} sx={{ marginBottom: 1 }} justifyContent="space-between">
                            <Grid item xs={6}>
                              <Typography variant="body2" color="inherit">
                                {product.productnm}
                              </Typography>
                              <Divider sx={{ marginY: 1.5, borderWidth: 0.001 }} />
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                              <Typography variant="subtitle1" color="inherit">
                                {product.quantity}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {lowStockProducts && lowStockProducts.length > 0 ? (
                <Grid item xs={12}>
                  <Grid container direction="column">
                    <Grid item>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Typography variant="h4" color="inherit" sx={{ marginBottom: 2 }}>
                          Restock Products
                        </Typography>

                        {lowStockProducts.map((product, index) => (
                          <Grid container key={index} sx={{ marginBottom: 1 }} justifyContent="space-between">
                            <Grid item xs={6}>
                              <Typography variant="body2" color="inherit">
                                {product.productnm}
                              </Typography>
                              <Divider sx={{ marginY: 1.5, borderWidth: 0.001 }} />
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                              <Typography variant="subtitle1" color="inherit">
                                {product.quantity}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12} textAlign="center">
                  <Typography variant="h6" color="inherit" sx={{ marginY: 2 }}>
                    All products are sufficiently stocked!
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
