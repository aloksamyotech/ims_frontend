import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Breadcrumbs, Tooltip, Link as MuiLink, Grid, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddSupplier from './AddSuppliers.js';
import UpdateSupplier from './updateSupplier.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import moment from 'moment';
import { deleteSupplier, fetchSuppliers } from 'apis/api.js';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { getUserId } from 'apis/constant.js';

const Supplier = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState(null);

  const loadSuppliers = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.log('User ID is missing');
        setLoading(false);
        return;
      }
      const response = await fetchSuppliers({ userId });
      const rows = response?.data?.map((row, index) => ({ ...row, id: row._id, index: index + 1 }));
      setSupplierData(rows);
    } catch (error) {
      console.error('Failed to fetch or no data found');
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);


  const CustomToolbar = ({ handleOpenAdd }) => {
    return (
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
          <Tooltip title="Add Supplier" arrow>
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
      field: 'index',
      headerName: '#',
      flex: 0.3
    },
    {
      field: 'suppliernm',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row.suppliernm}</Typography>
          <Typography variant="body2" color="textSecondary">{params.row.email}</Typography>
        </Box>
      )
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
      field: 'shopName',
      headerName: 'Shop Name',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.value}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      headerAlign: 'center',
      flex: 1,
      valueGetter: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY');
      },
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign='center'>{params?.formattedValue}</Typography>
          </Grid>
        </Grid>,
    },
    {
      field: 'typeOfSupplier',
      headerName: 'Type Of Supplier',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) =>
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' size='small' sx={{ borderRadius: '20px', color: '#2194f3', bgcolor: '#e3f2fd', boxShadow: 'none', '&:hover': { color: '#2194f3', bgcolor: '#e3f2fd', boxShadow: 'none' } }}>{params?.value}</Button>
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
    setCurrentSupplier(null);
    setOpenAdd(true);
  };

  const handleView = (_id) => {
    navigate(`/dashboard/suppliers/view-supplier/${_id}`);
  };

  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
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
        await deleteSupplier(_id);
        setSupplierData((prev) => prev.filter((supplier) => supplier?._id !== _id));
        loadSuppliers();
        Swal.fire('Deleted!', 'Your supplier has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleSupplierAdded = (newsupplier) => {
    setSupplierData((prev) => [...prev, newsupplier]);
    setOpenAdd(false);
    loadSuppliers();
  };

  const handleSupplierUpdated = (updatedsupplier) => {
    setSupplierData((prev) => prev.map((supplier) => (supplier._id === updatedsupplier._id ? updatedsupplier : supplier)));
    setOpenUpdate(false);
    loadSuppliers();
  };

  return (
    <>
      <AddSupplier open={openAdd} handleClose={() => setOpenAdd(false)} onSupplierAdded={handleSupplierAdded} />
      <UpdateSupplier
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        supplier={currentSupplier}
        onSupplierUpdated={handleSupplierUpdated}
      />
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
          <Typography variant="h4">Suppliers List</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Clients</Typography>
            <Typography color="text.primary">Suppliers</Typography>
          </Breadcrumbs>
        </Box>
        <TableStyle>
          <Box width="100%" >
            <Card style={{ height: '600px', marginTop: '20px', padding: '0 5px' }}>
              <DataGrid
                rows={supplierData}
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
                  '& .MuiDataGrid-root': {
                    border: 'none'
                  },
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
            </Card>
          </Box>
        </TableStyle>
      </Grid>
    </>
  );
};

export default Supplier;
