import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, CardContent, Divider, Container, Breadcrumbs, Link as MuiLink, Button, Stack } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { fetchOrders } from 'apis/api.js';
import { fetchCurrencySymbol } from 'apis/constant.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

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
      <Box>
        <Typography variant="h4" style={{ fontWeight: 'bold' }}>
          Order List
        </Typography>
      </Box>

      <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <GridToolbarExport style={{ fontSize: 14 }} />
      </Box>
    </GridToolbarContainer>
  );
};

const ViewCustomerPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/customer/fetchById/${id}`);
        setCustomerData(response?.data);
        const result = await fetchOrders();
        setOrderDetails(result?.data);
      } catch (error) {
        toast.error('Error fetching customer data');
      }
    };
    loadCustomer();
  }, [id]);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 120,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'order_status',
      headerName: 'Status',
      width: 150,
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
      field: 'productName',
      headerName: 'Product Name',
      width: 200,
      renderCell: (params) => {
        const products = params.row?.products || [];
        return (
          <div>
            {products.map((product, index) => (
              <div key={index}>
                <Typography variant="body2">{product.productName}</Typography>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      field: 'categoryName',
      headerName: 'Product Category',
      width: 180,
      renderCell: (params) => {
        const products = params.row?.products || [];
        return (
          <div>
            {products.map((product, index) => (
              <div key={index}>
                <Typography variant="body2">{product.categoryName}</Typography>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      renderCell: (params) => {
        const products = params.row?.products || [];
        return (
          <div>
            {products.map((product, index) => (
              <div key={index}>
                <Typography variant="body2">{product.quantity}</Typography>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 120,
      valueFormatter: ({ value }) => (value ? `${currencySymbol} ${value.toLocaleString()}` : `${currencySymbol} 0`)
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 120,
      valueFormatter: ({ value }) => (value ? `${currencySymbol} ${value.toLocaleString()}` : `${currencySymbol} 0`)
    },
    {
      field: 'total',
      headerName: 'Total Sales',
      width: 150,
      valueFormatter: ({ value }) => (value ? `${currencySymbol} ${value.toLocaleString()}` : `${currencySymbol} 0`)
    }
  ];

  const filteredOrders = orderDetails.filter((order) => order.customerId === customerData?._id);

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
        <Typography variant="h3">Customer Details</Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/customers" color="inherit">
            <Typography color="text.primary">Customers</Typography>
          </MuiLink>
          <Typography color="text.primary">ViewCustomer</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ marginTop: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
          <Card style={{ boxShadow: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h4">
                          <strong>{customerData?.customernm || 'NA'}</strong>
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Email:</strong> {customerData?.email || 'NA'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Phone:</strong> {customerData?.phone || 'NA'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Address:</strong> {customerData?.address || 'NA'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Type of Customer:</strong> {customerData?.isWholesale ? 'Wholesale' : 'Walk-in'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Bank Name:</strong> {customerData?.bankName || 'NA'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Account Holder:</strong> {customerData?.accountHolder || 'NA'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Account Number:</strong>{customerData?.accountNumber || 'NA'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          <strong>Created At:</strong> {moment(customerData?.createdAt).format('DD-MM-YYYY')}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        <Grid item xs={12}>
          <Card style={{ height: '600px', overflow: 'hidden', marginTop: '5px', boxShadow: 3,
             padding: '20px', }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row._id}
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
                '& .MuiDataGrid-root': {
                  border: 'none'
                },
                '& .MuiDataGrid-row': {
                  borderBottom: '1px solid #ccc'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                }
              }}
            />
          </Card>
        </Grid>

      </Card>
    </Container>
  );
};

export default ViewCustomerPage;
