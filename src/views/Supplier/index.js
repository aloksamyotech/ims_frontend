import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import AddSupplier from './AddSuppliers.js';
import UpdateSupplier from './updateSupplier.js'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import { deleteSupplier, fetchSuppliers } from 'apis/api.js';

const Supplier = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false); 
  const [supplierData, setSupplierData] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState(null); 

  useEffect(() => {
    const loadSuppliers = async () => {
      const response = await fetchSuppliers();
      setSupplierData(response.data);
    };
    loadSuppliers();
  }, []);

  const columns = [
    { field: 'suppliernm', headerName: 'Name', flex: 1.5, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 2, minWidth: 250 },
    { field: 'phone', headerName: 'Phone', flex: 1.5, minWidth: 150 },
    { field: 'shopName', headerName: 'Shop Name', flex: 1.5, minWidth: 200 },
    {
      field: 'typeOfSupplier',
      headerName: 'Type Of Supplier',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: '#2196f3',  
              color: 'white', 
              padding: '0.5rem 1rem',
              borderRadius: '5px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              width: '110px',
              height: '25px', 
              textTransform: 'uppercase',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
              gap: '0.5rem',
              fontSize: '12px',
              letterSpacing: '0.5px', 
            }}
          >
            {params.value}
          </Box>
        );
      }
    },    
    { field: 'createdAt', headerName: 'Created At', 
      flex: 1,minWidth : 150,
      valueGetter: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY'); 
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
        <Box
         sx={{backgroundColor: '#e3f2fd', borderRadius: '8px',padding: '8px', paddingTop:'8 px','&:hover': { backgroundColor: '#bbdefb' },
              display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
          <IconButton size="small" onClick={() => handleView(params.row._id)} color="primary" sx={{ padding: 0 }}>
          <VisibilityIcon />  </IconButton>
         </Box>
         <Box sx={{ backgroundColor: '#fff3e0', borderRadius: '8px', padding: '8px',paddingTop:'8 px', '&:hover': { backgroundColor: '#ffe0b2' },
          display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
           <IconButton size="small" onClick={() => handleEdit(params.row)}>
             <EditIcon sx={{ color: '#ff9800' }} />
           </IconButton>
         </Box>
         <Box sx={{ backgroundColor: '#ffebee', borderRadius: '8px', padding: '8px',paddingTop:'8 px', '&:hover': { backgroundColor: '#ef9a9a' } ,
          display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
           <IconButton size="small" onClick={() => handleDelete(params.row._id)} color="error">
             <DeleteIcon />
           </IconButton>
         </Box>
       </Stack>
      ),
    },
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
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await deleteSupplier(_id);
        setSupplierData((prev) => prev.filter((supplier) => supplier._id !== _id));
        Swal.fire(
          "Deleted!", 
          "Your supplier has been deleted.", 
          "success"  
        );
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleSupplierAdded = (newsupplier) => {
    setSupplierData((prev) => [...prev, newsupplier]);
    setOpenAdd(false);
  };

  const handleSupplierUpdated = (updatedsupplier) => {
    setSupplierData((prev) => prev.map((supplier) => (supplier._id === updatedsupplier._id ? updatedsupplier : supplier)));
    setOpenUpdate(false);
  };

  return (
    <>
    <AddSupplier open={openAdd} handleClose={() => setOpenAdd(false)} onSupplierAdded={handleSupplierAdded} />
      <UpdateSupplier open={openUpdate} handleClose={() => setOpenUpdate(false)} supplier={currentSupplier}  onSupplierUpdated={handleSupplierUpdated} />

      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>Suppliers List</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2} marginTop={3}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add Supplier
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '5px', overflow: 'auto' }}>
              <DataGrid 
                rows={supplierData}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{ toolbar: { showQuickFilter: true } }}
                stickyHeader
                style={{ minWidth: '800px' }} 
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

export default Supplier;
