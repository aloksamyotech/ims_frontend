import React, { useState, useEffect } from 'react';
import { fetchPurchases, fetchOrders, fetchUsers } from 'apis/api.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  Tabs,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Tab,
  Divider,
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
import { Container, width } from '@mui/system';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(2.4)
}));

const ProductReport = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const getCurrency = async () => {
    const symbol = await fetchCurrencySymbol();
    setCurrencySymbol(symbol);
  };

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      const nonAdminUsers = response?.data.filter(user => user.role !== 'admin') || [];
      setUsers(nonAdminUsers);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };
  useEffect(() => {
    loadUsers();
    getCurrency();
  }, []);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await fetchPurchases();
        const filteredPurchaseByUser = response?.data.filter((purchase) => purchase.userId === selectedUser);
        const rowsPurchase = filteredPurchaseByUser?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
        setPurchaseDetails(rowsPurchase);

        const result = await fetchOrders();
        const filteredOrderByUser = result?.data.filter((order) => order.userId === selectedUser);
        const rowsOrder = filteredOrderByUser?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
        setOrderDetails(rowsOrder);

      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    if (selectedUser) {
      loadReport();
    }
  }, [selectedUser]);

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

  const UserDropdown = () => (
    <FormControl
      sx={{
        backgroundColor: '#fff',
        borderRadius: '2px'
      }}
    >
      <Select value={selectedUser} onChange={handleUserChange} displayEmpty inputProps={{ 'aria-label': '' }}>
        <MenuItem value="">
          <strong>Select Company</strong>
        </MenuItem>
        {users.map((user) => (
          <MenuItem
            key={user._id}
            value={user._id}
            sx={{
              paddingY: '4px'
            }}
          >
            {user.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const purchaseColumns = [
    {
      field: 'index',
      headerName: '#',
      width: 50
    },
    {
      field: 'date',
      headerName: 'Purchase Date',
      width: 120,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    {
      field: 'supplierName',
      headerName: 'Supplier',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row?.supplierName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.supplierEmail}
          </Typography>
        </Box>
      )
    },
    { field: 'supplierPhone', headerName: 'Phone', width: 150 },
    { field: 'productName', headerName: 'Product Name', width: 180 },
    { field: 'quantity', headerName: 'Quantity', width: 110 },
    // {
    //   field: 'price',
    //   headerName: 'Amount',
    //   width: 120,
    //   valueFormatter: ({ value }) => {
    //     if (value != null) {
    //       return ` ${currencySymbol} ${value.toLocaleString()}`;
    //     }
    //     return '$0';
    //   }
    // },
    // {
    //   field: 'subtotal',
    //   headerName: 'Subtotal',
    //   width: 120,
    //   valueFormatter: ({ value }) => {
    //     if (value != null) {
    //       return ` ${currencySymbol} ${value.toLocaleString()}`;
    //     }
    //     return '$0';
    //   }
    // },
    // {
    //   field: 'tax',
    //   headerName: 'Tax',
    //   width: 100,
    //   valueFormatter: ({ value }) => {
    //     if (value != null) {
    //       return ` ${currencySymbol} ${value.toLocaleString()}`;
    //     }
    //     return '$0';
    //   }
    // },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 120,
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
      field: 'index',
      headerName: '#',
      width: 50
    },
    {
      field: 'date',
      headerName: 'Order Date',
      width: 120,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row?.customerName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.customerEmail}
          </Typography>
        </Box>
      )
    },
    { field: 'customerPhone', headerName: 'Phone', width: 150 },
    { field: 'productName', headerName: 'Product Name', width: 180 },
    { field: 'quantity', headerName: 'Quantity', width: 110 },
    // {
    //   field: 'price',
    //   headerName: 'Amount',
    //   width: 120,
    //   valueFormatter: ({ value }) => {
    //     if (value != null) {
    //       return ` ${currencySymbol} ${value.toLocaleString()}`;
    //     }
    //     return '$0';
    //   }
    // },
    // {
    //   field: 'subtotal',
    //   headerName: 'Subtotal',
    //   width: 120,
    //   valueFormatter: ({ value }) => {
    //     if (value != null) {
    //       return ` ${currencySymbol} ${value.toLocaleString()}`;
    //     }
    //     return '$0';
    //   }
    // },
    // {
    //   field: 'tax',
    //   headerName: 'Tax',
    //   width: 100,
    //   valueFormatter: ({ value }) => {
    //     if (value != null) {
    //       return ` ${currencySymbol} ${value.toLocaleString()}`;
    //     }
    //     return '$0';
    //   }
    // },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 120,
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
        tax: purchase.tax,
        index: purchase?.index
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
        index: order?.index
      }));
    });
  };

  const flattenedOrderData = flattenOrderData(orderDetails);
  const filteredOrderData = filterDataByDate(flattenedOrderData);

  const flattenedPurchaseData = flattenPurchaseData(purchaseDetails);
  const filteredPurchaseData = filterDataByDate(flattenedPurchaseData);

  const CustomToolbar = () => (
    <GridToolbarContainer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px',
          overflow: 'hidden',
          width: '300px',
          height: '35px'
        }}
      >
        <Box sx={{ flex: '30%' }}>
          <FormControl fullWidth>
            <Select
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              sx={{
                borderRadius: '2px',
                backgroundColor: '#ffffff',
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Last 7 Days">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '70%' }}>
          <FormControl fullWidth>
            <UserDropdown />
          </FormControl>
        </Box>
      </Box>

      <GridToolbarExport style={{ fontSize: 14 }} />
    </GridToolbarContainer>
  );

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
          <MuiLink component={Link} to="/dashboard/admin" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <Typography color="text.primary">Reports</Typography>
        </Breadcrumbs>
      </Box>

      <TabContentCard>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="product report tabs" sx={{ alignContent: 'center' }}>
          <Tab
            icon={<ShoppingCartIcon />}
            iconPosition="start"
            label="Sales"
            sx={{
              fontSize: '14px',
              minWidth: 200,
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
              minWidth: 200,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 1 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        {selectedTab === 0 && (
          <Box sx={{ height: '600px', padding: '5px' }}>
            <DataGrid
              rows={filteredOrderData}
              columns={orderColumns}
              rowHeight={50}
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
          <Box sx={{ height: '600px', padding: '5px' }}>
            <DataGrid
              rows={filteredPurchaseData}
              columns={purchaseColumns}
              rowHeight={50}
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
