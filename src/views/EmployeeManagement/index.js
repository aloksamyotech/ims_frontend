import React, { useState, useEffect } from 'react';
import {
  Stack,
  Grid,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Tooltip,
  Container,
  Typography,
  Box,
  Avatar,
  Button
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import { getUserId } from 'apis/constant.js';
import { deleteEmployee, fetchEmployees } from 'apis/api.js';
import AddEmployee from './addEmployee.js';
import UpdateEmployee from './updateEmployee.js';
import TableStyle from '../../ui-component/TableStyle';

const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const loadEmployees = async () => {
    try {
      const userId = getUserId();
      const response = await fetchEmployees({ userId });
      const column = response?.data.map((item, index) => {
        const date = moment.utc(item?.createdAt).local().format('ll');
        let data = {
          _id: item?._id,
          index: index + 1,
          name: item?.name,
          email: item?.email,
          role: item?.role,
          phone: item?.phone,
          status: (item?.isActive) ? 'active' : 'inActive',
          isActive: item?.isActive,
          createdAt: date,
          address: item?.address,
        }
        return data
      })
      setUsers(column);
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
      field: 'index',
      headerName: '#',
      flex: 0.2,
    },
    {
      field: 'name',
      headerName: 'Employee Profile',
      flex: 1.5,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={3}>
            <Avatar src={params?.row?.name} alt={params?.row?.name} />
          </Grid>
          <Grid item container xs={8} >
            <Grid item xs={12}>
              <Typography color='primary'>{(params?.row?.name?.length > 14) ? params?.row?.name?.substr(0, 14) + "..." : params?.row?.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '10px' }}>{params?.row?.email}</Typography>
            </Grid>
          </Grid >
        </Grid>
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
        </Grid>
    },
    {
      field: 'address',
      headerName: 'Address',
      headerAlign: 'center',
      flex: 1.2,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{(params?.value.length > 15) ? params?.value.substr(0, 15) + "..." : params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'createdAt',
      headerName: 'Date of Joining',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button size='small' variant='contained'
              sx={{
                color: params?.row?.isActive ? '#00c853' : '#d84315',
                backgroundColor: params?.row?.isActive ? '#b9f6ca' : '#fbe9e7',
                boxShadow: 'none', borderRadius: '10px', padding: '0px', fontWeight: '400',
                '&:hover': {
                  color: params?.row?.isActive ? '#00c853' : '#d84315',
                  backgroundColor: params?.row?.isActive ? '#b9f6ca' : '#fbe9e7',
                  boxShadow: 'none'
                }
              }}>{params?.value}</Button>
          </Grid>
        </Grid>
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center',
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
    setUsers((prev) =>
      prev.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee
      )
    );
    setOpenUpdate(false);
    loadEmployees();
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
        await deleteEmployee(_id);
        setUsers((prev) => prev.filter((employee) => employee?._id !== _id));
        Swal.fire('Deleted!', 'Your employee has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <>
      <AddEmployee
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
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
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Employees</Typography>
          </Breadcrumbs>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Paper style={{ height: '600px', marginTop: '20px', padding: '5px' }}>
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
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#eeeeee',
                  },
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
