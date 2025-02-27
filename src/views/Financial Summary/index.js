import React, { useState, useEffect } from 'react';
import { fetchProducts, totalSoldProfit } from 'apis/api.js';
import {
  Grid,
  Box,
  Card,
  Tabs,
  Tab,
  styled,
  Divider,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import moment from 'moment';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { toast } from 'react-toastify';
import { Container } from '@mui/system';
import { getUserId } from 'apis/constant.js';
import axios from 'axios';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2.4)
}));

const CompanyReport = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [profitLoss, setProfitLoss] = useState({});

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = getUserId();
        const response = await fetchProducts({ userId });
        setProducts(response?.data || []);

        const result = await totalSoldProfit({ userId });
        setProfitLoss(result?.data?.data || {});
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };
    loadData();
  }, []);

  return (
    <Grid>
      <Box
        sx={{
          backgroundColor: '#ffff',
          padding: '10px',
          borderRadius: '8px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h4">Pricing Info </Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/financial" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <Typography color="text.primary">Financial Summary</Typography>
        </Breadcrumbs>
      </Box>

      <TabContentCard>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="product report tabs">
          <Tab
            label="Tax/Margin"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            label="Profit/Loss"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 1 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        <Divider sx={{ opacity: 1 }} />

        {selectedTab === 0 && (
         <TableContainer component={Paper} sx={{ height: '400px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tax (%)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Margin (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  const marginColor = product.margin >= 0 ? 'green' : 'red';
                  const profitLossText = product.margin.toFixed(2);

                  return (
                    <TableRow key={product._id}>
                      <TableCell>{moment(product.createdAt).format('DD-MM-YYYY')}</TableCell>
                      <TableCell>
                        <img
                          src={
                            product.imageUrl ||
                            'https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
                          }
                          alt={product.productnm}
                          style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }}
                        />
                      </TableCell>
                      <TableCell>{product.productnm}</TableCell>
                      <TableCell>{product.categoryName}</TableCell>
                      <TableCell>{product.tax}</TableCell>
                      <TableCell sx={{ color: marginColor }}>{product.margin >= 0 ? `+${profitLossText}` : `${profitLossText}`}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selectedTab === 1 && (
         <TableContainer component={Paper} sx={{ height: '400px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sold Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sold Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Profit/Loss</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(profitLoss).map((product) => {
                  const marginColor = product.totalProfitOrLoss >= 0 ? 'green' : 'red';
                  const profitLossText =
                    product.totalProfitOrLoss >= 0 ? `+${product.totalProfitOrLoss.toFixed(2)}` : `${product.totalProfitOrLoss.toFixed(2)}`;

                  return (
                    <TableRow key={product.productName}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.soldQuantity}</TableCell>
                      <TableCell>{product.soldAmount}</TableCell>
                      <TableCell sx={{ color: marginColor }}>
                        {product.totalProfitOrLoss >= 0 ? `${profitLossText}` : `${profitLossText}`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabContentCard>
    </Grid>
  );
};

export default CompanyReport;
