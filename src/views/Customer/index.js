import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Grid, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddCustomer from './AddCustomers.js';
import UpdateCustomer from './updateCustomer.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
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

  const loadCustomers = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.log('User ID is missing');
        setLoading(false);
        return;
      }
      const response = await fetchCustomers({ userId });
      const rows = response?.data?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setCustomerData(rows);
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
      field: 'index',
      headerName: '#',
      flex: 0.3
    },
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
    {
      field: 'phone',
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
      field: 'createdAt',
      headerName: 'Created At',
      headerAlign: 'center',
      flex: 1,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      },
      renderCell: (params) => {
        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography textAlign='center'>{params?.formattedValue}</Typography>
            </Grid>
          </Grid>
        );
      }
    },
    {
      field: 'customerType',
      headerName: 'Type of Customer',
      headerAlign: 'center',
      flex: 1,
      valueGetter: (params) => {
        return params.row.isWholesale ? 'Wholesale' : 'Walk-in';
      },
      renderCell: (params) => {
        return (
          <Grid container>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' size='small' sx={{ borderRadius: '20px', color: '#2194f3', bgcolor: '#e3f2fd', boxShadow: 'none', '&:hover': { color: '#2194f3', bgcolor: '#e3f2fd', boxShadow: 'none' } }}>{params?.formattedValue}</Button>
            </Grid>
          </Grid>
        );
      }
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
        await deleteCustomer(_id);
        setCustomerData((prev) => prev.filter((customer) => customer?._id !== _id));
        loadCustomers();
        Swal.fire('Deleted!', 'Your customer has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
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

export default Customer;
