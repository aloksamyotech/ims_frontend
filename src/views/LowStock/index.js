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
import { DataGrid } from '@mui/x-data-grid';

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

  const loadData = async () => {
    try {
      const userId = getUserId();

      const response = await fetchLowStock({ userId });
      const outOfStock = response?.data?.data?.filter((product) => product.quantity == 0) || []
      const rowsData = outOfStock.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setLowStockProducts(rowsData);

      const result = await fetchQuantityAlert({ userId });
      const filteredStockAlert = result?.data?.data?.filter((product) => product.quantity !== 0) || [];
      const rows = filteredStockAlert.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setStockAlert(rows);
    } catch (error) {
      console.error('Failed to fetch data');
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      field: 'index',
      headerName: '#',
      flex: 0.3,
      renderCell: (params) =>
        <Typography >{params.value}</Typography>
    },
    {
      field: 'productnm',
      headerName: 'Product Name',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'product_no',
      headerName: 'Product No.',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
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
      field: 'quantity',
      headerName: 'Quantity',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
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
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={stockAlert}
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
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={lowStockProducts}
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
      </TabContentCard>
    </Grid>
  );
};

export default CompanyReport;
