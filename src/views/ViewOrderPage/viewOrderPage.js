import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Button,
  Divider,
  styled,
  Tabs,
  Tab,
  Breadcrumbs,
  Link as MuiLink,
  Container
} from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate, useParams } from 'react-router';
import Logo from '../../assets/images/images.png';
import { fetchCurrencySymbol } from 'apis/constant.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const user = localStorage.getItem('user');
const userObj = JSON.parse(user);

const InvoiceHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '20px',
  padding: '20px',
  backgroundColor: '#90caf9',
  color: '#fff'
});

const InvoiceTable = styled(Table)({
  marginTop: '20px',
  '& thead th': {
    backgroundColor: '#42a5f5',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  '& tbody tr:hover': {
    backgroundColor: '#e3f2fd'
  },
  '& tfoot td': {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333'
  }
});

const TabContentCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2)
}));

const InvoicePage = () => {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    if (newIndex === 1 && order_status !== 'cancelled') {
      handleViewInvoice(event);
    }
    setTabIndex(newIndex);
  };

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/order/fetchById/${id}`);
        setInvoiceData(response?.data);
      } catch (error) {
        setError('Failed to fetch invoice data');
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [id]);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const updateOrderStatus = async (id, action) => {
    try {
      const response = await axios.patch(`http://localhost:4200/order/update-status/${id}`, { action });
      if (response.status === 200) {
        setInvoiceData((prev) => ({
          ...prev,
          order_status: action === 'approve' ? 'completed' : 'cancelled'
        }));
        Swal.fire({
          title: `Order ${action === 'approve' ? 'approved' : 'cancelled'} successfully!`,
          icon: 'success',
          background: '#f0f8ff',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Great!',
          timer: 3000
        });
      } else {
        Swal.fire({
          title: `Failed to ${action === 'approve' ? 'approve' : 'cancel'} order`,
          icon: 'error',
          background: '#f0f8ff',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Okay',
          timer: 3000
        });
      }
    } catch (error) {
      Swal.fire({
        title: `Failed to ${action === 'approve' ? 'approve' : 'cancel'} order`,
        icon: 'error',
        background: '#f0f8ff',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Okay',
        timer: 3000
      });
    }
  };

  const handleViewInvoice = (event) => {
    if (event) {
      event.preventDefault();
      setShowInvoice(true);
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFillColor(10, 45, 100);
    doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice', doc.internal.pageSize.width / 2, 15, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceData.invoice_no}`, 14, 40);
    doc.text(`Date: ${moment(invoiceData.date).format('DD/MM/YYYY')}`, 14, 46);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details:', 14, 56);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${invoiceData.customerName}`, 14, 62);
    doc.text(`Email: ${invoiceData.customerEmail}`, 14, 68);
    doc.text(`Phone: ${invoiceData.customerPhone}`, 14, 74);
    doc.text(`Address: ${invoiceData.customerAddress}`, 14, 80);

    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Company Details:', 120, 56);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${userObj.name}`, 120, 62);
    doc.text(`Email: ${userObj.email}`, 120, 68);
    doc.text(`Phone: +91 56732`, 120, 74);
    doc.text(`Address: India`, 120, 80);

    const tableMarginTop = 100;
    const tableColumn = ['Item', 'Quantity', 'Price', 'Subtotal'];
    const tableRows = invoiceData?.products?.map((product) => [
      product?.productName,
      product?.quantity,
      `$${product?.price.toFixed(2)}`,
      `$${(product?.quantity * product?.price).toFixed(2)}`
    ]);

    tableRows.push([
      { content: 'Subtotal', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
      `$${invoiceData.subtotal.toFixed(2)}`
    ]);
    tableRows.push([{ content: 'Tax', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${invoiceData.tax.toFixed(2)}`]);
    tableRows.push([
      { content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', textColor: [0, 128, 0] } },
      `$${invoiceData.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: tableMarginTop,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [10, 45, 100], textColor: [255, 255, 255], fontSize: 12 },
      styles: { fontSize: 10, halign: 'center', cellPadding: 3 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your business!', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.save('invoice.pdf');
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  const {
    products = [],
    date,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    order_status,
    subtotal = 0,
    tax = 0,
    total = 0,
    invoice_no
  } = invoiceData || {};

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: '#ffff',
          padding: '10px',
          borderRadius: '8px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">Order Details</Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/orders" color="inherit">
            <Typography color="text.primary">Orders</Typography>
          </MuiLink>
          <Typography color="text.primary">ViewOrder</Typography>
        </Breadcrumbs>
      </Box>

      <TabContentCard>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="order details tabs">
          <Tab
            icon={<InfoIcon />}
            iconPosition="start"
            label="Details"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: tabIndex === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<ReceiptIcon />}
            iconPosition="start"
            label="Invoice"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: tabIndex === 1 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        {tabIndex === 0 && (
          <Card sx={{ padding: '15px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Customer
                </Typography>
                <Typography color="text.secondary">Details of order #{invoice_no}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    backgroundColor:
                      order_status === 'completed'
                        ? '#d5fadf'
                        : order_status === 'pending'
                        ? '#f8e1a1'
                        : order_status === 'cancelled'
                        ? '#fbe9e7'
                        : '',
                    color:
                      order_status === 'completed'
                        ? '#19ab53'
                        : order_status === 'pending'
                        ? '#ff9800'
                        : order_status === 'cancelled'
                        ? '#f44336'
                        : '',
                    '&:hover': {
                      backgroundColor:
                        order_status === 'completed'
                          ? '#19ab53'
                          : order_status === 'pending'
                          ? '#ff9800'
                          : order_status === 'cancelled'
                          ? '#f44336'
                          : '',
                      color:
                        order_status === 'completed'
                          ? '#ffff'
                          : order_status === 'pending'
                          ? '#ffff'
                          : order_status === 'cancelled'
                          ? '#ffff'
                          : ''
                    },
                    padding: '1px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    width: '90px',
                    height: '20px',
                    textTransform: 'uppercase',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    gap: '0.5rem',
                    fontSize: '12px'
                  }}
                >
                  {order_status || 'pending'}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ margin: '16px 0' }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircleIcon sx={{ color: '#929aa3' }} />
                      <Typography variant="body1">
                        <strong>{customerName}</strong>
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ color: '#929aa3' }} />
                      <Typography variant="body1">{customerPhone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ color: '#929aa3' }} />
                      <Typography variant="body1">{customerEmail}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ color: '#929aa3' }} />
                      <Typography variant="body1">{customerAddress}</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body1">
                      <strong>Placed on:</strong> {moment(date).format('DD-MM-YYYY HH:mm')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ margin: '16px 0' }} />

            <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h4" sx={{ marginBottom: 1 }}>
                <strong>Products</strong>
              </Typography>

              {products.map((product, index) => {
                return (
                  <Box key={product.id || index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 1, textTransform: 'uppercase' }}>
                          <strong>
                            {index + 1}. {product.productName}
                          </strong>
                        </Typography>
                      </Grid>

                      <Grid container spacing={2} sx={{mb:1}}>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Category:</strong> {product.categoryName}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Quantity:</strong> {product.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Price:</strong> {currencySymbol} {product.price.toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}

              <Grid container spacing={2} sx={{m:2}}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Subtotal+Tax:</strong> {currencySymbol} ({subtotal.toFixed(2)} + {tax.toFixed(2)})
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Typography variant="body1">
                    <strong>Total: {currencySymbol} {total.toFixed(2)} </strong>
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '5px' }}>
              {order_status === 'pending' && (
                <>
                  <Button variant="contained" color="secondary" onClick={() => updateOrderStatus(id, 'approve')}>
                    Approve Order
                  </Button>
                  &nbsp;&nbsp;
                  <Button variant="contained" color="error" onClick={() => updateOrderStatus(id, 'cancel')}>
                    Cancel Order
                  </Button>
                </>
              )}
            </Box>
          </Card>
        )}

        {tabIndex === 1 && order_status !== 'cancelled' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
            <Card variant="outlined" sx={{ padding: 2, borderRadius: 2, width: '800px', height: 'auto' }}>
              <InvoiceHeader>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <img src={Logo} alt="Company Logo" style={{ maxWidth: '60px', marginBottom: '10px' }} />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Inventory Management System
                    </Typography>
                    <Typography variant="body2">148, Greater South Avenue, Indore, M.P</Typography>
                    <Typography variant="body2">{userObj.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', mt: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Invoice No: {invoice_no}
                  </Typography>
                  <Typography variant="body1">Date: {moment(date).format('DD/MM/YYYY')}</Typography>
                </Box>
              </InvoiceHeader>

              <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                Customer : {customerName}
              </Typography>
              <Typography variant="body1">Email: {customerEmail}</Typography>
              <Typography variant="body1">Phone: {customerPhone}</Typography>
              <Typography variant="body1">Address: {customerAddress}</Typography>

              <TableContainer sx={{ alignContent: 'center', marginTop: 2, borderRadius: 2, maxWidth: 800 }}>
                <InvoiceTable id="invoiceTable">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price/unit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products?.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product?.productName}</TableCell>
                        <TableCell>{product?.quantity}</TableCell>
                        <TableCell>
                          {currencySymbol} {product?.price}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        Subtotal:
                      </TableCell>
                      <TableCell>
                        {currencySymbol} {subtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        Tax:
                      </TableCell>
                      <TableCell>
                        {currencySymbol} {tax.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                        Total:
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {currencySymbol} {total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </InvoiceTable>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={downloadInvoice}>
                  Download Invoice
                </Button>
              </Box>

              <Typography variant="body2" align="left" sx={{ marginTop: 4 }}>
                Thank you for your business!
              </Typography>
              <Typography variant="body2" align="left" sx={{ marginTop: 2 }}>
                All payments must be made in full before the commencement of any design work.
              </Typography>
            </Card>
          </Box>
        )}

        {tabIndex === 1 && order_status === 'cancelled' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Typography variant="body2" color="error">
              Invoice not available for cancelled orders.
            </Typography>
          </Box>
        )}
      </TabContentCard>
    </Container>
  );
};

export default InvoicePage;
