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
import ConfirmDialog from 'confirmDeletion/deletion';
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
  const [loading, setLoading] = useState(false);
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

  const loadSuppliers = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.log('User ID is missing');
        setLoading(false);
        return;
      }
      const response = await fetchSuppliers({ userId });
      setSupplierData(response?.data);
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
      field: 'suppliernm',
      headerName: 'Name',
      flex: 2.5,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <Typography variant="h5">{params.row.suppliernm}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row.email}
          </Typography>
        </Box>
      )
    },
    { field: 'phone', headerName: 'Phone', flex: 1.5, minWidth: 120 },
    { field: 'shopName', headerName: 'Shop Name', flex: 1.5, minWidth: 180 },
    {
      field: 'typeOfSupplier',
      headerName: 'Type Of Supplier',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#2196f3',
              padding: '1px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              width: '93px',
              height: '20px',
              textTransform: 'uppercase',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              gap: '0.5rem',
              fontSize: '12px'
            }}
          >
            {params.value}
          </Box>
        );
      }
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 110,
      valueGetter: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 200,
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

  const handleDelete = async () => {
    try {
      await deleteSupplier(selectedId);
      setSupplierData((prev) => prev.filter((supplier) => supplier?._id !== selectedId));
      toast.success('Deleted successfully!');
      loadSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    } finally {
      handleCloseDialog();
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
      <ConfirmDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleDelete} />
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
          <Box width="100%">
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
                  }
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
