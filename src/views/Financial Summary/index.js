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
import { DataGrid } from '@mui/x-data-grid';

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

  const loadData = async () => {
    try {
      const userId = getUserId();

      const response = await fetchProducts({ userId });
      const rows = response?.data?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setProducts(rows);

      const result = await totalSoldProfit({ userId });
      setProfitLoss(result?.data?.data || {});

    } catch (error) {
      console.error(error, 'Failed to fetch data');
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      field: 'index',
      headerName: '#',
      flex: 0.5,
      renderCell: (params) =>
        <Typography >{params.value}</Typography>
    },
    {
      field: 'image',
      headerName: 'Image',
      flex: 0.7,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex' }}>
            <img
              src={
                params.value ||
                'https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
              }
              alt={params.value}
              style={{ width: 45, height: 45, borderRadius: '2px', objectFit: 'cover' }}
            />
          </Grid>
        </Grid>
    },
    {
      field: 'productnm',
      headerName: 'Product Name',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'categoryName',
      headerName: 'Category',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px' }}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'tax',
      headerName: 'Tax',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}%</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'margin',
      headerName: 'Margin',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center' sx={{ color: params?.value >= 0 ? 'green' : 'red' }}>{params?.value >= 0 ? `+${params?.value}%` : params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{moment.utc(params.value).local().format('ll')}</Typography>
          </Grid>
        </Grid>
    },
  ]

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
            label="Details"
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
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={products}
              columns={columns}
              getRowId={(row) => row?.id}
              sx={{
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#eeeeee',
                },
              }}>
            </DataGrid>
          </Box>
        )}

        {selectedTab === 1 && (
          <TableContainer component={Paper} sx={{minHeight:'70vh',borderRadius:0}}>
            <Table>
              <TableHead sx={{bgcolor:'#eeeeee'}}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sold Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sold Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Profit/Loss</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(profitLoss).map((product, index) => {
                  const marginColor = product.totalProfitOrLoss >= 0 ? 'green' : 'red';
                  const profitLossText =
                    product.totalProfitOrLoss >= 0 ? `+${product.totalProfitOrLoss.toFixed(2)}` : `${product.totalProfitOrLoss.toFixed(2)}`;

                  return (
                    <TableRow key={product.productName}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.soldQuantity}</TableCell>
                      <TableCell>{product.soldAmount}</TableCell>
                      <TableCell sx={{ color: marginColor }}>{product.totalProfitOrLoss >= 0 ? `${profitLossText}` : `${profitLossText}`}</TableCell>
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
