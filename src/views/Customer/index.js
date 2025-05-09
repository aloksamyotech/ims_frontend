import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Grid, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddCustomer from './AddCustomers.js';
import UpdateCustomer from './updateCustomer.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from 'confirmDeletion/deletion';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { deleteCustomer, fetchCustomers } from 'apis/api.js';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { getUserId } from 'apis/constant.js';

const Customer = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpenDialog = (_id) => {
    setSelectedId(_id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const loadCustomers = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.log('User ID is missing');
        setLoading(false);
        return;
      }
      const response = await fetchCustomers({ userId });
      setCustomerData(response?.data);
    } catch (error) {
      console.error('Failed to fetch or no customers');
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const CustomToolbar = ({ handleOpenAdd }) => {
    return (
      <GridToolbarContainer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px'
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
          <GridToolbarExport style={{ fontSize: 14 }} />
          <Tooltip title="Add Customer" arrow>
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
      field: 'customernm',
      headerName: 'Name',
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row.customernm || 'N/A'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row.email || 'N/A'}
          </Typography>
        </Box>
      )
    },
    { field: 'phone', headerName: 'Phone', flex: 1.5 },
    {
      field: 'customerType',
      headerName: 'Type of Customer',
      flex: 1.5,
      minWidth: 150,
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
    },
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
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row">
          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
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
              <VisibilityIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              color="secondary"
              sx={{
                '&:hover': {
                  backgroundColor: '#d7cde6',
                  color: '#512995'
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(params.row?._id)}
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
        </Stack>
      )
    }
  ];

  const handleOpenAdd = () => {
    setCurrentCustomer(null);
    setOpenAdd(true);
  };

  const handleView = (_id) => {
    navigate(`/dashboard/customers/view-customer/${_id}`);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setOpenUpdate(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(selectedId);
      setCustomerData((prev) => prev.filter((customer) => customer?._id !== selectedId));
      toast.success("Deleted successfully!");
      loadCustomers();
    } catch (error) {
      console.error('Error deleting subscription:', error);
    } finally {
      handleCloseDialog();
    }
  };

  const handleCustomerAdded = (newcustomer) => {
    setCustomerData((prev) => [...prev, newcustomer]);
    setOpenAdd(false);
    loadCustomers();
  };

  const handleCustomerUpdated = (updatedcustomer) => {
    setCustomerData((prev) => prev.map((customer) => (customer._id === updatedcustomer._id ? updatedcustomer : customer)));
    setOpenUpdate(false);
    loadCustomers();
  };

  return (
    <>
      <ConfirmDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleDelete} />
      <AddCustomer open={openAdd} handleClose={() => setOpenAdd(false)} onCustomerAdded={handleCustomerAdded} />
      <UpdateCustomer
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        customer={currentCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />

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
          <Typography variant="h4">Customers List</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Clients</Typography>
            <Typography color="text.primary">Customers</Typography>
          </Breadcrumbs>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', marginTop: '20px', padding: '0 5px' }}>
              <DataGrid
                rows={customerData}
                columns={columns}
                rowHeight={55}
                getRowId={(row) => row._id}
                components={{
                  Toolbar: () => <CustomToolbar handleOpenAdd={handleOpenAdd} />
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
      </Grid>
    </>
  );
};

export default Customer;
