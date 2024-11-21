import React, { useState, useEffect } from 'react';
import { getSupplierProductReport, getCustomerProductReport } from 'apis/api.js';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import moment from 'moment';

const SupplierProductReport = () => {
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
    const fetchReportData = async () => {
      try {
        let response;

        if (selectedTab === 0) {
          response = await getCustomerProductReport();

          const flattenedSellData = response?.data?.flatMap((customer) =>
            customer?.products?.map((product) => ({
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
        } 
        
        else {
          response = await getSupplierProductReport();

          const flattenedPurchaseData = response?.data?.flatMap((supplier) =>
            supplier?.products?.map((product) => ({
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
  }, [selectedTab]);

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
    <div>
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

      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 5 , marginLeft : 3 , maxWidth : 1025 }} >
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
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
                <TableCell>{report?.createdAt?.format('DD-MM-YYYY')}</TableCell>
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
    </div>
  );
};

export default SupplierProductReport;
