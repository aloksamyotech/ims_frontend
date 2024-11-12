import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import {
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormLabel,
    Typography,
    FormControl,
    FormHelperText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import { IconTrash } from '@tabler/icons';
import { Link } from 'react-router-dom';

const QuotationForm = () => {
    const [products, setProducts] = useState([]);

    const validationSchema = yup.object({
        date: yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
        customernm: yup.string().required('Customer is required'),
        product: yup.string().required('Product is required'),
        // quantity: yup.number().required('Quantity is required').positive('Must be a positive number').integer('Must be an integer'),
        // price: yup.number().required('Price is required').positive('Must be a positive number'),
      });

    const formik = useFormik({
        validationSchema,
        initialValues: {
            date: '',
            customernm: '',
            reference: 'QT',
            product: '',
            quantity: 1,
            price: 0,
            total: 0,
            status: '',
            tax: 0,
        },
        onSubmit: (values) => {
            console.log('Quotation data:', values);
            toast.success('Quotation added successfully');
            resetForm();
        },
    });

    const handleAddProduct = () => {
        const { product, quantity, price } = formik.values;
        if (product && quantity && price) {
            const subtotal = quantity * price;
            const newProduct = {
                product,
                netprice,
                stock,
                quantity,
                discount,
                tax,
                status,
                subtotal: subtotal,
            };
            setProducts([...products, newProduct]);
            formik.setFieldValue('total', formik.values.total + subtotal);
            formik.setFieldValue('product', '');
            formik.setFieldValue('quantity', 1);
            formik.setFieldValue('stock', 1);
            formik.setFieldValue('discount', 5);
            formik.setFieldValue('tax', 8);
            formik.setFieldValue('netprice', 0);
        }
    };

    const handleRemoveProduct = (index) => {
        const removedProduct = products[index];
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
        formik.setFieldValue('total', formik.values.total - removedProduct.subtotal);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Link to="/dashboard/quotations">
             <Button variant="contained" color="primary">Back</Button></Link>
            <Typography marginTop={5} variant="h3" gutterBottom>Create Quotation</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth>
                        <FormLabel>Products</FormLabel>
                        <Select
                            id="product"
                            name="product"
                            value={formik.values.product}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="product1">product 1</MenuItem>
                            <MenuItem value="product2">product 2</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <FormLabel>Date</FormLabel>
                    <TextField
                        fullWidth
                        id="date"
                        name="date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.date}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <FormControl fullWidth>
                        <FormLabel>Customers</FormLabel>
                        <Select
                            required
                            id="customernm"
                            name="customernm"
                            value={formik.values.customernm}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="customer1">customer 1</MenuItem>
                            <MenuItem value="customer2">customer 2</MenuItem>
                        </Select>
                        <FormHelperText error={formik.touched.customernm && Boolean(formik.errors.customernm)}>
                  {formik.touched.customernm && formik.errors.customernm}
                </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <FormControl fullWidth>
                        <FormLabel>Status</FormLabel>
                        <Select
                            required
                            id="status"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="sent">Sent</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <FormControl fullWidth>
                        <FormLabel>Reference</FormLabel>
                        <TextField
                            required
                            id="reference"
                            name="reference"
                            value={formik.values.reference}
                            onChange={formik.handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Net Unit Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Discount</TableCell>
                                    <TableCell>Tax</TableCell>
                                    <TableCell>SubTotal</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.product}</TableCell>
                                        <TableCell>{product.netprice}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>{product.discount}</TableCell>
                                        <TableCell>{product.tax}</TableCell>
                                        <TableCell>{product.subtotal}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleRemoveProduct(index)}>
                                                <IconTrash />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* Total Summary Row */}
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Button variant="contained" color="primary" onClick={handleAddProduct}>
                                            Add Product
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4} align="right">Tax:</TableCell>
                                    <TableCell>{formik.values.tax}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4} align="right">Discount:</TableCell>
                                    <TableCell>{formik.values.discount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4} align="right">Shipping:</TableCell>
                                    <TableCell>{formik.values.shipping}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4} align="right">Grand Total:</TableCell>
                                    <TableCell>{formik.values.total}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                        Create Quotation
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default QuotationForm;

