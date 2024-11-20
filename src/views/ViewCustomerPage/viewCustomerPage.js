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
import { fetchOrders } from 'apis/api.js';

const ViewCustomerPage = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [customerData, setCustomerData] = useState(null);

    useEffect(() => {
        const loadCustomer = async () => {
          try {
            const response = await axios.get(`http://localhost:4200/customer/fetchById/${id}`);
            setCustomerData(response.data);
            const result = await fetchOrders();
            setOrderDetails(result.data);
          } catch (error) {
            toast.error("Error fetching customer data");
          }
        };
        loadCustomer();
      }, [id]);

      const filteredOrders = orderDetails.filter((order) => order.customerId === customerData?._id);

      return (
        <Box sx={{ marginTop: '20px' }}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ borderRadius: 1, marginBottom: 1 }}>
                <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
                  Customer Details
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
                      <strong>{customerData?.customernm || 'NA'}</strong>
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
                    <Typography variant="body1">{customerData?.email || 'NA'}</Typography>
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
                    <Typography variant="body1">{customerData?.phone || 'NA'}</Typography>
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
                    <Typography variant="body1">{customerData?.address || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Type of Customer:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerData?.isWholesale ? 'Wholesale' : 'Walk-in'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Bank Name:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerData?.bankName || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Account Holder:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerData?.accountHolder || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Account Number:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{customerData?.accountNumber || 'NA'}</Typography>
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
                    <Typography variant="body1">{moment(customerData?.createdAt).format('DD-MM-YYYY')}</Typography>
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
            {filteredOrders.map((orderDetails, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(orderDetails?.createdAt).toLocaleDateString('en-GB')}</TableCell>
                <TableCell>{orderDetails?.order_status || 'NA'}</TableCell>
                <TableCell>{orderDetails?.products[0]?.productName}</TableCell>
                <TableCell>{orderDetails?.products[0]?.categoryName}</TableCell>
                <TableCell>{orderDetails?.products[0]?.quantity}</TableCell>
                <TableCell>{orderDetails?.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                <TableCell>{orderDetails?.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                <TableCell>{orderDetails?.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>  
  );
};

export default ViewCustomerPage;
