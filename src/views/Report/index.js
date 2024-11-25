import React, { useState, useEffect } from 'react';
import { getSupplierProductReport, getCustomerProductReport } from 'apis/api.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Tabs, Tab, FormControl, Select, MenuItem, Container, Card } from '@mui/material';
import moment from 'moment';
import { fetchCurrencySymbol } from 'apis/constant.js';
import TableStyle from '../../ui-component/TableStyle';

const ProductReport = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [currencySymbol, setCurrencySymbol] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        let response;
        if (selectedTab === 0) {
          response = await getCustomerProductReport();

        } else {
          response = await getSupplierProductReport();
        }
        setReportData(response?.data || []);
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
        return data.filter((report) => moment(report.createdAt).isSame(now, 'day'));
      case 'Weekly':
        return data.filter((report) => moment(report.createdAt).isBetween(last7Days, now, null, '[]'));
      case 'Monthly':
        return data.filter((report) => moment(report.createdAt).isSame(now, 'month'));
      case 'All':
      default:
        return data;
    }
  };

  const flattenData = (data) => {
    return data.flatMap((report) => {
      return report.products.map((product) => ({
        id: `${report._id}-${report.productId}`, 
        createdAt: report.createdAt,
        productName: product.productName,
        categoryName: product.categoryName,
        quantity: product.quantity,
        price: product.price,
        total: product.price * product.quantity,
        name: report.customerName || report.supplierName, 
        email: report.customerEmail || report.supplierEmail, 
        phone: report.customerPhone || report.supplierPhone,
      }));
    });
  };

  const filteredData = filterDataByDate(flattenData(reportData));

  const columns = [
    { field: 'createdAt', headerName: 'Date', width: 120, valueGetter: (params) => moment(params.row?.createdAt).format('DD-MM-YYYY') },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'categoryName', headerName: 'Category', width: 180 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 160, 
      valueFormatter: (params) => `${currencySymbol} ${params.value?.toLocaleString()}` 
    },
    { 
      field: 'total', 
      headerName: 'Total Sales', 
      width: 180, 
      valueFormatter: (params) => `${currencySymbol} ${params.value?.toLocaleString()}` 
    },
    { 
      field: 'name', 
      headerName: selectedTab === 0 ? 'Customer Name' : 'Supplier Name', 
      width: 200 
    },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phone', headerName: 'Phone', width: 150 },
  ];

  return (
    <>
      <Container>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 0.8, marginTop: 4, marginLeft: '330px', marginRight: '310px' }}>
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

          <Box sx={{ marginTop: 4, marginRight: '42px' }}>
            <FormControl style={{ minWidth: 120 }}>
              <Select value={selectedDateRange} onChange={handleDateRangeChange}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TableStyle>
          <Box width="100%" overflow="hidden" sx={{ marginTop: '20px' }}>
            <Card style={{ height: '600px', paddingTop: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                <DataGrid
                  rows={filteredData}
                  columns={columns}
                  getRowId={(row) => row.id}
                  pageSize={5}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  stickyHeader
                  style={{ minWidth: '800px' }}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }
                    }
                  }}
                  pagination
                />
              </div>
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default ProductReport;
