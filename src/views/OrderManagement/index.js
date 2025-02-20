import { useState, useEffect } from 'react';
import {
  Stack,
  Grid,
  Typography,
  Box,
  Card,
  MenuItem,
  Breadcrumbs,
  Tooltip,
  Link as MuiLink,
  Select,
  IconButton,
  FormControl,
  Button
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import AddOrders from './AddOrder.js';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { deleteOrder, fetchOrders } from 'apis/api.js';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';

const Order = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [currencySymbol, setCurrencySymbol] = useState('');

  const loadOrders = async () => {
    try {
      const userId = getUserId();
      const response = await fetchOrders({ userId });
      const rows = response?.data?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setOrderDetails(rows);
      setFilteredOrders(rows);
    } catch (error) {
      console.error('Failed to fetch orders data');
    }
  };
  useEffect(() => {
    loadOrders();
  }, []);

  const getCurrency = async () => {
    const symbol = await fetchCurrencySymbol();
    setCurrencySymbol(symbol);
  };
  useEffect(() => {
    getCurrency();
  }, []);

  const handleFilterChange = (event) => {
    const status = event.target.value;
    setFilterStatus(status);
    if (status === 'All') {
      setFilteredOrders(orderDetails);
    } else {
      setFilteredOrders(orderDetails.filter((order) => order?.order_status === status));
    }
  };

  const CustomToolbar = ({ handleOpenAdd, filterStatus, handleFilterChange }) => {
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
              value={filterStatus}
              onChange={handleFilterChange}
              sx={{
                width: '120px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#ffffff'
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Add Order" arrow>
            <IconButton
              onClick={handleOpenAdd}
              sx={{
                backgroundColor: '#1e88e5',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 3,
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  color: '#ffffff'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </GridToolbarContainer>
    );
  };

  const columns = [
    {
      field: 'index',
      headerName: '#',
      flex: 0.3
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 1.5,
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
      headerName: 'Number',
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
      field: 'invoice_no',
      headerName: 'Invoice no',
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
      field: 'productName',
      headerName: 'Item',
      headerAlign: 'center',
      flex: 1,
      valueGetter: (params) => {
        if (params.row?.products?.length > 0) {
          return params.row.products?.map((product) => `${product?.productName}(${product?.quantity})`).join(', ');
        }
        return 'N/A';
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'><Typography textAlign='center'>{(params?.value?.length > 14) ? params?.value?.substr(0, 14) + "..." : params?.value}</Typography></Typography>
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
      field: 'createdAt',
      headerName: 'Date',
      headerAlign: 'center',
      flex: 1,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>,

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
                backgroundColor: (params?.value) === 'pending' ? '#fff8e1' : ((params?.value) === 'completed' ? '#b9f6ca' : '#fbe9e7'), boxShadow: 'none', borderRadius: '10px', padding: '0px', paddingX: '10px', fontWeight: '400',
                '&:hover': {
                  color: (params?.value) === 'pending' ? '#ffc107' : ((params?.value) === 'completed' ? '#00c853' : '#d84315'),
                  backgroundColor: (params?.value) === 'pending' ? '#fff8e1' : ((params?.value) === 'completed' ? '#b9f6ca' : '#fbe9e7'), boxShadow: 'none'
                }
              }}>{params?.value}</Button>
          </Grid>
        </Grid >
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row">
          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleView(params.row?._id)}
              color="primary"
              sx={{
                '&:hover': {
                  backgroundColor: '#9abfdd',
                  color: '#1976d2'
                }
              }}
            >
              <VisibilityIcon />{' '}
            </IconButton>
          </Box>
          {params.row.order_status === 'completed' && (
            <Box
              sx={{
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px'
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleDownload(params.row?._id)}
                color="secondary"
                sx={{
                  '&:hover': {
                    backgroundColor: '#d7cde6',
                    color: '#512995'
                  }
                }}
              >
                <Iconify icon="eva:download-fill" />
              </IconButton>
            </Box>
          )}
          {(params.row.order_status === 'pending' || params.row.order_status === 'cancelled') && (
            <Box
              sx={{
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px'
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row?._id)}
                color="error"
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffcccc',
                    color: '#d32f2f'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Stack>
      )
    }
  ];

  const handleView = (_id) => {
    navigate(`/dashboard/orders/view-order/${_id}`);
  };

  const handleDownload = (_id) => {
    navigate(`/dashboard/orders/download-invoice/${_id}`);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleDelete = async (_id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      if (result.isConfirmed) {
        await deleteOrder(_id);
        setOrderDetails((prev) => prev.filter((order) => order?._id !== _id));
        Swal.fire('Deleted!', 'Your order has been deleted.', 'success');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <>
      <AddOrders open={openAdd} handleClose={handleCloseAdd} />
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
          <Typography variant="h4">Order Lists</Typography>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Orders</Typography>
          </Breadcrumbs>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', marginTop: '20px', padding: '0 5px' }}>
              <DataGrid
                rows={filteredOrders}
                columns={columns}
                getRowId={(row) => row._id}
                rowHeight={55}
                components={{
                  Toolbar: () => (
                    <CustomToolbar
                      handleOpenAdd={() => navigate('/dashboard/orders/add-order')}
                      filterStatus={filterStatus}
                      handleFilterChange={handleFilterChange}
                    />
                  )
                }}
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
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#eeeeee',
                  },
                }}
              />
            </Card>
          </Box>
        </TableStyle>
      </Grid>
    </>
  );
};

export default Order;
