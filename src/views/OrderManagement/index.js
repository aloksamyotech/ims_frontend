import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Card, Box, IconButton } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import AddOrders from './AddOrder.js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteOrder, fetchOrders } from 'apis/api.js';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const Order = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrders();
        setOrderDetails(response.data);
        console.log('Invoice data:', response.data);
      } catch (error) {
        console.error('Failed to fetch orders data:', error);
        toast.error('Failed to fetch orders data');
      }
    };
    loadOrders();
  }, []);

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
      flex: 1.2,
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
          return params.row.products
            .map((product) => `${product.productName}(${product.quantity})`)
            .join(', ');
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
              status === 'Completed' 
                ? '#4CAF50' 
                : status === 'Pending' 
                ? '#d91656'
                : '#D32F2F',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: 1,
            width: '150px', 
            height: '40px', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold', 
          }}
        >
          {status}  
        </Box>
        
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
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
          <Box
            sx={{
              backgroundColor: '#ffebee',
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8 px',
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
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(_id);
        setOrderDetails((prev) => prev.filter(order => order._id !== _id));
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Failed to delete order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  return (
    <>
      <AddOrders open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>
            Orders List
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Link to="/dashboard/orders/add-order">
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Add Order
              </Button>
            </Link>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '15px' , overflow : 'auto' }}>
              <DataGrid
                rows={orderDetails}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{ Toolbar: GridToolbar }}
                stickyHeader
                style={{ minWidth: '800px' }} 
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Order;
