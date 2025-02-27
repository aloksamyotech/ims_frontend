import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, CardContent, Breadcrumbs, Link as MuiLink, Button, Stack } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { fetchPurchases, fetchSupplierById } from 'apis/api.js';
import { fetchCurrencySymbol } from 'apis/constant.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { getUserId } from 'apis/constant.js';

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
          Purchase List
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

const ViewSupplierPage = () => {
  const { id } = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [supplierData, setSupplierData] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        const userId = getUserId();
        const response = await fetchSupplierById(id);
        setSupplierData(response?.data);
        const result = await fetchPurchases({userId});
        const allPurchases = result?.data;
        setPurchaseDetails(allPurchases);
      } catch (error) {
        console.error('Error fetching supplier data');
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

  const filteredPurchases = purchaseDetails.filter((purchase) => purchase?.supplierId === supplierData?._id);

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
        <Typography variant="h4">Supplier Details</Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/suppliers" color="inherit">
            <Typography color="text.primary">Suppliers</Typography>
          </MuiLink>
          <Typography color="text.primary">ViewSupplier</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ marginTop: '20px' }}>
            <Card style={{ margin: '20px' }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h4">
                        <strong> {supplierData?.suppliernm || 'NA'} </strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Email:</strong> {supplierData?.email || 'NA'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Phone:</strong> {supplierData?.phone || 'NA'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Address:</strong> {supplierData?.address || 'NA'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex' }}>
                      <Typography variant="body1">
                        <strong>Type of Supplier:</strong>&nbsp;&nbsp;
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#2196f3',
                          padding: '1px',
                          borderRadius: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          width: '100px',
                          height: '20px',
                          textTransform: 'uppercase',
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                          gap: '0.5rem',
                          fontSize: '12px'
                        }}
                      >
                        {supplierData?.typeOfSupplier || 'NA'}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Shop Name:</strong> {supplierData?.shopName || 'NA'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Created At:</strong> {moment(supplierData?.createdAt).format('DD-MM-YYYY')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

        <Grid item xs={12}>
          <Box style={{ height: '600px', margin: '12px' }}>
            <DataGrid
              rows={filteredPurchases}
              columns={columns}
              getRowId={(row) => row._id}
              rowHeight={55}
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
          </Box>
        </Grid>
      </Card>
    </Grid>
  );
};

export default ViewSupplierPage;
