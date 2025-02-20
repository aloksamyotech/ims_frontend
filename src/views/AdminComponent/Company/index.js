import { useState, useEffect } from 'react';
import { Stack, Avatar, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Switch, Grid, Typography, Card, Box, Button } from '@mui/material';
import TableStyle from 'ui-component/TableStyle.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddCompany from './addCompany.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { fetchUsers } from 'apis/api.js';
import { updateApi } from 'apis/common.js';

const Company = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCompanies = async () => {
    try {
      const response = await fetchUsers();
      const filteredUsers = response?.data.filter((user) => user.role === 'user').map((item, index) => {
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
        }
        return data
      })
      setCompanyData(filteredUsers);
    } catch (error) {
      setError('Error fetching users');
      toast.error('Failed to fetch companies');
    }
  };
  useEffect(() => {
    loadCompanies();
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
          <Tooltip title="Add Company" arrow>
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

  const handleToggleStatus = async (userId, newStatus) => {
    try {
      setLoading(true);
      setCompanyData((prevData) => prevData.map((user) => (user._id === userId ? { ...user, isActive: newStatus } : user)));

      const updatedUser = {
        _id: userId,
        isActive: newStatus
      };

      const response = await updateApi('/user/change-status/:id', updatedUser);
      if (response?.data.success) {
        toast.success(`Company status updated to ${newStatus ? 'Active' : 'Inactive'}`);
      } else {
        toast.error('Failed to update status');
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update company status');
      setCompanyData((prevData) => prevData.map((user) => (user._id === userId ? { ...user, isActive: !newStatus } : user)));
    } finally {
      setLoading(false);
    }
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
      field: 'index',
      headerName: '#',
      flex: 0.3,
      renderCell: (params) =>
        <Typography >{params?.value}</Typography>
    },
    {
      field: 'name',
      headerName: 'Company Profile',
      flex: 1.5,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={4}>
            <Avatar src={params?.row?.name} alt={params?.row?.name} />
          </Grid>
          <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color='primary'>{(params?.row?.name?.length > 14) ? params?.row?.name?.substr(0, 14) + "..." : params?.row?.name}</Typography>
          </Grid >
        </Grid>
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'phone',
      headerName: 'Number',
      flex: 1, headerAlign: 'center',
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      headerAlign: 'center',
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
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={params.row?.isActive}
              onChange={() => handleToggleStatus(params.row?._id, !params.row?.isActive)}
              defaultChecked
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#4caf50'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#4caf50'
                },
                '& .MuiSwitch-switchBase': {
                  color: '#dd132e'
                },
                '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                  backgroundColor: '#dd132e'
                }
              }}
            />
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
        </Stack>
      )
    }
  ];

  const handleOpenAdd = () => {
    setCurrentCompany(null);
    setOpenAdd(true);
  };

  const handleCompanyAdded = (newCompany) => {
    setCompanyData((prev) => [...prev, newCompany]);
    setOpenAdd(false);
  };

  const handleView = (_id) => {
    navigate(`/dashboard/company/view-company/${_id}`);
  };

  return (
    <>
      <AddCompany open={openAdd} handleClose={() => setOpenAdd(false)} onCompanyAdded={handleCompanyAdded} />

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
          <Typography variant="h4">Companies List</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/admin" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Companies</Typography>
          </Breadcrumbs>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', marginTop: '20px', padding: '5px' }}>
              <DataGrid
                rows={companyData}
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
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
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

export default Company;
