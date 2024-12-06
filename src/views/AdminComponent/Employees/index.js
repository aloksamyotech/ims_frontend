import { useState, useEffect } from 'react';
import { Stack, IconButton, Breadcrumbs, Link as MuiLink, Popover,Paper, Container, Typography, Card, Box, Dialog } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, deleteUser } from 'apis/api.js';
import ViewUser from './viewUser.js';
import UpdateUser from './updateUser.js';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material';

const User = () => {
  const [users, setUsers] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        const filteredUsers = response?.data.filter(user => user.role === 'user'); 
        setUsers(filteredUsers); 
        console.log(response.data);
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
        <GridToolbarExport style={{ fontSize: 14 }} />
      </GridToolbarContainer>
    );
  };

  const generateRandomAvatar = (name) => {
    const initials = name
      .split(' ')
      .map((word) => word[0])
      .join('');
    return initials;
  };

  const columns = [
    {
      field: '#',
      flex: 0.2,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          sx={{
            bgcolor: '#673ab7',
            color: '#ffff',
            width: 40,
            height: 40,
            fontSize: 14,
            boxShadow: 3,
            border: '1px solid white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          {generateRandomAvatar(params.row.name || '')}
        </Avatar>
      )
    },
    {
      field: 'name',
      headerName: 'Username',
      flex: 0.8,
      renderCell: (params) => (
        <Box ml={1}>
          <Typography variant="h5">{params.row?.name || 'N/A'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.email || 'No Email'}
          </Typography>
        </Box>
      )
    },
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
      flex: 1,
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
            <IconButton
              size="small"
              onClick={() => handleView(params.row)}
              color="primary"
              sx={{
                '&:hover': { backgroundColor: '#9abfdd', color: '#1976d2' }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>

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
            <IconButton
              size="small"
              onClick={(event) => handleEdit( params.row)}
              color="secondary"
              sx={{
                '&:hover': { backgroundColor: '#d7cde6', color: '#512995' }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

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
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row?._id)}
              color="error"
              sx={{
                '&:hover': { backgroundColor: '#ffcccc', color: '#d32f2f' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
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

  return (
    <>
      <UpdateUser open={openUpdate} handleClose={() => setOpenUpdate(false)} user={currentUser} onUpdateUser={handleUserUpdated} />
      <ViewUser open={openView} handleClose={() => setOpenView(false)} user={currentUser} />

      <Container>
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
          <Typography variant="h4">Employee Management</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/admin" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Employee</Typography>
          </Breadcrumbs>
        </Box>
        
            <Paper style={{ height: '600px', marginTop: '20px'}}>
              <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row._id}
                rowHeight={50}
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
            </Paper>
      </Container>
    </>
  );
};

export default User;
