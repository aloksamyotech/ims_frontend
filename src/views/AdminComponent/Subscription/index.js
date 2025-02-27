import { useState, useEffect } from 'react';
import { Stack, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Grid, Typography, Card, Box, Dialog } from '@mui/material';
import TableStyle from 'ui-component/TableStyle.js';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddSubscription from './subscription.js';
import UpdateSubscription from './updateSubscription.js';
import ViewSubscription from './viewSubscription.js';
import { deleteSubscription, fetchSubscription } from 'apis/api.js';
import { fetchCurrencySymbol } from 'apis/constant.js';
import Swal from 'sweetalert2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Subscription = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [subscription, setSubscription] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetchSubscription();
        if (response?.data?.length > 0) {
          setSubscription(response?.data);
        } else {
          console.warn('No subscription found');
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };
    loadSubscription();
  }, []);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const CustomToolbar = ({ handleOpenAdd }) => {
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
          <GridToolbarExport style={{ fontSize: 14 }} />
          <Tooltip title="Add Subscription" arrow>
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
      flex: 1,
      valueGetter: (params) => {
        return moment(params.row?.createdAt).format('DD-MM-YYYY');
      }
    },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'noOfDays', headerName: 'No of Days', flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return `${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    { field: 'discount', headerName: 'Discount', flex: 1 },
    { field: 'desc', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
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
              onClick={() => handleView(params.row)}
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
    setCurrentSubscription(null);
    setOpenAdd(true);
  };

  const handleView = (subscription) => {
    setCurrentSubscription(subscription);
    setOpenView(true);
  };

  const handleEdit = (subscription) => {
    setCurrentSubscription(subscription);
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
        await deleteSubscription(_id);
        setSubscription((prev) => prev.filter((subscription) => subscription._id !== _id));
        Swal.fire('Deleted!', 'Your subscription has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const handleSubscriptionAdded = (newSubscription) => {
    setSubscription((prev) => [...prev, newSubscription]);
    setOpenAdd(false);
  };

  const handleSubscriptionUpdated = (updatedSubscription) => {
    setSubscription((prev) => prev.map((subscription) => (subscription._id === updatedSubscription._id ? updatedSubscription : subscription)));
    setOpenUpdate(false);
  };

  return (
    <>
      <AddSubscription open={openAdd} handleClose={() => setOpenAdd(false)} onSubscriptionAdded={handleSubscriptionAdded} />
      <UpdateSubscription
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        subscription={currentSubscription}
        onUpdateSubscription={handleSubscriptionUpdated}
      />
      <ViewSubscription open={openView} handleClose={() => setOpenView(false)} subscription={currentSubscription} />

      <Grid>
        <Box
          sx={{
            backgroundColor: '#ffff',
            padding: '10px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h4">Subscription Lists</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/admin" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Subscription</Typography>
          </Breadcrumbs>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', marginTop: '20px', padding: '5px' }}>
              <DataGrid
                rows={subscription}
                columns={columns}
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

export default Subscription;
