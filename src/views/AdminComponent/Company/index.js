import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Container, Typography, Card, Box } from '@mui/material';
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

const Company = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [companyData, setCompanyData] = useState([]); 
  const [currentCompany, setCurrentCompany] = useState(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetchUsers();
        const filteredUsers = response?.data.filter(user => user.role === 'user'); 
        setCompanyData(filteredUsers); 
        console.log(filteredUsers);
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

  const columns = [
    {
      field: 'name',
      headerName: 'Company Name',
      flex: 1.5,
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
    setCurrentCompany(null);
    setOpenAdd(true);
  };

  const handleCompanyAdded = (newCompany) => {
    setCompanyData((prev) => [...prev, newCompany]); 
    setOpenAdd(false);
  };
  

  // const handleDelete = async (_id) => {
  //   try {
  //     const result = await Swal.fire({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, delete it!'
  //     });
  //     if (result.isConfirmed) {
  //       await deleteCompany(_id);  
  //       setCompanyData((prev) => prev.filter((company) => company?._id !== _id)); 
  //       loadCompanies(); 
  //       Swal.fire('Deleted!', 'Your company has been deleted.', 'success');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting company:', error);
  //   }
  // };

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
