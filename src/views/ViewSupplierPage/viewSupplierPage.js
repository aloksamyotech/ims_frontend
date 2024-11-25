import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, CardContent, Divider, Container, Button, Stack } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { fetchPurchases } from 'apis/api.js';
import { fetchCurrencySymbol } from 'apis/constant.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { filter } from 'lodash';

const ViewSupplierPage = () => {
  const { id } = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [supplierData, setSupplierData] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/supplier/fetchById/${id}`);
        setSupplierData(response?.data);
        const result = await fetchPurchases();
        setPurchaseDetails(result?.data);
      } catch (error) {
        toast.error('Error fetching supplier data');
      }
    };
    loadSupplier();
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
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const status = params.row?.status;
        return (
          <Box
            sx={{
              backgroundColor:
                status === 'completed'
                  ? '#34a853'
                  : status === 'pending'
                  ? '#ff9800'
                  : status === 'cancelled'
                  ? '#f44336'
                  : '',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              width: '110px',
              height: '25px',
              textTransform: 'uppercase',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              gap: '0.5rem',
              fontSize: '12px',
            }}
          >
            {status}
          </Box>
        );
      },
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
      },
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
      },
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
      },
    },    
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 120,
      valueFormatter: ({ value }) => (value ? `${currencySymbol} ${value.toLocaleString()}` : `${currencySymbol} 0`),
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 120,
      valueFormatter: ({ value }) => (value ? `${currencySymbol} ${value.toLocaleString()}` : `${currencySymbol} 0`),
    },
    {
      field: 'total',
      headerName: 'Total Sales',
      width: 150,
      valueFormatter: ({ value }) => (value ? `${currencySymbol} ${value.toLocaleString()}` : `${currencySymbol} 0`),
    },
  ];
  
  const filteredPurchases = purchaseDetails.filter((purchase) => purchase?.supplierId === supplierData?._id);

  return (
    <Container>
    <Link to="/dashboard/suppliers">
      <Button sx={{ marginTop: '18px' }} variant="contained" color="primary" startIcon={<ArrowBackIcon />}>
      </Button>
    </Link>
    <Box sx={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ borderRadius: 1, marginBottom: 1 }}>
                <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
                  Supplier Details
                </Typography>
              </Box>
              <Divider sx={{ marginY: 2, borderColor: 'gray', borderWidth: 1 }} />
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
                      <strong>{supplierData?.suppliernm || 'NA'}</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Email:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.email || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Phone:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.phone || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Address:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.address || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Type:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.typeOfSupplier || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Shop Name:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1"> {supplierData?.shopName || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Created At:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{moment(supplierData?.createdAt).format('DD-MM-YYYY')}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" alignItems="center" mb={3} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={2}>
            Purchases List
          </Typography>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                <DataGrid
                  rows={filteredPurchases}
                  columns={columns}
                  checkboxSelection
                  getRowId={(row) => row._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  stickyHeader
                  style={{ minWidth: '800px' }}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }
                    }
                  }}
                  pagination
                />
              </div>
            </Card>
          </Box>
        </TableStyle>
      </Box>
    </Container>
  );
};

export default ViewSupplierPage;
