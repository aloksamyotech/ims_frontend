import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Link as MuiLink
} from '@mui/material';
import axios from 'axios';
import TableStyle from '../../ui-component/TableStyle';
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
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(3)
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
          <GridToolbarExport sx={{ fontSize: 15 }} />
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
      width: 180,
      valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY')
    },
    { field: 'supplierName', headerName: 'Supplier', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
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
      field: 'createdAt',
      headerName: 'Order Date',
      width: 180,
      valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY')
    },
    { field: 'customerName', headerName: 'Customer', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    {
      field: 'order_status',
      headerName: 'Status',
      width: 180,
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
          marginTop: '20px',
          backgroundColor: '#ffff',
          padding: '14px',
          borderRadius: '8px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h3">Product Details</Typography>

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

      <Box sx={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ marginBottom: 2, justifyItems: 'center' }}>
              <CardContent>
                {productData?.imageUrl ? (
                  <img src={productData.imageUrl} alt={productData.name} style={{ width: '465px', height: 'auto', borderRadius: '8px' }} />
                ) : (
                  <Typography>No image available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Name:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>
                          {productData?.productnm || 'NA'} ({productData?.product_no || 'NA'})
                        </strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Notes:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{productData?.notes || 'NA'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Category:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{productData?.categoryName || 'NA'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Unit:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{productData?.unitName || 'NA'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Quantity:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{productData?.quantity || 'NA'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Buying Price:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        {' '}
                        {currencySymbol} {productData?.buyingPrice || 'NA'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Selling Price:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        {' '}
                        {currencySymbol} {productData?.sellingPrice || 'NA'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Tax:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{productData?.tax || 'NA'}%</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Margin:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{productData?.margin || 'NA'}%</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Box>

        <TabContentCard>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="report tabs"
              textColor="primary"
              sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
            >
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
            <Box width="100%" overflow="hidden" sx={{ marginTop: '20px' }}>
              <Card style={{ height: '600px', paddingTop: '10px', overflow: 'hidden' }}>
                  <DataGrid
                    rows={filteredOrderData}
                    columns={orderColumns}
                    checkboxSelection
                    getRowId={(row) => row.id}
                    rowHeight={70}
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
            <Box width="100%" overflow="hidden" sx={{ marginTop: '20px' }}>
              <Card style={{ height: '600px', paddingTop: '10px', overflow: 'hidden' }}>
                  <DataGrid
                    rows={filteredPurchaseData}
                    columns={purchaseColumns}
                    checkboxSelection
                    getRowId={(row) => row.id}
                    rowHeight={70}
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
    </Container>
  );
};

export default ViewProductPage;
