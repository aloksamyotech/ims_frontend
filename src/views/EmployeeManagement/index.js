import { useState, useEffect } from 'react';
import { Stack, Button, Container, IconButton, Typography, Card, Box, Dialog, Popover } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import { fetchUsers, deleteUser } from 'apis/api.js';
import { toast } from 'react-toastify';
import ViewUser from './view.js';
import UpdateUser from './updateEmployee.js';
import moment from 'moment';
import ChangePassword from './changePassword.js';
import Swal from 'sweetalert2';

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
            '&:hover': { backgroundColor: '#e3f2fd' },
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            color: '#1976d2', 
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
            color: '#d32f2f', 
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
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await deleteUser(_id);
        setUsers((prev) => prev.filter((user) => user?._id !== _id));
        Swal.fire(
          "Deleted!", 
          "Your user has been deleted.", 
          "success"  
        );
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
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>
            Users List
          </Typography>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '5px', overflow: 'auto' }}>
              <DataGrid
                rows={users}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{ toolbar: { showQuickFilter: true } }}
                style={{ minWidth: '800px', overflow: 'auto' }}
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

export default User;
