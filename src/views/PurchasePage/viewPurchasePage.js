import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Table, TableBody, TableCell, TableContainer, Grid,CardContent, Divider,
  TableHead, TableRow, Paper, Box , Link} from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import jsPDF from 'jspdf';
import { styled } from '@mui/system';
import Logo from '../../assets/images/images.png';
import autoTable from 'jspdf-autotable'; 
import { useParams } from 'react-router';

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

const PurchasePage = () => {
  const { id } = useParams();
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/purchase/fetchById/${id}`);
        setPurchaseData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch purchase data');
      } finally {
        setLoading(false);
      }
    };

    loadPurchase();
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await axios.patch(`http://localhost:4200/purchase/approve/${id}`);
  
      if (response.status === 200) {
        setPurchaseData((prev) => ({
          ...prev,
          status: 'Completed', 
        }));
        window.alert('Purchase approved successfully!');
      }
    } catch (error) {
      console.error('Error during approval:', error);
      window.alert('Failed to approve purchase');
    }
  };

  const handleViewInvoice = () => {
    setShowInvoice(true); 
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

    const tableMarginTop = 100;
    const tableColumn = ['Item', 'Quantity', 'Price', 'Subtotal'];
    const tableRows = purchaseData.products.map((product) => [
      product.productName,
      product.quantity,
      `$${product.price.toFixed(2)}`,
      `$${(product.quantity * product.price).toFixed(2)}`
    ]);

    tableRows.push([{ content: 'Subtotal', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${purchaseData.subtotal.toFixed(2)}`]);
    tableRows.push([{ content: 'Tax', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${purchaseData.tax.toFixed(2)}`]);
    tableRows.push([{ content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', textColor: [0, 128, 0] } }, `$${purchaseData.total.toFixed(2)}`]);

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
        3: { halign: 'right' }, 
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
    <Box sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Purchase Details
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4">
          <strong>Status:</strong>
        </Typography> &nbsp;&nbsp;
        <Box
          sx={{
            backgroundColor: status === 'Completed' ? '#34a853' : status === 'Pending' ? '#f44336' : '',
            color: status === 'Completed' ? 'white' : 'white',
            padding: '0.3rem 1rem',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            width: 'fit-content',
            textTransform: 'uppercase',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            gap: '0.5rem',
            fontSize: '12px'
          }}
        >
          {status || 'Pending'}
        </Box>
      </Box>

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
                      <strong>Purchase No:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{purchase_no}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Date:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{moment(date).format('DD-MM-YYYY')}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      <strong>Name:</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{supplierName}</Typography>
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
                    <Typography variant="body1">{supplierPhone}</Typography>
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
                    <Typography variant="body1">{supplierEmail}</Typography>
                  </Box>
                </Grid>
              </Grid>
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
              {products?.map((product, index) => {
                const subtotalProduct = product.quantity * product.price;
                return (
                  <Box
                    key={product.id || index}
                    sx={{
                      marginBottom: 2,
                      borderBottom: '1px solid #e0e0e0',
                      paddingBottom: 1
                    }}
                  >
                    <Typography variant="h5">
                      <strong>
                        {index + 1}. {product.productName}
                      </strong>
                    </Typography>

                    <Grid container spacing={1} sx={{ marginTop: 1 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            <strong>Quantity:</strong>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">{product.quantity}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            <strong>Price:</strong>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            <strong>Subtotal:</strong>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">${subtotalProduct.toFixed(2)}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}

              <Box sx={{ marginTop: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Subtotal:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1"> ${subtotal.toFixed(2)}</Typography>
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
                      <Typography variant="body1">${tax.toFixed(2)}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        <strong>Total:</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        {' '}
                        <strong>${total.toFixed(2)}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                  <Link   onClick={handleViewInvoice}>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        fontSize : '18px',
                        fontWeight: 'bold',
                        textDecoration: 'underline', 
                        cursor: 'pointer'
                      }}
                    >
                      View Invoice
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Invoice Section */}
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' , marginTop: '10px'}}>
      {showInvoice && (
         <Card variant="outlined" sx={{ padding: 2, borderRadius: 2, boxShadow: 3 , width: '900px', 
          height: '900px'}}>
         <InvoiceHeader>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img src={Logo} alt="Company Logo" style={{ maxWidth: '60px', marginBottom: '10px' }} />
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Inventory Management System
                </Typography>
                <Typography variant="body2">
                  148, Greater South Avenue, Indore, M.P
                </Typography>
              </Box>
            </Box>
    
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', mt: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Invoice No: {purchase_no}
              </Typography>
              <Typography variant="body1">
                Date: {moment(date).format('DD/MM/YYYY')}
              </Typography>
            </Box>
          </InvoiceHeader>
    
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            Supplier : 
         {supplierName}</Typography>
          <Typography variant="body1">Email: {supplierEmail}</Typography>
          <Typography variant="body1">Phone: {supplierPhone}</Typography>
    
          <TableContainer component={Paper} sx={{ alignContent: 'center' ,marginTop: 2, borderRadius: 2, boxShadow: 2 , maxWidth: 700 }}>
            <InvoiceTable id="invoiceTable">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{(product.quantity * product.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    Subtotal
                  </TableCell>
                  <TableCell>{subtotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    Tax
                  </TableCell>
                  <TableCell>{tax.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </InvoiceTable>
          </TableContainer>
    
        
    
          <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 ,marginRight: '160px' }}>
            <Button variant="contained" color="secondary" onClick={downloadInvoice}>
              Download Invoice
            </Button>
          </Box>
    
          <Typography variant="body2" align="left" sx={{ marginTop: 4 }}>
            Thank you for your business!
          </Typography>
          <Typography variant="body2" align="left" sx={{ marginTop: 2}}>
            All payments must be made in full before the commencement of any design work.
          </Typography>
        </Card>
      )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {status !== 'Completed' && (
          <Button variant="contained" color="secondary" onClick={handleApprove}>
            Approve Purchase
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PurchasePage;
