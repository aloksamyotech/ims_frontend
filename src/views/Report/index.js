import React, { useState, useEffect } from 'react';
import { fetchPurchases, fetchOrders } from 'apis/api.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Tabs, Tab, FormControl, Select, MenuItem, Container, Card } from '@mui/material';
import moment from 'moment';
import { fetchCurrencySymbol } from 'apis/constant.js';
import TableStyle from '../../ui-component/TableStyle';

const ProductReport = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
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
    const loadReport = async () => {
      try {
        const purchase = await fetchPurchases();
        setPurchaseDetails(purchase?.data);
        const order = await fetchOrders();
        setOrderDetails(order?.data);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    loadReport();
  }, []);

  const filterDataByDate = (data) => {
    const now = moment();
    const last7Days = moment().subtract(7, 'days');
    return data.filter((report) => {
      const reportDate = moment(report?.date);  
      switch (selectedDateRange) {
        case 'Daily':
          return reportDate.isSame(now, 'day');
        case 'Weekly':
          return reportDate.isBetween(last7Days, now, null, '[]');
        case 'Monthly':
          return reportDate.isSame(now, 'month');
        case 'All':
        default:
          return true;
      }
    });
  };

  const purchaseColumns = [
    {
      field: 'date',
      headerName: 'Purchase Date',
      width: 180,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    { field: 'supplierName', headerName: 'Supplier', width: 200 },
    { field: 'supplierEmail', headerName: 'Email', width: 200 },
    { field: 'supplierPhone', headerName: 'Phone', width: 200 },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'price', headerName: 'Price', width: 150 },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'total',
      headerName: 'Total Price',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
  ];

  const orderColumns = [
    {
      field: 'date',
      headerName: 'Order Date',
      width: 180,
      valueGetter: (params) => moment(params.row?.date).format('DD-MM-YYYY')
    },
    { field: 'customerName', headerName: 'Customer', width: 200 },
    { field: 'customerEmail', headerName: 'Email', width: 200 },
    { field: 'customerPhone', headerName: 'Phone', width: 200 },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'price', headerName: 'Price', width: 150 },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'total',
      headerName: 'Total Price',
      width: 150,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
  ];
  

  const flattenPurchaseData = (purchaseData) => {
    return purchaseData.flatMap((purchase) => {
      return purchase.products.map((product) => ({
        id: `${purchase._id}-${product.productId}`,    
        date : purchase.date,
        supplierName: purchase.supplierName,      
        supplierEmail: purchase.supplierEmail,       
        supplierPhone: purchase.supplierPhone,     
        productName: product.productName,        
        quantity: product.quantity,             
        price: product.price,                    
        total: purchase.total,  
        subtotal: purchase.subtotal,            
        tax: purchase.tax,                          
      }));
    });
  };

  const flattenOrderData = (orderData) => {
    return orderData.flatMap((order) => {
      return order.products.map((product) => ({
        id: `${order._id}-${product.productId}`,    
        date : order.date,
        customerName: order.customerName,      
        customerEmail: order.customerEmail,       
        customerPhone: order.customerPhone,     
        productName: product.productName,        
        quantity: product.quantity,             
        price: product.price,                    
        total: order.total,  
        subtotal: order.subtotal,            
        tax: order.tax,                          
      }));
    });
  };

  const flattenedOrderData = flattenOrderData(orderDetails);
  const filteredOrderData = filterDataByDate(flattenedOrderData);

  const flattenedPurchaseData = flattenPurchaseData(purchaseDetails);
  const filteredPurchaseData = filterDataByDate(flattenedPurchaseData);

  return (
    <>
      <Container>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 0.8, marginTop: 4, marginLeft: '350px', marginRight: '330px' }}>
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

          <Box sx={{ marginTop: 4 }}>
            <FormControl style={{ minWidth: 120, alignContent: 'center' }}>
              <Select value={selectedDateRange} onChange={handleDateRangeChange}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Last 7 Days">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TableStyle>
          {selectedTab === 0 && (
            <Box width="100%" overflow="hidden" sx={{ marginTop: '20px' }}>
              <Card style={{ height: '600px', paddingTop: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                  <DataGrid
                    rows={filteredOrderData}
                    columns={orderColumns}
                    checkboxSelection
                    getRowId={(row) => row.id}
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
          )}

          {selectedTab === 1 && (
            <Box width="100%" overflow="hidden" sx={{ marginTop: '20px' }}>
              <Card style={{ height: '600px', paddingTop: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                  <DataGrid
                    rows={filteredPurchaseData}
                    columns={purchaseColumns}
                    checkboxSelection
                    getRowId={(row) => row.id}
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
          )}
        </TableStyle>
      </Container>
    </>
  );
};

export default ProductReport;
