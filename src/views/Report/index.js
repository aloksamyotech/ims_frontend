import React, { useState, useEffect } from 'react';
import { fetchPurchases, fetchOrders } from 'apis/api.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  Tabs,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  Tab,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Card,
  styled
} from '@mui/material';
import moment from 'moment';
import { fetchCurrencySymbol } from 'apis/constant.js';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Link } from 'react-router-dom';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(3)
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

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const purchase = await fetchPurchases();
        setPurchaseDetails(purchase?.data);
        const order = await fetchOrders();
        setOrderDetails(order?.data);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    loadReport();
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
      field: 'date',
      headerName: 'Purchase Date',
      width: 180,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    { field: 'supplierName', headerName: 'Supplier', width: 200 },
    { field: 'supplierEmail', headerName: 'Email', width: 200 },
    { field: 'supplierPhone', headerName: 'Phone', width: 200 },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'total',
      headerName: 'Total Price',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    }
  ];

  const orderColumns = [
    {
      field: 'date',
      headerName: 'Order Date',
      width: 180,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    { field: 'customerName', headerName: 'Customer', width: 200 },
    { field: 'customerEmail', headerName: 'Email', width: 200 },
    { field: 'customerPhone', headerName: 'Phone', width: 200 },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'total',
      headerName: 'Total Price',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    }
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
        tax: purchase.tax
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
        tax: order.tax
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
          <GridToolbarExport sx={{ fontSize: 15 }} />
        </Stack>
      </GridToolbarContainer>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          marginTop: '20px',
          backgroundColor: '#ffff',
          padding: '14px',
          borderRadius: '8px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">Reports </Typography>

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
              minWidth: 160,
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
              minWidth: 160,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 1 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        {selectedTab === 0 && (
          <Box sx={{ height: 'auto' }}>
            <DataGrid
              rows={filteredOrderData}
              columns={orderColumns}
              checkboxSelection
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
                }
              }}
            />
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ height: 'auto' }}>
            <DataGrid
              rows={filteredPurchaseData}
              columns={purchaseColumns}
              checkboxSelection
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
                    border: 0
              }}
            />
          </Box>
        )}
      </TabContentCard>
    </Box>
  );
};

export default ProductReport;
