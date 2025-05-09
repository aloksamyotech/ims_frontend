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
import { fetchPurchases, fetchOrders, fetchProductById } from 'apis/api.js';
import { fetchCurrencySymbol , getUserId } from 'apis/constant.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Container } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const TabContentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius:8,
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

  useEffect(() => {
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

  const filterDataByDate = (data, filter) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return data.filter((report) => {
      const reportDate = new Date(report?.createdAt);
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
              padding: '1px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              width: '90px',
              height: '20px',
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
            padding: '1px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            width: '90px',
            height: '20px',
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

  const filteredOrderData = filterDataByDate(formattedOrderData , selectedDateRange);
  const filteredPurchaseData = filterDataByDate(formattedPurchaseData, selectedDateRange);

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
        <Box sx={{ margin:'10px',display: 'flex', justifyContent: 'center', width: '98%',padding:'10px' }}>
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
                  style={{ borderRadius: '12px', objectFit: 'fill', maxWidth: '250px' }}
                />
              ) : (
               <Typography>No image available</Typography>
              )}
            </Box>

            <Box sx={{ flex: 2, padding: 3,marginLeft:'10px' }}>
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

       <Divider/>

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
              <Card style={{ height: '600px'}}>
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
                    border: 0
                  }}
                />
              </Card>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box width="100%" overflow="hidden">
              <Card style={{ height: '600px'}}>
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
