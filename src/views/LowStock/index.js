import React, { useState, useEffect } from 'react';
import { fetchLowStock, fetchQuantityAlert } from 'apis/api.js';
import {
  CardMedia,
  Box,
  Tabs,
  Tab,
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
        const response = await fetchLowStock();
        setLowStockProducts(response?.data?.data || []);
        const result = await fetchQuantityAlert();
        const filteredStockAlert = result?.data?.data?.filter((product) => product.quantity !== 0) || [];
        setStockAlert(filteredStockAlert);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };
    loadData();
  }, []);

  return (
    <Box sx={{ padding: '10px' }}>
      <Typography variant="h4">Stock Report</Typography>

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <MuiLink component={Link} to="/dashboard/admin" color="inherit">
          <HomeIcon sx={{ color: '#5e35b1' }} />
        </MuiLink>
        <Typography color="text.primary">Low Stocks / Out of Stocks</Typography>
      </Breadcrumbs>

      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="stock report tabs">
        <Tab label="Low Stock" />
        <Tab label="Out of Stock" />
      </Tabs>

      <Divider sx={{ opacity: 1 }} />

      {selectedTab === 0 && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Product No</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockAlert.map((stock) => (
                <TableRow key={stock._id}>
                  <TableCell>{stock.productnm}</TableCell>
                  <TableCell>{stock.categoryName}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{moment(stock.createdAt).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>
                    <CardMedia
                      component="img"
                      image={stock.imageUrl}
                      alt={stock.productnm}
                      sx={{ width: 50, height: 50, borderRadius: '4px' }}
                    />
                  </TableCell>
                  <TableCell>{stock.product_no}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedTab === 1 && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Product No</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.productnm}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{moment(product.createdAt).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>
                    <CardMedia
                      component="img"
                      image={product.imageUrl}
                      alt={product.productnm}
                      sx={{ width: 50, height: 50, borderRadius: '4px' }}
                    />
                  </TableCell>
                  <TableCell>{product.product_no}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CompanyReport;
