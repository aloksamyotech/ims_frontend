import { useState, useEffect } from 'react';
import { Stack, Button, IconButton, Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify'; 
import UpdateProduct from './updateProduct.js'; 
import { deleteProduct, fetchProducts} from 'apis/api.js';
import ViewProduct from './viewProduct.js';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [openView, setOpenView] = useState(false); 
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data); 
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to fetch products');
      }
    };
    loadProducts();
  }, []);

  const columns = [
    { field: 'productnm', headerName: 'Name', flex: 1.5 },
    { field: 'quantity', headerName: 'Quantity', flex: 1.5 },
    {
      field: 'categoryName',
      headerName: 'Category',
      flex: 1.5,
      minWidth: 250 ,
      valueGetter: (params) => params.row.categoryName || 'N/A', 
    },
    {
      field: 'unitName',
      headerName: 'Unit',
      flex: 1.5,
      valueGetter: (params) => params.row.unitName || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          <Box
            sx={{
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              '&:hover': { backgroundColor: '#bbdefb' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
            }}
          >
            <IconButton size="small" onClick={() => handleView(params.row)} color="primary" sx={{ padding: 0 }}>
              <VisibilityIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              '&:hover': { backgroundColor: '#ffe0b2' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
            }}
          >
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon sx={{ color: '#ff9800' }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              backgroundColor: '#ffebee',
              borderRadius: '8px',
              padding: '8px',
              paddingTop: '8px',
              '&:hover': { backgroundColor: '#ef9a9a' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
            }}
          >
            <IconButton size="small" onClick={() => handleDelete(params.row._id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
      ),
    },
  ];

  const handleView = (product) => {
    setSelectedProduct(product);
    setOpenView(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenUpdateDialog(true);
  };

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(_id);
        setProducts((prev) => prev.filter((product) => product._id !== _id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <>
      <ViewProduct open={openView} handleClose={() => setOpenView(false)} product={selectedProduct} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
          <Typography variant="h4" paddingTop={5}>
            Products
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Link to="/dashboard/products/add-product">
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Add Product
              </Button>
            </Link>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={products}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableStyle>

        <UpdateProduct
          open={openUpdateDialog}
          handleClose={() => setOpenUpdateDialog(false)}
          product={selectedProduct}
          onProductUpdated={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((prod) => (prod._id === updatedProduct._id ? updatedProduct : prod))
            );
          }}
        />
      </Container>
    </>
  );
};

export default Product;
