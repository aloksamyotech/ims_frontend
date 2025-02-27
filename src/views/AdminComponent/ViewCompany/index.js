import React, { useState, useEffect } from 'react';
import { fetchPurchases, fetchOrders, fetchCategories, fetchCustomers, fetchSuppliers, fetchProducts } from 'apis/api.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from 'ui-component/TableStyle';
import {
  Box,
  Tabs,
  CardMedia,
  Grid,
  CardContent,
  Stack,
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
import { Link } from 'react-router-dom';
import { Container } from '@mui/system';
import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import HistoryIcon from '@mui/icons-material/History';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(2.4)
}));

const CompanyReport = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categories = await fetchCategories();
        const filteredCategories = categories?.data.filter((category) => category.userId === id);
        setCategories(filteredCategories);
        const products = await fetchProducts();
        const filteredProducts = products?.data.filter((product) => product?.userId === id);
        setProducts(filteredProducts);
        const customers = await fetchCustomers();
        const filteredCustomers = customers?.data.filter((customer) => customer.userId === id);
        setCustomers(filteredCustomers);
        const suppliers = await fetchSuppliers();
        const filteredSuppliers = suppliers?.data.filter((supplier) => supplier.userId === id);
        setSuppliers(filteredSuppliers);
        const orders = await fetchOrders();
        const filteredOrders = orders?.data.filter((order) => order.userId === id);
        setOrders(filteredOrders);
        const purchases = await fetchPurchases();
        const filteredPurchases = purchases?.data.filter((purchase) => purchase.userId === id);
        setPurchases(filteredPurchases);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };
    loadData();
  }, []);

  const categoryColumns = [
    { field: 'catnm', headerName: 'Category Name', flex: 0.4 },
    {
      field: 'desc',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => {
        return params.value ? params.value : 'No description added';
      }
    }
  ];

  const customerColumns = [
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'customernm',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row.customernm || 'N/A'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row.email || 'N/A'}
          </Typography>
        </Box>
      )
    },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'customerType',
      headerName: 'Type of Customer',
      flex: 1.5,
      valueGetter: (params) => {
        return params.row.isWholesale ? 'Wholesale' : 'Walk-in';
      },
      renderCell: (params) => {
        return (
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
              width: '90px',
              height: '20px',
              textTransform: 'uppercase',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              gap: '0.5rem',
              fontSize: '12px'
            }}
          >
            {params.value}
          </Box>
        );
      }
    }
  ];

  const supplierColumns = [
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 110,
      valueGetter: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'suppliernm',
      headerName: 'Name',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row.suppliernm}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row.email}
          </Typography>
        </Box>
      )
    },
    { field: 'phone', headerName: 'Phone', flex: 1.5, minWidth: 120 },
    { field: 'shopName', headerName: 'Shop Name', flex: 1.5, minWidth: 180 },
    {
      field: 'typeOfSupplier',
      headerName: 'Type Of Supplier',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        return (
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
              width: '93px',
              height: '20px',
              textTransform: 'uppercase',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              gap: '0.5rem',
              fontSize: '12px'
            }}
          >
            {params.value}
          </Box>
        );
      }
    }
  ];

  const orderColumns = [
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1.5,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice no',
      flex: 1.5
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 2.5,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row?.customerName || 'N/A'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.customerEmail}
          </Typography>
        </Box>
      )
    },
    {
      field: 'customerPhone',
      headerName: 'PhoneNo',
      flex: 2.5
    },
    {
      field: 'productName',
      headerName: 'Item',
      flex: 2,
      valueGetter: (params) => {
        if (params.row?.products?.length > 0) {
          return params.row.products?.map((product) => `${product?.productName}(${product?.quantity})`).join(', ');
        }
        return 'N/A';
      }
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      flex: 1.8,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'order_status',
      headerName: 'Status',
      flex: 2,
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
    }
  ];

  const purchaseColumns = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 2,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'purchase_no',
      headerName: 'Purchase no',
      flex: 2.2
    },
    {
      field: 'supplierName',
      headerName: 'Supplier',
      flex: 3.5,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row?.supplierName || 'N/A'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.supplierEmail}
          </Typography>
        </Box>
      )
    },
    {
      field: 'supplierPhone',
      headerName: 'PhoneNo',
      flex: 2
    },
    {
      field: 'productName',
      headerName: 'Item',
      flex: 2.5,
      valueGetter: (params) => {
        if (params.row?.products?.length > 0) {
          return params.row.products?.map((product) => `${product?.productName}(${product?.quantity})`).join(', ');
        }
        return 'N/A';
      }
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      flex: 2.2,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return `${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
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
    }
  ];

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
        <Typography variant="h4">View Company Details </Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/admin" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/company" color="inherit">
            <Typography color="text.primary">Company</Typography>
          </MuiLink>
          <Typography color="text.primary">View Company</Typography>
        </Breadcrumbs>
      </Box>

      <TabContentCard>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="product report tabs" sx={{ alignContent: 'center' }}>
          <Tab
            icon={<CategoryIcon />}
            iconPosition="start"
            label="Category"
            sx={{
              fontSize: '12px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<AddShoppingCartIcon />}
            iconPosition="start"
            label="Product"
            sx={{
              fontSize: '12px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 1 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<PersonIcon />}
            iconPosition="start"
            label="Customer"
            sx={{
              fontSize: '12px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 2 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<LocalShippingIcon />}
            iconPosition="start"
            label="Supplier"
            sx={{
              fontSize: '12px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 3 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<ShoppingCartCheckoutIcon />}
            iconPosition="start"
            label="Order"
            sx={{
              fontSize: '12px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 4 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<HistoryIcon />}
            iconPosition="start"
            label="Purchase"
            sx={{
              fontSize: '12px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 5 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        <Divider sx={{ opacity: 1 }} />

        {selectedTab === 0 && (
          <Box>
            <TableStyle>
              <Box width="100%">
                <Card style={{ height: '600px', padding: '0 5px' }}>
                  <DataGrid
                    rows={categories}
                    columns={categoryColumns}
                    getRowId={(row) => row._id}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10, page: 0 }
                      }
                    }}
                    pagination
                    sx={{
                      '& .MuiDataGrid-row': {
                        borderBottom: '1px solid #ccc'
                      },
                      '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </Card>
              </Box>
            </TableStyle>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ padding: '8px 20px', margin: '10px', height: '600px' }}>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      position: 'relative',
                      height: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.imageUrl ||
                        'https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
                      }
                      alt={product.productnm}
                      sx={{ height: 120, objectFit: 'fill' }}
                    />

                    <CardContent>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h5" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                          {product.productnm}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="body2">{product.categoryName}</Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                        <Typography variant="body2">Quantity: &nbsp; </Typography>
                        <Box
                          sx={{
                            border: '1px solid',
                            borderColor: product.quantity > 5 ? 'green' : 'red',
                            padding: '2px 5px',
                            borderRadius: '5px'
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold' }}>{product.quantity}</Typography>
                        </Box>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                        <Typography variant="body2">
                          Selling Price: &nbsp; {currencySymbol} {product.sellingPrice}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" mt={1} mb={2}>
                        <Typography variant="body2">
                          Buying Price: &nbsp; {currencySymbol} {product.buyingPrice}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {selectedTab === 2 && (
          <TableStyle>
            <Box width="100%">
              <Card style={{ height: '600px', padding: '0 5px' }}>
                <DataGrid
                  rows={customers}
                  columns={customerColumns}
                  rowHeight={55}
                  getRowId={(row) => row._id}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }
                    }
                  }}
                  pagination
                  sx={{
                    '& .MuiDataGrid-row': {
                      borderBottom: '1px solid #ccc'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Card>
            </Box>
          </TableStyle>
        )}

        {selectedTab === 3 && (
          <TableStyle>
            <Box width="100%">
              <Card style={{ height: '600px', padding: '0 5px' }}>
                <DataGrid
                  rows={suppliers}
                  columns={supplierColumns}
                  rowHeight={55}
                  getRowId={(row) => row._id}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }
                    }
                  }}
                  pagination
                  sx={{
                    '& .MuiDataGrid-row': {
                      borderBottom: '1px solid #ccc'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Card>
            </Box>
          </TableStyle>
        )}

        {selectedTab === 4 && (
          <TableStyle>
            <Box width="100%">
              <Card style={{ height: '600px', padding: '0 5px' }}>
                <DataGrid
                  rows={orders}
                  columns={orderColumns}
                  rowHeight={55}
                  getRowId={(row) => row._id}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }
                    }
                  }}
                  pagination
                  sx={{
                    '& .MuiDataGrid-row': {
                      borderBottom: '1px solid #ccc'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Card>
            </Box>
          </TableStyle>
        )}

        {selectedTab === 5 && (
          <TableStyle>
            <Box width="100%">
              <Card style={{ height: '600px', padding: '0 5px' }}>
                <DataGrid
                  rows={purchases}
                  columns={purchaseColumns}
                  rowHeight={55}
                  getRowId={(row) => row._id}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }
                    }
                  }}
                  pagination
                  sx={{
                    '& .MuiDataGrid-row': {
                      borderBottom: '1px solid #ccc'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Card>
            </Box>
          </TableStyle>
        )}
      </TabContentCard>
    </Grid>
  );
};

export default CompanyReport;
