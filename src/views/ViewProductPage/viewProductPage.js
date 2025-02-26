import React, { useEffect, useState } from 'react';
import {
  styled,
  Tabs,
  Tab,
  Stack,
  Box,
  Select,
  MenuItem,
  FormControl,
  Card,
  Typography,
  Grid,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Button
} from '@mui/material';
import axios from 'axios';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { fetchPurchases, fetchOrders, fetchProductById } from 'apis/api.js';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Container } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const TabContentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: 8,
  margin: theme.spacing(0),
  padding: theme.spacing(1),
}));

const ViewProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
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

  const loadProduct = async () => {
    try {
      const response = await fetchProductById(id);
      setProductData(response?.data);

      const userId = getUserId();
      const productId = id;

      const purchase = await fetchPurchases();
      setPurchaseDetails(purchase?.data.filter((p) =>
        p?.userId === userId && p?.products?.some((product) => product?.productId === productId)
      ));

      const order = await fetchOrders();
      setOrderDetails(order?.data.filter((p) =>
        p?.userId === userId && p?.products?.some((product) => product?.productId === productId)
      ));

    } catch (error) {
      toast.error('Error fetching product data');
    }
  };
  useEffect(() => {
    loadProduct();
  }, [id]);

  const getCurrency = async () => {
    const symbol = await fetchCurrencySymbol();
    setCurrencySymbol(symbol);
  };
  useEffect(() => {
    getCurrency();
  }, []);

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

  const filterDataByDate = (data) => {
    const now = moment();
    const last7Days = moment().subtract(7, 'days');

    return data.filter((report) => {
      const reportDate = moment(report.createdAt);

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
      flex: 0.3
    },
    {
      field: 'purchase_no',
      headerName: 'Purchase ID',
      flex: 1,
    },
    {
      field: 'supplierName',
      headerName: 'Supplier',
      headerAlign: 'center',
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 0.3
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice No.',
      flex: 1
    },
    {
      field: 'customerName',
      headerName: 'Customer',
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
      headerName: 'Order Date',
      headerAlign: 'center',
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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

  const formattedPurchaseData = purchaseDetails?.map((purchase, index) => {
    const quantity = purchase?.products.length > 0 ? purchase?.products[0]?.quantity : 0;
    return {
      id: purchase?._id,
      index: index + 1,
      purchase_no: purchase?.purchase_no,
      supplierName: purchase?.supplierName,
      createdAt: purchase?.createdAt,
      status: purchase?.status,
      subtotal: purchase?.subtotal,
      tax: purchase?.tax,
      total: purchase?.total,
      quantity: quantity
    };
  });

  const formattedOrderData = orderDetails?.map((order, index) => {
    const quantity = order?.products.length > 0 ? order?.products[0]?.quantity : 0;
    return {
      id: order?._id,
      index: index + 1,
      invoice_no: order?.invoice_no,
      customerName: order?.customerName,
      createdAt: order?.createdAt,
      order_status: order?.order_status,
      subtotal: order?.subtotal,
      tax: order?.tax,
      total: order?.total,
      quantity: quantity
    };
  });

  const filteredOrderData = filterDataByDate(formattedOrderData);
  const filteredPurchaseData = filterDataByDate(formattedPurchaseData);

  return (
    <Grid>
      <Box
        sx={{
          backgroundColor: '#ffff',
          padding: '10px',
          borderRadius: '8px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">Product Details</Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/products" color="inherit">
            <Typography color="text.primary">Products</Typography>
          </MuiLink>
          <Typography color="text.primary">ViewProduct</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ marginTop: '20px' }}>
        <Box sx={{ margin: '10px', display: 'flex', justifyContent: 'center', width: '98%', padding: '10px' }}>
          <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: { md: '1px solid #e0e0e0' }
              }}
            >
              <img
                src={productData?.imageUrl || 'https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'}
                alt={productData?.name}
                style={{ borderRadius: '12px', objectFit: 'fill', maxWidth: '250px', opacity: productData?.imageUrl ? 1 : 0.1, }}
              />
            </Box>

            <Box sx={{ flex: 2, padding: 3, marginLeft: '10px' }}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                {productData?.productnm || 'NA'} ({productData?.product_no || 'NA'})
              </Typography>

              <Typography variant="body1" sx={{ marginBottom: 3, color: 'text.secondary' }}>
                <strong>Description:</strong> {productData?.notes || 'No additional notes'}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Category:</strong> {productData?.categoryName || 'NA'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {productData?.quantity || 'NA'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Buying Price /unit:</strong> {currencySymbol} {productData?.buyingPrice || 'NA'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Selling Price/unit:</strong> {currencySymbol} {productData?.sellingPrice || 'NA'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Tax:</strong> {productData?.tax || 'NA'}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Margin:</strong> {productData?.margin || 'NA'}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Box>
        <Divider />
        <TabContentCard>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="report tabs" textColor="primary">
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
            <Box width="100%" overflow="hidden">
              <Card style={{ height: '600px' }}>
                <DataGrid
                  rows={filteredOrderData}
                  columns={orderColumns}
                  getRowId={(row) => row.id}
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
              </Card>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box width="100%" overflow="hidden">
              <Card style={{ height: '600px' }}>
                <DataGrid
                  rows={filteredPurchaseData}
                  columns={purchaseColumns}
                  getRowId={(row) => row.id}
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
              </Card>
            </Box>
          )}
        </TabContentCard>
      </Card>
    </Grid>
  );
};

export default ViewProductPage;
