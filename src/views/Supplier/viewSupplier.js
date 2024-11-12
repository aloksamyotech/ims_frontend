import { useEffect, useState } from 'react';
import { DialogTitle, Typography, Card, Box, IconButton, Dialog } from '@mui/material';
import { fetchSuppliers } from 'apis/api.js'; 
import CloseIcon from '@mui/icons-material/Close';
import { AccessTime } from '@mui/icons-material';
import moment from 'moment';

const ViewSupplier = ({ open, handleClose, supplier }) => {
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSupplier = async () => {
        if (supplier) {
      try {
        const response = await fetchSuppliers(supplier);
        setSupplierData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching supplier:', error);
        setLoading(false);
      }
    }
    };

    loadSupplier();
  }, [supplier]);

  if (loading) return null;
  if (!supplier) return <div>supplier not found.</div>;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle variant="h3" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Supplier Details
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
          <Typography variant="h4" >Name: {supplier.suppliernm}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Email: {supplier.email}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Phone: {supplier.phone}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Shop Name: {supplier.shopName}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Bank Name: {supplier.bankName}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Type Of Supplier: {supplier.typeOfSupplier}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body2">Address: {supplier.address}</Typography>
        </Box>
        <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ marginRight: 1 }} />
            <Typography variant="body2">Created At: {moment(supplier.createdAt).format('DD-MM-YYYY')}</Typography>
          </Box>
      </Card>
    </Dialog>
  );
};

export default ViewSupplier;
