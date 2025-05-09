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
  styled
} from '@mui/material';
import moment from 'moment';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        const userId = getUserId();
        const response = await fetchPurchases({ userId });
        const allPurchases = response?.data;
        setPurchaseDetails(allPurchases);
        const result = await fetchOrders({ userId });
        const allOrders = result?.data;
        setOrderDetails(allOrders);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    loadReport();
  }, []);

  const filterDataByDate = (data, filter) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return data.filter((report) => {
      const reportDate = new Date(report?.date);
      reportDate.setHours(0, 0, 0, 0);

      if (filter === 'Daily') {
        return reportDate.getTime() === now.getTime();
      } else if (filter === 'Last 7 Days') {
        return reportDate >= oneWeekAgo && reportDate <= now;
      } else if (filter === 'Monthly') {
        return reportDate >= startOfMonth && reportDate <= endOfMonth;
      } else {
        return true;
      }
    });
  };

  const purchaseColumns = [
    {
      field: 'date',
      headerName: 'Purchase Date',
      width: 120,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    {
      field: 'supplierName',
      headerName: 'Supplier',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row?.supplierName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.supplierEmail}
          </Typography>
        </Box>
      )
    },
    { field: 'supplierPhone', headerName: 'Phone', width: 120 },
    { field: 'productName', headerName: 'Product Name', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'price',
      headerName: 'Price/unit',
      width: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 100,
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
      width: 120,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row?.customerName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.customerEmail}
          </Typography>
        </Box>
      )
    },
    { field: 'customerPhone', headerName: 'Phone', width: 120 },
    { field: 'productName', headerName: 'Product Name', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 110 },
    {
      field: 'price',
      headerName: 'Price/unit',
      width: 100,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 100,
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
  const filteredOrderData = filterDataByDate(flattenedOrderData, selectedDateRange);

  const flattenedPurchaseData = flattenPurchaseData(purchaseDetails);
  const filteredPurchaseData = filterDataByDate(flattenedPurchaseData, selectedDateRange);

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
                }
              }}
            />
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ height: '600px', padding: '0px 5px' }}>
            <DataGrid
              rows={filteredPurchaseData}
              columns={purchaseColumns}
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
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
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
