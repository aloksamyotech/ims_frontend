import React, { useState, useEffect } from 'react';
import { fetchProducts } from 'apis/api.js';
import {
  CardMedia,
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

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2.4)
}));

const CompanyReport = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [products, setProducts] = useState([]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const calculateProfitLoss = (sellingPrice, avgCost) => {
    const profitLoss = (sellingPrice - avgCost) / 100;
    const profit = profitLoss > 0 ? profitLoss : 0;
    const loss = profitLoss < 0 ? Math.abs(profitLoss) : 0;
    return { profitLoss, profit, loss };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = getUserId();
        const response = await fetchProducts({ userId });
        setProducts(response?.data || []);
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };
    loadData();
  }, []);

  return (
    <Container>
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
            label="Tax"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            label="Margin"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 1 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            label="Profit/Loss"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 2 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        <Divider sx={{ opacity: 1 }} />

        {selectedTab === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tax(%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((stock) => (
                  <TableRow key={stock._id}>
                    <TableCell>{moment(stock.createdAt).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>
                      <img
                        src={
                          stock.imageUrl ||
                          'https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
                        }
                        alt={stock.productnm}
                        style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>{stock.productnm}</TableCell>
                    <TableCell>{stock.categoryName}</TableCell>
                    <TableCell>{stock.tax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selectedTab === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Margin(%)</TableCell>
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
                      <TableCell sx={{ color: marginColor }}>
                        {product.margin >= 0 ? `+${profitLossText}` : `${profitLossText}`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selectedTab === 2 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Profit/Loss (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  const { profitLoss, profit, loss } = calculateProfitLoss(product.sellingPrice, product.avgCost);
                  const profitLossText = profitLoss.toFixed(2);
                  const profitColor = profitLoss >= 0 ? 'green' : 'red';
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
                      <TableCell sx={{ color: profitLoss >= 0 ? 'green' : 'red' }}>
                        {profitLoss >= 0 ? `+${profitLossText}` : `-${Math.abs(profitLossText)}`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabContentCard>
    </Container>
  );
};

export default CompanyReport;
