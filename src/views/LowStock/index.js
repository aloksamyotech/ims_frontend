import React, { useState, useEffect } from 'react';
import { fetchLowStock, fetchQuantityAlert } from 'apis/api.js';
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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [stockAlert, setStockAlert] = useState([]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = getUserId();
        const response = await fetchLowStock({ userId });
        setLowStockProducts(response?.data?.data || []);
        const result = await fetchQuantityAlert({ userId });
        const filteredStockAlert = result?.data?.data?.filter((product) => product.quantity !== 0) || [];
        setStockAlert(filteredStockAlert);
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
        <Typography variant="h4">Stock Reports</Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/admin" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <Typography color="text.primary">Low Stock</Typography>
        </Breadcrumbs>
      </Box>

      <TabContentCard>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="product report tabs">
          <Tab
            icon={<WarningAmberIcon />}
            iconPosition="start"
            label="Low Stock"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<ErrorOutlineIcon />}
            iconPosition="start"
            label="Out of Stock"
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockAlert.map((stock) => (
                  <TableRow key={stock._id}>
                    <TableCell>{moment(stock.createdAt).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>{stock.product_no}</TableCell>
                    <TableCell>{stock.productnm}</TableCell>
                    <TableCell>{stock.categoryName}</TableCell>
                    <TableCell sx={{ color: stock.quantity < 10 ? 'red' : 'blue', fontWeight : 'bold' }}>{stock.quantity}</TableCell>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Product No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{moment(product.createdAt).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>{product.product_no}</TableCell>
                    <TableCell>{product.productnm}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color : 'red' }}>{product.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabContentCard>
    </Grid>
  );
};

export default CompanyReport;
