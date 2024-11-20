import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  CardContent,
  Divider,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Paper
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { fetchPurchases } from 'apis/api.js';

const ViewSupplierPage = () => {
  const { id } = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [supplierData, setSupplierData] = useState(null);

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/supplier/fetchById/${id}`);
        setSupplierData(response.data);
        const result = await fetchPurchases();
        setPurchaseDetails(result.data);
      } catch (error) {
        toast.error('Error fetching supplier data');
      }
    };

    loadSupplier();
  }, [id]);

  const filteredPurchases = purchaseDetails.filter((purchase) => purchase.supplierId === supplierData?._id);

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ borderRadius: 1, marginBottom: 1 }}>
                <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
                  Supplier Details
                </Typography>
              </Box>
              <Divider sx={{ marginY: 2, borderColor: 'gray', borderWidth: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Name:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>{supplierData?.suppliernm || 'NA'}</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Email:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.email || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Phone:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.phone || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Address:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.address || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Type:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierData?.typeOfSupplier || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Shop Name:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1"> {supplierData?.shopName || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Created At:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{moment(supplierData?.createdAt).format('DD-MM-YYYY')}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 5, marginLeft: 3, maxWidth: 1050 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Category</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tax</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurchases.map((purchaseDetails, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(purchaseDetails?.createdAt).toLocaleDateString('en-GB')}</TableCell>
                <TableCell>{purchaseDetails?.status || 'NA'}</TableCell>
                <TableCell>{purchaseDetails?.products[0]?.productName}</TableCell>
                <TableCell>{purchaseDetails?.products[0]?.categoryName}</TableCell>
                <TableCell>{purchaseDetails?.products[0]?.quantity}</TableCell>
                <TableCell>{purchaseDetails?.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                <TableCell>{purchaseDetails?.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                <TableCell>{purchaseDetails?.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewSupplierPage;
