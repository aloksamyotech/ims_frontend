import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { useParams } from 'react-router';
import { styled } from '@mui/system';
import Logo from '../../assets/images/images.png';
import DownloadInvoice from '.';

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

const DownloadInvoicePage = () => {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/order/fetchById/${id}`);
        setInvoiceData(response.data);
      } catch (error) {
        setError('Failed to fetch invoice data');
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

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
    
    const tableMarginTop = 100;
    const tableColumn = ['Item', 'Quantity', 'Price', 'Subtotal'];
    const tableRows = invoiceData.products.map((product) => [
      product.productName,
      product.quantity,
      `$${product.price.toFixed(2)}`,
      `$${(product.quantity * product.price).toFixed(2)}`
    ]);
  
    tableRows.push([{ content: 'Subtotal', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${invoiceData.subtotal.toFixed(2)}`]);
    tableRows.push([{ content: 'Tax', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${invoiceData.tax.toFixed(2)}`]);
    tableRows.push([{ content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', textColor: [0, 128, 0] } }, `$${invoiceData.total.toFixed(2)}`]);
  
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
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    subtotal = 0,
    tax = 0,
    total = 0,
    invoice_no
  } = invoiceData || {};

  return (
    <Card variant="outlined" sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
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
            Invoice No: {invoice_no}
          </Typography>
          <Typography variant="body1">
            Date: {moment(date).format('DD/MM/YYYY')}
          </Typography>
        </Box>
      </InvoiceHeader>

      <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
        Customer : 
     {customerName}</Typography>
      <Typography variant="body1">Email: {customerEmail}</Typography>
      <Typography variant="body1">Phone: {customerPhone}</Typography>
      <Typography variant="body1">Address: {customerAddress}</Typography>

      <TableContainer component={Paper} sx={{ alignContent: 'center' ,marginTop: 2, borderRadius: 2, boxShadow: 2 , maxWidth: 900 }}>
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
            {products.map((product, index) => (
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

    

      <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 , marginRight: '145px'}}>
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
  );
};

export default DownloadInvoicePage;
