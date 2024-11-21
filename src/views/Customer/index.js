import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import AddCustomer from './AddCustomers.js';
import UpdateCustomer from './updateCustomer.js'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { deleteCustomer, fetchCustomers } from 'apis/api.js';

const Customer = () => {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false); 
  const [customerData, setCustomerData] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null); 

  useEffect(() => {
    const loadCustomers = async () => {
      const response = await fetchCustomers();
      setCustomerData(response.data);
    };
    loadCustomers();
  }, []);

  const columns = [
    { field: 'customernm', headerName: 'Name', flex: 1.5 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'phone', headerName: 'Phone', flex: 1.5 },
    {
      field: 'customerType',
      headerName: 'Type of Customer',
      flex: 1.5,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.isWholesale ? 'Wholesale' : 'Walk-in';
      },
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
    setCurrentCustomer(null);
    setOpenAdd(true);
  };

  const handleView = (_id) => {
    navigate(`/dashboard/customers/view-customer/${_id}`);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
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
        await deleteCustomer(_id);
      setCustomerData((prev) => prev.filter((customer) => customer._id !== _id));
        Swal.fire(
          "Deleted!", 
          "Your customer has been deleted.", 
          "success"  
        );
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleCustomerAdded = (newcustomer) => {
    setCustomerData((prev) => [...prev, newcustomer]);
    setOpenAdd(false);
  };

  const handleCustomerUpdated = (updatedcustomer) => {
    setCustomerData((prev) => prev.map((customer) => (customer._id === updatedcustomer._id ? updatedcustomer : customer)));
    setOpenUpdate(false);
  };

  return (
    <>
       <AddCustomer open={openAdd} handleClose={() => setOpenAdd(false)} onCustomerAdded={handleCustomerAdded} />
      <UpdateCustomer open={openUpdate} handleClose={() => setOpenUpdate(false)} customer={currentCustomer}  onCustomerUpdated={handleCustomerUpdated} />

      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>Customers List</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2} marginTop={3}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add Customer
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '5px', overflow: 'auto' }}>
              <DataGrid  
                rows={customerData}
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

export default Customer;
