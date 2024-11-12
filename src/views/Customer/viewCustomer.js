import { useEffect, useState } from 'react';
import { DialogTitle, Typography, Card, Box, Button, Dialog, IconButton } from '@mui/material';
import { fetchCustomers } from 'apis/api.js'; 
import CloseIcon from '@mui/icons-material/Close';
import { AccessTime } from '@mui/icons-material';
import moment from 'moment';

const ViewCustomer = ({ open, handleClose, customer }) => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
        if (customer) {
      try {
        const response = await fetchCustomers(customer);
        setCustomerData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer:', error);
        setLoading(false);
      }
    }
    };

    loadCustomer();
  }, [customer]);

  if (loading) return null;
  if (!customer) return <div>Customer not found.</div>;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle variant="h3" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Customer Details
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
      <Card variant="outlined" sx={{ padding: 2 }}>
        <Box mb={2}>
          <Typography variant="h4" >Name: {customer.customernm}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Email: {customer.email}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Phone: {customer.phone}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Bank Name: {customer.bankName}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Type Of Customer: {customer.typeOfCustomer}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Address: {customer.address}</Typography>
        </Box>
        <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ marginRight: 1 }} />
            <Typography variant="body2">Created At: {moment(customer.createdAt).format('DD-MM-YYYY')}</Typography>
          </Box>
      </Card>
    </Dialog>
  );
};

export default ViewCustomer;
