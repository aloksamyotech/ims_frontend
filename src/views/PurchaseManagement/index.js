import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  MenuItem,
  Breadcrumbs,
  Tooltip,
  Link as MuiLink,
  Select,
  IconButton,
  FormControl,
  styled
} from '@mui/material';
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
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';

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
        setPurchaseDetails(response?.data);
        setFilteredPurchasers(response?.data);
      } catch (error) {
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
      setFilteredPurchasers(purchaseDetails.filter((purchase) => purchase?.status === status));
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

          <Tooltip title="Add Purchase" arrow>
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
      flex: 1.5,
      minWidth:200,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row?.supplierName || 'N/A'}</Typography>
          <Typography variant="body2" color="textSecondary">{params.row?.supplierEmail}</Typography>
        </Box>
      )
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
      flex: 2.5,
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
        const status = params.row?.status;
        return (
          <Box
          sx={{
            backgroundColor: status === 'completed' ? '#d5fadf' : status === 'pending' ? '#f8e1a1' : status === 'cancelled' ? '#fbe9e7' : '',
            color: status === 'completed' ? '#19ab53' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
            '&:hover': {
              backgroundColor: status === 'completed' ? '#19ab53' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
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
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
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
            <IconButton size="small" onClick={() => handleView(params.row?._id)} color="primary" 
             sx={{
              '&:hover': {
                backgroundColor: '#9abfdd', 
                color: '#1976d2' 
              }
            }}>
              <VisibilityIcon />{' '}
            </IconButton>
          </Box>
          {(params.row.status === 'pending' || params.row.status === 'cancelled') && (
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
              <IconButton size="small" onClick={() => handleDelete(params.row?._id)} color="error"
               sx={{
                '&:hover': {
                  backgroundColor: '#ffcccc',
                  color: '#d32f2f'
                }
              }}>
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
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      if (result.isConfirmed) {
        await deletePurchase(_id);
        setPurchaseDetails((prev) => prev.filter((purchase) => purchase?._id !== _id));
        Swal.fire('Deleted!', 'Your purchase has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  return (
    <>
      <AddPurchases open={openAdd} handleClose={handleCloseAdd} />
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
          <Typography variant="h4">Purchase Lists</Typography>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Purchases</Typography>
          </Breadcrumbs>
        </Box>

        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '5px', marginTop: '25px', overflow: 'auto' }}>
            <DataGrid
              rows={filteredPurchases}
              columns={columns}
              checkboxSelection
              rowHeight={70}
              getRowId={(row) => row._id}
              components={{
                Toolbar: () => (
                  <CustomToolbar
                    handleOpenAdd={() => navigate('/dashboard/purchases/add-purchase')}
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

export default Purchase;
