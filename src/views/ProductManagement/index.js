import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  IconButton,
  Container,
  Typography,
  Card,
  Box,
  Grid,
  Tooltip,
  CardMedia,
  Popover,
  CardContent,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import UpdateProduct from './updateProduct.js';
import AddProductPage from './AddProducts';
import { fetchCurrencySymbol } from 'apis/constant.js';
import { deleteProduct, fetchProducts } from 'apis/api.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response?.data);
      } catch (error) {
        toast.error('Failed to fetch products');
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setOpenAdd(true);
  };

  const handleView = (_id) => {
    navigate(`/dashboard/products/view-product/${_id}`);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenUpdateDialog(true);
  };

  const handleDelete = async (_id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      if (result.isConfirmed) {
        await deleteProduct(_id);
        setProducts((prev) => prev.filter((product) => product?._id !== _id));
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleProductAdded = (newproduct) => {
    setProducts((prev) => [...prev, newproduct]);
    setOpenAdd(false);
  };

  return (
    <>
      <AddProductPage open={openAdd} handleClose={() => setOpenAdd(false)} onProductAdded={handleProductAdded} />
      <Container>
        <Box
          sx={{
            marginTop: '20px',
            backgroundColor: '#ffff',
            padding: '14px',
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h3">Product List</Typography>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Products</Typography>
          </Breadcrumbs>
        </Box>

        <Box
          sx={{
            marginTop: '5px',
            backgroundColor: '#eeeeee',
            padding: '5px',
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              backgroundColor: '#1e88e5',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              marginLeft: '980px',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 3,
              cursor: 'pointer'
            }}
            onClick={handleOpenAdd}
          >
             <Tooltip title="Add Product" arrow>
          <Typography variant="h2" sx={{ color: 'white', cursor: 'pointer' }}>
            +
          </Typography>
        </Tooltip>
          </Box>
        </Box>

        <Box sx={{ marginTop: '5px' }}>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    image={product.imageUrl || 'https://via.placeholder.com/150'}
                    alt={product.productnm}
                    sx={{ height: 200, objectFit: 'cover' }}
                    onClick={() => handleView(product._id)}
                  />
                  <CardContent>
                    <Typography variant="h4" noWrap>
                      {product.productnm}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.categoryName || 'No Category'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: product.quantity > 5 ? 'green' : 'red' }}>
                      {product.quantity > 5 ? 'In Stock' : 'Out of Stock'}
                    </Typography>
                    <Typography variant="body2">
                      {currencySymbol} {product.sellingPrice}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <IconButton size="small" onClick={(event) => handlePopoverOpen(event)}>
                        <MoreVertIcon sx={{ color: 'black' }} />
                      </IconButton>
                    </Box>
                    <Popover
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handlePopoverClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                      }}
                    >
                      <Box sx={{ padding: 2, width: '150px' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            marginBottom: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#b7a5d7' },
                            padding: '8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#5e35b1'
                          }}
                          onClick={() => {
                            handleEdit(product);
                            handlePopoverClose();
                          }}
                        >
                          <EditIcon sx={{ color: '#5e35b1', marginRight: 1 }} />
                          Edit
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#ffebee' },
                            padding: '8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#d32f2f'
                          }}
                          onClick={() => {
                            handleChangePassword(product._id);
                            handlePopoverClose();
                          }}
                        >
                          <DeleteIcon sx={{ marginRight: 1 }} />
                          Delete
                        </Typography>
                      </Box>
                    </Popover>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <UpdateProduct
          open={openUpdateDialog}
          handleClose={() => setOpenUpdateDialog(false)}
          product={selectedProduct}
          onProductUpdated={(updatedProduct) => {
            setProducts((prev) => prev.map((prod) => (prod._id === updatedProduct._id ? updatedProduct : prod)));
          }}
        />
      </Container>
    </>
  );
};

export default Product;
