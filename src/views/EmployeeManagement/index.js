import { useState, useEffect } from 'react';
import { Stack, Button, Container, IconButton, Typography, Card, Box, Dialog } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, deleteUser } from 'apis/api.js';
import { toast } from 'react-toastify';
import ViewUser from './view.js';
import UpdateUser from './updateEmployee.js';
import moment from 'moment';
import ChangePassword from './changePassword.js';

const User = () => {
  const [users, setUsers] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 0.8},
    { field: 'email', headerName: 'Email', flex: 1},
    { field: 'phone', headerName: 'Phone', flex: 0.8},
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.7,
      valueGetter: (params) => moment(params.row.createdAt).format('DD-MM-YYYY')
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
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
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
            <IconButton size="small" onClick={() => handleDelete(params.row._id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              backgroundColor: '#34a853',
              borderRadius: '5px',
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '180px',
              height: '30px', 
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            }}
            onClick={() => handleChangePassword(params.row)}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
            >
              Change Password
            </Typography>
          </Box>
        </Stack>
      )
    }
  ];

  const handleView = (user) => {
    console.log('Viewing user:', user);
    setCurrentUser(user);
    setOpenView(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setOpenUpdate(true);
  };

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(_id);
        setUsers((prev) => prev.filter((user) => user._id !== _id));
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }
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
            <Card style={{ height: '600px', paddingTop: '15px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                <DataGrid
                  rows={users}
                  columns={columns}
                  checkboxSelection
                  getRowId={(row) => row._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  stickyHeader
                  style={{ minWidth: '800px', overflow: 'auto' }}
                />
              </div>
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default User;
