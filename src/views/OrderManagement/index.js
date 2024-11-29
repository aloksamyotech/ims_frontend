import { useState, useEffect } from 'react';
import {
  Stack,
  Container,
  Typography,
  Box,
  Card,
  MenuItem,
  Breadcrumbs,
  Tooltip,
  Link as MuiLink,
  Select,
  IconButton,
  FormControl
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
import { fetchCurrencySymbol } from 'apis/constant.js';
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

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrders();
        setOrderDetails(response?.data);
        setFilteredOrders(response?.data);
      } catch (error) {
        toast.error('Failed to fetch orders data');
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
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
      field: 'createdAt',
      headerName: 'Date',
      flex: 1.2,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice no',
      flex: 1.2
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      flex: 2,
      minWidth: 100,
      valueGetter: (params) => params.row?.customerName || 'N/A',
      sortable: true
    },
    {
      field: 'productName',
      headerName: 'Item',
      flex: 3,
      valueGetter: (params) => {
        if (params.row?.products?.length > 0) {
          return params.row.products?.map((product) => `${product?.productName}(${product?.quantity})`).join(', ');
        }
        return 'N/A';
      }
    },
    {
      field: 'total',
      headerName: 'Total Price',
      flex: 1.5,
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
                status === 'completed' ? '#34a853' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
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
              fontSize: '12px'
            }}
          >
            {status}
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              padding: '8px',
              '&:hover': { backgroundColor: '#bbdefb' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton size="small" onClick={() => handleView(params.row?._id)} color="primary" sx={{ padding: 0 }}>
              <VisibilityIcon />{' '}
            </IconButton>
          </Box>
          {params.row.order_status === 'completed' && (
            <Box
              sx={{
                backgroundColor: '#ede7f6',
                borderRadius: '8px',
                padding: '8px',
                '&:hover': { backgroundColor: '#a695c9' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px'
              }}
            >
              <IconButton size="small" onClick={() => handleDownload(params.row?._id)} color="secondary" sx={{ padding: 0 }}>
                <Iconify icon="eva:download-fill" />
              </IconButton>
            </Box>
          )}
          {(params.row.order_status === 'pending' || params.row.order_status === 'cancelled') && (
            <Box
              sx={{
                backgroundColor: '#ffebee',
                borderRadius: '8px',
                padding: '8px',
                '&:hover': { backgroundColor: '#ef9a9a' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px'
              }}
            >
              <IconButton size="small" onClick={() => handleDelete(params.row?._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Stack>
      )
    }
  ];

  const handleView = (_id) => {
    navigate(`/dashboard/orders/view-invoice/${_id}`);
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
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <>
      <AddOrders open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Box
          sx={{
            marginTop: '20px',
            backgroundColor: '#ffff',
            padding: '14px',
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h3">Order Lists</Typography>

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
          <Box width="100%" overflow="hidden">
            <Card style={{ height: 'auto', paddingTop: '5px', marginTop: '25px', overflow: 'auto' }}>
              <DataGrid
                rows={filteredOrders}
                columns={columns}
                getRowId={(row) => row._id}
                checkboxSelection
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
                  }
                }}
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Order;
