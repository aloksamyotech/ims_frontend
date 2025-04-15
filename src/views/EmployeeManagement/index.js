import React, { useState, useEffect } from 'react';
import { Stack, Grid, IconButton, Breadcrumbs, Link as MuiLink, Paper, Tooltip, Container, Typography, Box, Avatar } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDialog from 'confirmDeletion/deletion.js';
import moment from 'moment';
import { getUserId } from 'apis/constant.js';
import { deleteEmployee, fetchEmployees } from 'apis/api.js';
import AddEmployee from './addEmployee.js';
import UpdateEmployee from './updateEmployee.js';
import TableStyle from '../../ui-component/TableStyle';
import { toast } from 'react-toastify';

const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
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

  const loadEmployees = async () => {
    try {
      const userId = getUserId();
      const response = await fetchEmployees({ userId });
      setUsers(response?.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const generateRandomAvatar = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('');
  };

  const CustomToolbar = () => (
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
        <Tooltip title="Add Employee" arrow>
          <IconButton
            onClick={() => setOpenAdd(true)}
            sx={{
              backgroundColor: '#1e88e5',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </GridToolbarContainer>
  );

  const columns = [
    {
      field: 'avatar',
      headerName: '#',
      flex: 0.2,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          sx={{
            bgcolor: '#673ab7',
            color: '#ffff',
            width: 40,
            height: 40,
            fontSize: 14
          }}
        >
          {generateRandomAvatar(params.row.name)}
        </Avatar>
      )
    },
    {
      field: 'name',
      headerName: 'Employee Name',
      flex: 1.5,
      renderCell: (params) => (
        <Box ml={1}>
          <Typography variant="h5">{params.row?.name || 'N/A'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row?.email || 'No Email'}
          </Typography>
        </Box>
      )
    },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
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

  const handleView = (_id) => {
    navigate(`/dashboard/employee/view-employee/${_id}`);
  };

  const handleOpenAdd = () => {
    setCurrentEmployee(null);
    setOpenAdd(true);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setOpenUpdate(true);
  };

  const handleEmployeeAdded = (newEmployee) => {
    setUsers((prev) => [...prev, newEmployee]);
    setOpenAdd(false);
    loadEmployees();
  };

  const handleEmployeeUpdated = (updatedEmployee) => {
    setUsers((prev) => prev.map((employee) => (employee._id === updatedEmployee._id ? updatedEmployee : employee)));
    setOpenUpdate(false);
    loadEmployees();
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(selectedId);
      setUsers((prev) => prev.filter((employee) => employee?._id !== selectedId));
      toast.success("Deleted successfully!");
    } catch (error) {
      console.error('Error deleting subscription:', error);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <>
      <ConfirmDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleDelete} />
      <AddEmployee open={openAdd} handleClose={() => setOpenAdd(false)} onEmployeeAdded={handleEmployeeAdded} />
      <UpdateEmployee
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        employee={currentEmployee}
        onUpdateEmployee={handleEmployeeUpdated}
      />
      <Grid>
        <Box
          sx={{
            backgroundColor: '#ffff',
            padding: '10px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h4">Employees</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Employees</Typography>
          </Breadcrumbs>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Paper style={{ height: '600px', marginTop: '20px' }}>
              <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row._id}
                rowHeight={55}
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
                  '& .MuiDataGrid-row': {
                    borderBottom: '1px solid #ccc'
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold'
                  }
                }}
              />
            </Paper>
          </Box>
        </TableStyle>
      </Grid>
    </>
  );
};

export default User;
