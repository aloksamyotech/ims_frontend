import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Grid,
  styled,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Tab,
  Tabs,
  TableHead,
  TableRow,
  Paper,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';
import jsPDF from 'jspdf';
import Logo from '../../assets/images/images.png';
import autoTable from 'jspdf-autotable';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchCurrencySymbol } from 'apis/constant.js';
import InfoIcon from '@mui/icons-material/Info';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { fetchPurchaseById } from 'apis/api.js';
import { updateApi } from 'apis/common.js';

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
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2.4)
}));

const PurchasePage = () => {
  const { id } = useParams();
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);

  const handleTabChange = (event, newIndex) => {
    if (newIndex === 1 && status !== 'cancelled') {
      handleViewInvoice(event);
    }
    setTabIndex(newIndex);
  };

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const response = await fetchPurchaseById(id);
        setPurchaseData(response?.data);
      } catch (error) {
        setError('Failed to fetch purchase data');
      } finally {
        setLoading(false);
      }
    };

    loadPurchase();
  }, [id]);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const updatePurchaseStatus = async (id, action) => {
    const updatedPurchase = {
      _id: id,
      action: action
    };

    try {
      const response = await updateApi(`/purchase/update-status/${id}`, updatedPurchase);
      if (response.success == true) {
        setPurchaseData((prev) => ({
          ...prev,
          status: action === 'approve' ? 'completed' : 'cancelled'
        }));

        setSelectedAction(action);
        setSuccessMessage(action === 'approve' ? 'Purchase Approved Successfully!' : 'Purchase Cancelled Successfully!');
        setOpenDialog(true);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSuccessMessage('');
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
    doc.text(`Invoice No: ${purchaseData.purchase_no}`, 14, 40);
    doc.text(`Date: ${moment(purchaseData.date).format('DD/MM/YYYY')}`, 14, 46);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Supplier Details:', 14, 56);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${purchaseData.supplierName}`, 14, 62);
    doc.text(`Email: ${purchaseData.supplierEmail}`, 14, 68);
    doc.text(`Phone: ${purchaseData.supplierPhone}`, 14, 74);

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
    const tableRows = purchaseData?.products?.map((product) => [
      product?.productName,
      product?.quantity,
      `$${product?.price.toFixed(2)}`,
      `$${(product?.quantity * product?.price).toFixed(2)}`
    ]);

    tableRows.push([
      { content: 'Subtotal', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
      `$${purchaseData.subtotal.toFixed(2)}`
    ]);
    tableRows.push([{ content: 'Tax', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${purchaseData.tax.toFixed(2)}`]);
    tableRows.push([
      { content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', textColor: [0, 128, 0] } },
      `$${purchaseData.total.toFixed(2)}`
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
    supplierName,
    supplierPhone,
    supplierEmail,
    status,
    subtotal = 0,
    tax = 0,
    total = 0,
    purchase_no
  } = purchaseData || {};

  return (
    <>
      <Grid>
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
          <Typography variant="h4">Purchase Details</Typography>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <MuiLink component={Link} to="/dashboard/purchases" color="inherit">
              <Typography color="text.primary">Purchases</Typography>
            </MuiLink>
            <Typography color="text.primary">ViewPurchase</Typography>
          </Breadcrumbs>
        </Box>

        <TabContentCard>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="purchase details tabs">
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
                  {' '}
                  <Typography variant="h4" fontWeight="bold">
                    Supplier
                  </Typography>
                  <Typography color="text.secondary">Details of purchase #{purchase_no}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      backgroundColor:
                        status === 'completed' ? '#d5fadf' : status === 'pending' ? '#f8e1a1' : status === 'cancelled' ? '#fbe9e7' : '',
                      color:
                        status === 'completed' ? '#19ab53' : status === 'pending' ? '#ff9800' : status === 'cancelled' ? '#f44336' : '',
                      padding: '1px',
                      borderRadius: '30px',
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
                    {status || 'pending'}
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
                          <strong>{supplierName}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: '#929aa3' }} />
                        <Typography variant="body1">{supplierPhone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: '#929aa3' }} />
                        <Typography variant="body1">{supplierEmail}</Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body1">
                        <strong>Placed on:</strong> {moment(date).format('DD-MM-YYYY')}
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
                  const subtotalProduct = product.quantity * product.price;
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

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>Category:</strong> {product.categoryName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>Quantity:</strong> {product.quantity}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>Price:</strong> {currencySymbol} {product.price.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>Subtotal:</strong> {currencySymbol} {subtotalProduct.toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
                <Grid container spacing={2} sx={{ m: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Subtotal+Tax:</strong> {currencySymbol} ({subtotal.toFixed(2)} + {tax.toFixed(2)})
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Total:</strong> {currencySymbol} {total.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '5px' }}>
                {status === 'pending' && (
                  <>
                    <Button variant="contained" color="secondary" onClick={() => updatePurchaseStatus(id, 'approve')}>
                      Approve Purchase
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="contained" color="error" onClick={() => updatePurchaseStatus(id, 'cancel')}>
                      Cancel Purchase
                    </Button>
                  </>
                )}
              </Box>
            </Card>
          )}

          {tabIndex === 1 && status !== 'cancelled' && (
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
                      Invoice No: {purchase_no}
                    </Typography>
                    <Typography variant="body1">Date: {moment(date).format('DD/MM/YYYY')}</Typography>
                  </Box>
                </InvoiceHeader>

                <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                  Supplier : {supplierName}
                </Typography>
                <Typography variant="body1">Email: {supplierEmail}</Typography>
                <Typography variant="body1">Phone: {supplierPhone}</Typography>

                <TableContainer sx={{ alignContent: 'center', marginTop: 2, borderRadius: 2, maxWidth: 800 }}>
                  <InvoiceTable id="invoiceTable">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price/unit</TableCell>
                        <TableCell>Subtotal</TableCell>
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
                          <TableCell>
                            {currencySymbol} {(product?.quantity * product?.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}

                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          Subtotal:
                        </TableCell>
                        <TableCell>
                          {currencySymbol} {subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          Tax:
                        </TableCell>
                        <TableCell>
                          {currencySymbol} {tax.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
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

          {tabIndex === 1 && status === 'cancelled' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Typography variant="body2" color="error">
                Invoice not available for cancelled purchases.
              </Typography>
            </Box>
          )}
        </TabContentCard>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { width: 350, height: 250 } }}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {selectedAction === 'approve' ? (
              <CheckCircleIcon sx={{ color: '#28a745', fontSize: 50 }} />
            ) : (
              <CancelIcon sx={{ color: 'red', fontSize: 50 }} />
            )}
            <Typography
              variant="h4"
              sx={{ fontSize: '1.8rem', marginBottom: 1 }}
              color={selectedAction === 'approve' ? '#28a745' : 'error'}
            >
              {successMessage}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="contained" color="primary" sx={{ fontSize: '14px', px: 2 }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PurchasePage;
