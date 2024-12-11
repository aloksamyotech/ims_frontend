import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Switch, Container, Typography, Card, Box } from '@mui/material';
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
import axios from 'axios';

const Company = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetchUsers();
        const filteredUsers = response?.data.filter((user) => user.role === 'user');
        setCompanyData(filteredUsers);
      } catch (error) {
        setError('Error fetching users');
        toast.error('Failed to fetch companies');
      }
    };
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
      setLoading(true); // Set loading to true when updating status
      setCompanyData((prevData) => prevData.map((user) => (user._id === userId ? { ...user, isActive: newStatus } : user)));

      const response = await axios.patch(`http://localhost:4200/user/change-status/${userId}`, { isActive: newStatus });
      if (response.data.success) {
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

  const columns = [
    {
      field: 'name',
      headerName: 'Company Name',
      flex: 1.5
    },
    { field: 'email', headerName: 'Company Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1.5 },
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
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        //   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //   {/* Box for Active/Inactive Status */}
        //   <Box
        //     sx={{
        //       display: 'flex',
        //       alignItems: 'center',
        //       justifyContent: 'space-between',
        //       padding: '5px 15px',  // Padding for space around text
        //       borderRadius: '8px',  // Rounded corners for the box
        //       backgroundColor: params.row?.isActive ? '#4caf50' : '#f44336',  // Green for Active, Red for Inactive
        //       width: '150px',  // Box width adjusted for both text
        //       height: '40px',  // Box height for better spacing
        //       cursor: 'pointer',  // Cursor indicates the text is clickable
        //     }}
        //     onClick={() => handleToggleStatus(params.row?._id, !params.row?.isActive)} // Toggle status on box click
        //   >
        //     {/* Active/Inactive Text */}
        //     <Typography
        //       sx={{
        //         color: '#ffffff',  // White text color
        //         fontWeight: 'bold',
        //         fontSize: '14px',  // Slightly smaller text
        //         textAlign: 'center',  // Center-align the text
        //       }}
        //     >
        //       {params.row?.isActive ? 'Active' : 'Inactive'}
        //     </Typography>
        //   </Box>
        // </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            checked={params.row?.isActive}
            onChange={() => handleToggleStatus(params.row?._id, !params.row?.isActive)}
            color={params.row?.isActive ? 'success' : 'error'}
            inputProps={{ 'aria-label': 'toggle active/inactive' }}
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: params.row?.isActive ? '#fff' : '#fff'
              },
              '& .MuiSwitch-track': {
                backgroundColor: params.row?.isActive ? '#4caf50' : '#f44336'
              }
            }}
          />
          <Typography sx={{ mr: 2, color: params.row?.isActive ? '#4caf50' : '#f44336' }}>
            {params.row?.isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
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

  return (
    <>
      <AddCompany open={openAdd} handleClose={() => setOpenAdd(false)} onCompanyAdded={handleCompanyAdded} />

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
          <Typography variant="h4">Companies List</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
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
                rowHeight={50}
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
      </Container>
    </>
  );
};

export default Company;
