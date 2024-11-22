import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Card, Box, MenuItem, Select, IconButton, FormControl } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import AddPurchases from './AddPurchase';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { deletePurchase, fetchPurchases } from 'apis/api.js';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCurrencySymbol } from 'apis/constant.js'; 

const Purchase = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [filteredPurchases, setFilteredPurchasers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const response = await fetchPurchases();
        setPurchaseDetails(response.data);
        setFilteredPurchasers(response.data);
      } catch (error) {
        console.error('Failed to fetch purchase data:', error);
        toast.error('Failed to fetch purchase data');
      }
    };
    loadPurchase();
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
      setFilteredPurchasers(purchaseDetails);
    } else {
      setFilteredPurchasers(purchaseDetails.filter((purchase) => purchase.status === status));
    }
  };

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
      flex: 1.5
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
          return `${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2.5,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <Box
            sx={{
              backgroundColor: 
              status === 'Completed' ? '#34a853' : 
              status === 'Pending' ? '#ff9800' : 
              status === 'Cancelled' ? '#f44336' : '',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              width: '125px',
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
          {params.row.status === 'Pending' && (
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
    navigate(`/dashboard/purchases/view-purchase/${_id}`);
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
        await deletePurchase(_id);
        setPurchaseDetails((prev) => prev.filter((purchase) => purchase._id !== _id));
        Swal.fire(
          "Deleted!", 
          "Your purchase has been deleted.", 
          "success"  
        );
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  return (
    <>
      <AddPurchases open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>
            Purchase Lists
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
            <Link to="/dashboard/purchases/add-purchase">
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Add Purchase
              </Button>
            </Link>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '5px', overflow: 'auto' }}>
              <DataGrid
                rows={filteredPurchases}
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

export default Purchase;
