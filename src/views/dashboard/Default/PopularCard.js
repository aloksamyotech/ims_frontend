import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { fetchProducts, fetchLowStock } from 'apis/api.js';
import { getUserId } from 'apis/constant.js';
import { toast } from 'react-toastify';

// material-ui
import { useTheme } from '@mui/material/styles';
import { CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const userId = getUserId();
        const response = await fetchProducts({ userId });
        const allProducts = Array.isArray(response?.data) ? response?.data : [];
        setProducts(allProducts);

        const result = await fetchLowStock({ userId });
        const allLowStocks = Array.isArray(result?.data) ? result?.data : [];
        const zeroQuantityProducts = allProducts.filter((prod) => prod.quantity === 0);
        const uniqueLowStocks = [...new Set([...allLowStocks, ...zeroQuantityProducts])];

        setLowStockProducts(uniqueLowStocks);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to fetch products');
      }
    };

    loadCounts();
  }, []);

  const sortedProducts = [...products]
    .filter((product) => product.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity);

  const top5Products = sortedProducts.slice(0, 5);

  return (
    <>
      <MainCard content={false}>
        <CardContent>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignContent="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h4" sx={{paddingTop:'5px'}}>Popular Stocks</Typography>
                </Grid>
                <Grid item>
                  <MoreHorizOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: theme.palette.primary[200],
                      cursor: 'pointer',
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
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
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

            <Grid item xs={12}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Available Stock
              </Typography>
              {products.length > 0 ? (
                top5Products.length > 0 ? (
                  top5Products.map((product, index) => (
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
                  ))
                ) : (
                  <Typography variant="h6" color="inherit" sx={{ textAlign: 'center', marginY: 2 }}>
                    No products available.
                  </Typography>
                )
              ) : (
                <Typography variant="h6" color="inherit" sx={{ textAlign: 'center', marginY: 2 }}>
                  No products available.
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Restock Products
              </Typography>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product, index) => (
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
                ))
              ) : (
                <Typography variant="h6" color="inherit" sx={{ textAlign: 'center', marginY: 2 }}>
                  No low stock products to restock.
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </MainCard>
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default PopularCard;
