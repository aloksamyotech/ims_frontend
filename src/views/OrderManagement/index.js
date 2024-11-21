import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Card, Box, MenuItem, Select, IconButton, FormControl } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import AddOrders from './AddOrder.js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { deleteOrder, fetchOrders } from 'apis/api.js';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const Order = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrders();
        setOrderDetails(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders data:', error);
        toast.error('Failed to fetch orders data');
      }
    };
    loadOrders();
  }, []);

  const handleFilterChange = (event) => {
    const status = event.target.value;
    setFilterStatus(status);
    if (status === 'All') {
      setFilteredOrders(orderDetails);
    } else {
      setFilteredOrders(orderDetails.filter((order) => order.order_status === status));
    }
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1.2,
      valueGetter: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY');
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
      valueGetter: (params) => params.row.customerName || 'N/A'
    },
    {
      field: 'productName',
      headerName: 'Item',
      flex: 3,
      valueGetter: (params) => {
        if (params.row.products && params.row.products.length > 0) {
          return params.row.products.map((product) => `${product.productName}(${product.quantity})`).join(', ');
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
          return `$${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'order_status',
      headerName: 'Status',
      flex: 2,
      renderCell: (params) => {
        const status = params.row.order_status;
        return (
          <Box
            sx={{
              backgroundColor: 
              status === 'Completed' ? '#34a853' : 
              status === 'Pending' ? '#ff9800' : 
              status === 'Cancelled' ? '#f44336' : '',
              color: status === 'Completed' ? 'white' : 'white',
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
            <IconButton size="small" onClick={() => handleView(params.row._id)} color="primary" sx={{ padding: 0 }}>
              <VisibilityIcon />{' '}
            </IconButton>
          </Box>
          {params.row.order_status === 'Completed' && (
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
              <IconButton size="small" onClick={() => handleDownload(params.row._id)} color="secondary" sx={{ padding: 0 }}>
                <Iconify icon="eva:download-fill" />
              </IconButton>
            </Box>
          )}
          {params.row.order_status === 'Pending' && (
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
              <IconButton size="small" onClick={() => handleDelete(params.row._id)} color="error">
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
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await deleteOrder(_id);
        setOrderDetails((prev) => prev.filter((order) => order._id !== _id));
        Swal.fire(
          "Deleted!", 
          "Your order has been deleted.", 
          "success"  
        );
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <>
      <AddOrders open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>
            Order Lists
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2} marginTop={3}>
            <FormControl>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                sx={{
                  width: '140px',
                  height: '40px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Link to="/dashboard/orders/add-order">
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Add Order
              </Button>
            </Link>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '5px', overflow: 'auto' }}>
              <DataGrid
                rows={filteredOrders}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{ toolbar: { showQuickFilter: true } }}
                stickyHeader
                style={{ minWidth: '800px' }}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 }, 
                  },
                }}
                pagination
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Order;
