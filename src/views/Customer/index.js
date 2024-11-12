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
import { toast } from 'react-toastify'; 
import moment from 'moment';
import { deleteCustomer, fetchCustomers } from 'apis/api.js';
import ViewCustomer from './viewCustomer.js';

const Customer = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false); 
  const [openView, setOpenView] = useState(false); 
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
    { field: 'customernm', headerName: 'Name', flex: 1.5, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 2, minWidth: 300 },
    { field: 'phone', headerName: 'Phone', flex: 1.5, minWidth: 150 },
    { field: 'bankName', headerName: 'Bank Name', flex: 1.5, minWidth: 100 },
    { field: 'typeOfCustomer', headerName: 'Type Of Customer', flex: 1.5, minWidth: 150 },
    { field: 'address', headerName: 'Address', flex: 1.5, minWidth: 350 },
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
        <Stack direction="row" spacing={2}>
        <Box
         sx={{backgroundColor: '#e3f2fd', borderRadius: '8px',padding: '8px', paddingTop:'8 px','&:hover': { backgroundColor: '#bbdefb' },
              display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
          <IconButton size="small" onClick={() => handleView(params.row)} color="primary" sx={{ padding: 0 }}>
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

  const handleView = (customer) => {
    setCurrentCustomer(customer);
    setOpenView(true);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setOpenUpdate(true);
  };

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(_id);
      setCustomerData((prev) => prev.filter((customer) => customer._id !== _id));
      toast.success('customer deleted successfully');
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
      <ViewCustomer open={openView} handleClose={() => setOpenView(false)} customer={currentCustomer} />

      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4" paddingTop={5}>Customers Lists</Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            Add Customer
          </Button>
        </Stack>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '15px', overflow: 'auto' }}>
              <DataGrid
                rows={customerData}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{ Toolbar: GridToolbar }}
                stickyHeader
                style={{ minWidth: '800px' }} 
              />
            </Card>
          </Box>
        </TableStyle>
     
      </Container>
    </>
  );
};

export default Customer;
