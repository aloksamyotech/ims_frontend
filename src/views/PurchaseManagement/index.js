import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Card, Box, IconButton } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import AddPurchases from './AddPurchase';
import { Link , useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import {  deletePurchase, fetchPurchases } from 'apis/api.js';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const Purchase = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState([]);

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const response = await fetchPurchases();
        setPurchaseDetails(response.data);
        console.log('Purchase data', response.data);
      } catch (error) {
        console.error('Failed to fetch purchase data:', error);
        toast.error('Failed to fetch purchase data');
      }
    };
    loadPurchase();
  }, []);

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1.5,
      valueGetter: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'purchase_no',
      headerName: 'Purchase no',
      flex: 1.5,
    },
    {
      field: 'supplierName',
      headerName: 'Supplier',
      flex: 2,
      minWidth: 100,
      valueGetter: (params) => params.row.supplierName || 'N/A'
    },
    {
      field: 'productName',
      headerName: 'Item',
      flex: 3.5,
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
      field: 'status',
      headerName: 'Status',
      flex: 2,
      renderCell: (params) => {
        const status = params.row.status; 
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
    navigate(`/dashboard/purchases/view-purchase/${_id}`); 
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await deletePurchase(_id);
        setPurchaseDetails((prev) => prev.filter(purchase => purchase._id !== _id));
        toast.success('Purchase deleted successfully');
      } catch (error) {
        console.error('Failed to delete purchase:', error);
        toast.error('Failed to delete purchase');
      }
    }
  };

  return (
    <>
      <AddPurchases open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>
            Purchases List
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Link to="/dashboard/purchases/add-purchase">
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Add Purchase
              </Button>
            </Link>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '15px' , overflow : 'auto' }}>
              <DataGrid
                rows={purchaseDetails}
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

export default Purchase;
