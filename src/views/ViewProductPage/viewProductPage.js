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
  Divider
} from '@mui/material';
import axios from 'axios';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { fetchPurchases, fetchOrders } from 'apis/api.js';
import { fetchCurrencySymbol } from 'apis/constant.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Container } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const TabContentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius:8,
  margin: theme.spacing(1),
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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/product/fetchById/${id}`);
        setProductData(response?.data);

        const purchase = await fetchPurchases();
        setPurchaseDetails(purchase?.data.filter((p) => p?.products?.some((product) => product?.productId === id)));

        const order = await fetchOrders();
        setOrderDetails(order?.data.filter((p) => p?.products?.some((product) => product?.productId === id)));
      } catch (error) {
        toast.error('Error fetching product data');
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
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
      field: 'createdAt',
      headerName: 'Purchase Date',
      width: 120,
      valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY')
    },
    { field: 'supplierName', headerName: 'Supplier', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => {
        const status = params.row?.status;
        return (
          <Box
            sx={{
              backgroundColor:
                status === 'completed' ? '#d5fadf' : status === 'pending' ? '#f8e1a1' : status === 'cancelled' ? '#fbe9e7' : '',
              color: status === 'completed' ? '#19ab53' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
              '&:hover': {
                backgroundColor:
                  status === 'completed' ? '#19ab53' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
                color: status === 'completed' ? '#ffff' : status === 'pending' ? '#ffff' : status === 'cancelled' ? '#ffff' : ''
              },
              padding: '0.5rem 1rem',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              width: '90px',
              height: '25px',
              textTransform: 'uppercase',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              gap: '0.5rem',
              fontSize: '12px'
            }}
          >
            {status}
          </Box>
        );
      }
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 120,
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
      width: 120,
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
      field: 'createdAt',
      headerName: 'Order Date',
      width: 120,
      valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY')
    },
    { field: 'customerName', headerName: 'Customer', width: 160 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'order_status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => {
        const status = params.row?.order_status;
        return (
          <Box
            sx={{
              backgroundColor:
                status === 'completed' ? '#d5fadf' : status === 'pending' ? '#f8e1a1' : status === 'cancelled' ? '#fbe9e7' : '',
              color: status === 'completed' ? '#19ab53' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
              '&:hover': {
                backgroundColor:
                  status === 'completed' ? '#19ab53' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
                color: status === 'completed' ? '#ffff' : status === 'pending' ? '#ffff' : status === 'cancelled' ? '#ffff' : ''
              },
              padding: '0.5rem 1rem',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              width: '90px',
              height: '25px',
              textTransform: 'uppercase',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              gap: '0.5rem',
              fontSize: '12px'
            }}
          >
            {status}
          </Box>
        );
      }
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 120,
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
      width: 120,
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
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    }
  ];

  const formattedPurchaseData = purchaseDetails?.map((purchase) => {
    const quantity = purchase?.products.length > 0 ? purchase?.products[0]?.quantity : 0;
    return {
      id: purchase?._id,
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

  const formattedOrderData = orderDetails?.map((order) => {
    const quantity = order?.products.length > 0 ? order?.products[0]?.quantity : 0;
    return {
      id: order?._id,
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
    <Container>
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
        <Box sx={{ marginTop: '10px', display: 'flex', justifyContent: 'center', width: '100%' }}>
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
              {productData?.imageUrl ? (
                <img
                  src={productData.imageUrl}
                  alt={productData.name}
                  style={{ borderRadius: '12px', objectFit: 'cover', maxWidth: '250px' }}
                />
              ) : (
                <Typography>No image available</Typography>
              )}
            </Box>

            <Box sx={{ flex: 2, padding: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
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
                    <strong>Buying Price:</strong> {currencySymbol} {productData?.buyingPrice || 'NA'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Selling Price:</strong> {currencySymbol} {productData?.sellingPrice || 'NA'}
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

       <Divider/>

        <TabContentCard>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="report tabs" textColor="primary">
            <Tab
              icon={<ShoppingCartIcon />}
              iconPosition="start"
              label="Sales"
              sx={{
                fontSize: '12px',
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
                fontSize: '12px',
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
                  checkboxSelection
                  getRowId={(row) => row.id}
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
              </Card>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box width="100%" overflow="hidden">
              <Card style={{ height: '600px' }}>
                <DataGrid
                  rows={filteredPurchaseData}
                  columns={purchaseColumns}
                  checkboxSelection
                  getRowId={(row) => row.id}
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
              </Card>
            </Box>
          )}
        </TabContentCard>
      </Card>
    </Container>
  );
};

export default ViewProductPage;
