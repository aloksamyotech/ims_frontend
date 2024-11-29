import { useState, useEffect } from 'react';
import { Stack, IconButton, Breadcrumbs, Link as MuiLink,Popover, Container, Typography, Card, Box, Dialog } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import { fetchUsers, deleteUser } from 'apis/api.js';
import ViewUser from './view.js';
import UpdateUser from './updateEmployee.js';
import moment from 'moment';
import ChangePassword from './changePassword.js';
import Swal from 'sweetalert2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const User = () => {
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response?.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  const CustomToolbar = () => {
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
          <GridToolbarExport sx={{ fontSize: 25 }} />    
      </GridToolbarContainer>
    );
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 0.8 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 0.8 },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.7,
      valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY')
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
            <IconButton size="small" onClick={() => handleView(params.row)} color="primary" sx={{ padding: 0 }}>
              <VisibilityIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              padding: '8px',
              '&:hover': { backgroundColor: '#ffe0b2' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <IconButton size="small" onClick={(event) => handlePopoverOpen(event, params.row)}>
              <EditIcon sx={{ color: '#ff9800' }} />
            </IconButton>
          </Box>
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

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <Box sx={{ padding: 2, width: '200px' }}>
              <Typography
                variant="body2"
                sx={{
                  marginBottom: 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#b7a5d7' },
                  padding: '8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#5e35b1'
                }}
                onClick={() => {
                  handleEdit(params.row);
                  handlePopoverClose();
                }}
              >
                <EditIcon sx={{ marginRight: 1 }} />
                Edit Profile
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#ffebee' },
                  padding: '8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#d32f2f'
                }}
                onClick={() => {
                  handleChangePassword(params.row);
                  handlePopoverClose();
                }}
              >
                <LockIcon sx={{ marginRight: 1 }} />
                Change Password
              </Typography>
            </Box>
          </Popover>
        </Stack>
      )
    }
  ];

  const handleView = (user) => {
    setCurrentUser(user);
    setOpenView(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
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
        await deleteUser(_id);
        setUsers((prev) => prev.filter((user) => user?._id !== _id));
        Swal.fire('Deleted!', 'Your user has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    setOpenUpdate(false);
  };

  const handleChangePassword = (user) => {
    setCurrentUser(user);
    setOpenChangePassword(true);
  };

  return (
    <>
      <UpdateUser open={openUpdate} handleClose={() => setOpenUpdate(false)} user={currentUser} onUpdateUser={handleUserUpdated} />
      <ViewUser open={openView} handleClose={() => setOpenView(false)} user={currentUser} />
      <ChangePassword
        open={openChangePassword}
        handleClose={() => setOpenChangePassword(false)}
        user={currentUser}
        onchangePassword={handleChangePassword}
      />

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
          <Typography variant="h3">Users</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Users</Typography>
          </Breadcrumbs>
        </Box>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: 'auto', paddingTop: '5px', marginTop: '25px', overflow: 'auto' }}>
              <DataGrid
                rows={users}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{ Toolbar: CustomToolbar }}
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

export default User;
