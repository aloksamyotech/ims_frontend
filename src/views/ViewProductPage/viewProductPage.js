import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab,
    Box, Select, MenuItem, FormControl ,Card, Typography, Grid, CardContent, Divider,
  } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { getSupplierProductReport, getCustomerProductReport } from 'apis/api.js';

const ViewProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('All');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/product/fetchById/${id}`);
        setProductData(response.data);
      } catch (error) {
        toast.error("Error fetching product data");
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        let response;
  
        if (selectedTab === 0) {
          response = await getCustomerProductReport();
  
          const flattenedSellData = response?.data?.flatMap((customer) =>
            customer?.products
              ?.filter((product) => product?.productId === id)  
              ?.map((product) => ({
                customerName: customer?.customerName,
                productName: product?.productName,
                categoryName: product?.categoryName,
                quantity: product?.quantity,
                price: product?.price,
                total: product?.quantity * product?.price,
                createdAt: moment(customer?.createdAt)
              }))
          );
  
          setReportData(flattenedSellData);
        } else {
          response = await getSupplierProductReport();
  
          const flattenedPurchaseData = response?.data?.flatMap((supplier) =>
            supplier?.products
              ?.filter((product) => product?.productId === id) 
              ?.map((product) => ({
                supplierName: supplier?.supplierName,
                productName: product?.productName,
                categoryName: product?.categoryName,
                quantity: product?.quantity,
                price: product?.price,
                total: product?.quantity * product?.price,
                createdAt: moment(supplier?.createdAt)
              }))
          );
          setReportData(flattenedPurchaseData);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };
  
    fetchReportData();
  }, [selectedTab, id]);  
  

  const filterDataByDate = (data) => {
    const now = moment();
    const last7Days = moment().subtract(7, 'days');
  
    switch (selectedDateRange) {
      case 'Daily':
        return data.filter((report) => report?.createdAt?.isSame(now, 'day'));
        case 'Weekly':
        return data.filter((report) => 
          report.createdAt.isBetween(last7Days, now, null, '[]') 
        );
      case 'Monthly':
        return data.filter((report) => report?.createdAt?.isSame(now, 'month'));
      
      case 'All':
      default:
        return data;
    }
  };

  const filteredData = filterDataByDate(reportData);

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: 2, justifyItems: 'center' }}>
            <CardContent>
              {productData?.imageUrl ? (
                <img src={productData.imageUrl} alt={productData.name} style={{ width: '465px', height: 'auto', borderRadius: '8px' }} />
              ) : (
                <Typography>No image available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ borderRadius: 1, marginBottom: 1 }}>
                <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
                  Product Details
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
                      <strong>{productData?.productnm || 'NA'} ({productData?.product_no || 'NA'})</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Notes:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{productData?.notes || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Category:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{productData?.categoryName || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Unit:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{productData?.unitName || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Quantity:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{productData?.quantity || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Buying Price:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">${productData?.buyingPrice || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Selling Price:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1"> ${productData?.sellingPrice || 'NA'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Tax:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{productData?.tax || 'NA'}%</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Margin:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      {productData?.margin || 'NA'}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 0.8 , marginTop: 4,  marginLeft: '350px'}}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="report tabs"
            textColor="primary"
            sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
          >
            <Tab
              label="Sales Report"
              sx={{
                color: selectedTab === 0 ? '#fff' : '#1976d2',
                backgroundColor: selectedTab === 0 ? '#ffff' : 'transparent'
              }}
            />
            <Tab
              label="Purchase Report"
              sx={{
                color: selectedTab === 1 ? '#fff' : '#1976d2',
                backgroundColor: selectedTab === 1 ? '#ffff' : 'transparent'
              }}
            />
          </Tabs>
        </Box>

        <Box sx={{ marginTop: 4 , background : '#ffff'}}>
          <FormControl style={{minWidth: 120 , alignContent : 'center'}}>
            <Select value={selectedDateRange} onChange={handleDateRangeChange}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Last 7 Days">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 5 ,marginBottom: 10, marginLeft : 3 , maxWidth : 1050 }} >
        <Table>
          <TableHead sx={{ backgroundColor: '#2196f3' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{selectedTab === 0 ? 'Customer Name' : 'Supplier Name'}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Category</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report?.createdAt.format('DD-MM-YYYY')}</TableCell>
                <TableCell>{selectedTab === 0 ? report?.customerName : report?.supplierName}</TableCell>
                <TableCell>{report?.productName}</TableCell>
                <TableCell>{report?.categoryName}</TableCell>
                <TableCell>{report?.quantity}</TableCell>
                <TableCell>{report?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                <TableCell>{report?.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>  
  );
};

export default ViewProductPage;
