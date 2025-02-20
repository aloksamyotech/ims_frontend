import React, { useState, useEffect } from 'react';
import { fetchPurchases, fetchOrders } from 'apis/api.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  Tabs,
  Grid,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  Tab,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Card,
  styled,
  Button
} from '@mui/material';
import moment from 'moment';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Link } from 'react-router-dom';
import { minWidth, width } from '@mui/system';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[1],
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2.4)
}));

const ProductReport = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [currencySymbol, setCurrencySymbol] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  const getCurrency = async () => {
    const symbol = await fetchCurrencySymbol();
    setCurrencySymbol(symbol);
  };

  const loadReport = async () => {
    try {
      const userId = getUserId();
      const response = await fetchPurchases({ userId });
      const rows = response?.data?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setPurchaseDetails(rows);
      const result = await fetchOrders({ userId });
      const rowData = result?.data?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setOrderDetails(rowData);
    } catch (error) {
      toast.error('Error fetching data');
    }
  };
  useEffect(() => {
    loadReport();
    getCurrency();
  }, []);

  const filterDataByDate = (data) => {
    const now = moment();
    const last7Days = moment().subtract(7, 'days');
    return data.filter((report) => {
      const reportDate = moment(report?.date);
      switch (selectedDateRange) {
        case 'Daily':
          return reportDate.isSame(now, 'day');
        case 'Weekly':
          return reportDate.isBetween(last7Days, now, null, '[]');
        case 'Monthly':
          return reportDate.isSame(now, 'month');
        case 'All':
        default:
          return true;
      }
    });
  };

  const purchaseColumns = [
    {
      field: 'index',
      headerName: '#',
      width: 50,
    },
    {
      field: 'purchase_no',
      headerName: 'Purchase ID',
      minWidth: 100,
    },
    {
      field: 'supplierName',
      headerName: 'Supplier',
      minWidth: 150,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography>{params?.value}</Typography>
            <Typography>{params?.row?.supplierEmail}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'supplierPhone',
      headerName: 'Number',
      headerAlign: 'center',
      minWidth: 100,
    },
    {
      field: 'productName',
      headerName: 'Product',
      headerAlign: 'center',
      minWidth: 100,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'createdAt',
      headerName: 'Purchase Date',
      headerAlign: 'center',
      minWidth: 100,
      valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY'),
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      headerAlign: 'center',
      minWidth: 100,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      headerAlign: 'center',
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'tax',
      headerName: 'Tax',
      headerAlign: 'center',
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      headerAlign: 'center',
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      minWidth: 100,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12} textAlign='center'>
            <Button size='small' variant='contained'
              sx={{
                color: (params?.value) === 'pending' ? '#ffc107' : ((params?.value) === 'completed' ? '#00c853' : '#d84315'),
                backgroundColor: (params?.value) === 'pending' ? '#fff8e1' : ((params?.value) === 'completed' ? '#b9f6ca' : '#fbe9e7'), boxShadow: 'none', borderRadius: '10px', padding: '0px', fontWeight: '400',
                '&:hover': {
                  color: (params?.value) === 'pending' ? '#ffc107' : ((params?.value) === 'completed' ? '#00c853' : '#d84315'),
                  backgroundColor: (params?.value) === 'pending' ? '#fff8e1' : ((params?.value) === 'completed' ? '#b9f6ca' : '#fbe9e7'), boxShadow: 'none'
                }
              }}>{params?.value}</Button>
          </Grid>
        </Grid >
    },
  ];
  const orderColumns = [
    {
      field: 'index',
      headerName: '#',
      width: 50,
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice No.',
      minWidth: 100,
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      minWidth: 150,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography >{params?.value}</Typography>
            <Typography >{params?.row?.customerEmail}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'customerPhone',
      headerName: 'Number',
      headerAlign: 'center',
      minWidth: 100,
    },
    {
      field: 'productName',
      headerName: 'Product',
      headerAlign: 'center',
      minWidth: 100,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'createdAt',
      headerName: 'Order Date',
      headerAlign: 'center',
      minWidth: 100,
      valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY'),
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      headerAlign: 'center',
      minWidth: 100,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>

    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      headerAlign: 'center',
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'tax',
      headerName: 'Tax',
      headerAlign: 'center',
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      headerAlign: 'center',
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'order_status',
      headerName: 'Status',
      headerAlign: 'center',
      minWidth: 100,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12} textAlign='center'>
            <Button size='small' variant='contained'
              sx={{
                color: (params?.value) === 'pending' ? '#ffc107' : ((params?.value) === 'completed' ? '#00c853' : '#d84315'),
                backgroundColor: (params?.value) === 'pending' ? '#fff8e1' : ((params?.value) === 'completed' ? '#b9f6ca' : '#fbe9e7'), boxShadow: 'none', borderRadius: '10px', padding: '0px', fontWeight: '400',
                '&:hover': {
                  color: (params?.value) === 'pending' ? '#ffc107' : ((params?.value) === 'completed' ? '#00c853' : '#d84315'),
                  backgroundColor: (params?.value) === 'pending' ? '#fff8e1' : ((params?.value) === 'completed' ? '#b9f6ca' : '#fbe9e7'), boxShadow: 'none'
                }
              }}>{params?.value}</Button>
          </Grid>
        </Grid >
    },
  ];

  const flattenPurchaseData = (purchaseData) => {
    return purchaseData.flatMap((purchase) => {
      return purchase.products.map((product) => ({
        id: `${purchase._id}-${product.productId}`,
        date: purchase.date,
        supplierName: purchase.supplierName,
        supplierEmail: purchase.supplierEmail,
        supplierPhone: purchase.supplierPhone,
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
        total: purchase.total,
        subtotal: purchase.subtotal,
        tax: purchase.tax,
        purchase_no: purchase.purchase_no,
        index: purchase?.index,
        status: purchase?.status
      }));
    });
  };

  const flattenOrderData = (orderData) => {
    return orderData.flatMap((order) => {
      return order.products.map((product) => ({
        id: `${order._id}-${product.productId}`,
        date: order.date,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
        total: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        index: order?.index,
        invoice_no: order?.invoice_no,
        order_status: order?.order_status
      }));
    });
  };

  const flattenedOrderData = flattenOrderData(orderDetails);
  const filteredOrderData = filterDataByDate(flattenedOrderData);

  const flattenedPurchaseData = flattenPurchaseData(purchaseDetails);
  const filteredPurchaseData = filterDataByDate(flattenedPurchaseData);

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px'
        }}
      >
        <GridToolbarQuickFilter
          placeholder="Search..."
          style={{
            width: '250px',
            backgroundColor: '#ffff',
            borderRadius: '8px',
            padding: '5px 10px',
            border: '1px solid beige'
          }}
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl
            sx={{
              width: '120px',
              height: '40px'
            }}
          >
            <Select
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              sx={{
                width: '120px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#ffffff'
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Last 7 Days">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          <GridToolbarExport style={{ fontSize: 14 }} />
        </Stack>
      </GridToolbarContainer>
    );
  };

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
        <Typography variant="h4">Reports </Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <Typography color="text.primary">Reports</Typography>
        </Breadcrumbs>
      </Box>

      <TabContentCard>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="product report tabs">
          <Tab
            icon={<ShoppingCartIcon />}
            iconPosition="start"
            label="Sales"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<Inventory2Icon />}
            iconPosition="start"
            label="Purchases"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 1 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        {selectedTab === 0 && (
          <Box sx={{ height: '600px', padding: '0px 5px' }}>
            <DataGrid
              rows={filteredOrderData}
              columns={orderColumns}
              rowHeight={60}
              components={{ Toolbar: CustomToolbar }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 }
                }
              }}
              pagination
              sx={{
                border: 0,
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#eeeeee',
                },
              }}
            />
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ height: '600px', padding: '0px 5px' }}>
            <DataGrid
              rows={filteredPurchaseData}
              columns={purchaseColumns}
              components={{ Toolbar: CustomToolbar }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 }
                }
              }}
              pagination
              sx={{
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#eeeeee',
                },
                border: 0
              }}
            />
          </Box>
        )}
      </TabContentCard>
    </Grid>
  );
};

export default ProductReport;
