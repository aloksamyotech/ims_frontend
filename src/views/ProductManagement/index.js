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
  TextField,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import UpdateProduct from './updateProduct.js';
import AddProductPage from './AddProducts';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import { deleteProduct, fetchProducts } from 'apis/api.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const loadProducts = async () => {
    try {
      const response = await fetchProducts();
      const allProducts = response?.data || 0;
      const userId = getUserId();
      const filteredProducts = allProducts.filter((product) => product?.userId === userId);
      setProducts(filteredProducts);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
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
    loadProducts();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = products.filter((product) => product.productnm.toLowerCase().includes(searchTerm));

  return (
    <>
      <AddProductPage open={openAdd} handleClose={() => setOpenAdd(false)} onProductAdded={handleProductAdded} />
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
          <Typography variant="h4">Product List</Typography>

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

        <Card sx={{ marginTop: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '8px'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px',
                borderRadius: '8px',
                border: '1px solid beige',
                width: '250px'
              }}
            >
              <SearchIcon sx={{ fontSize: '20px', marginRight: 1 }} />
              <TextField value={searchTerm} onChange={handleSearchChange} placeholder="Search..." variant="standard" fullWidth />
            </Box>

            <Tooltip title="Add Product" arrow>
              <IconButton
                onClick={handleOpenAdd}
                sx={{
                  backgroundColor: '#1e88e5',
                  color: '#fff',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: 3,
                  justifyContent: 'center',
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    color: '#ffffff'
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ padding: '8px 20px' }}>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      position: 'relative',
                      height: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.imageUrl ||
                        'https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
                      }
                      alt={product.productnm}
                      sx={{ height: 150, objectFit: 'fill' }}
                      onClick={() => handleView(product._id)}
                    />

                    <IconButton
                      size="small"
                      onClick={(event) => handlePopoverOpen(event)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8
                      }}
                    >
                      <MoreHorizIcon sx={{ color: 'black' }} />
                    </IconButton>

                    <CardContent>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h5" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                          {product.productnm}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="body2" color="textSecondary">
                          {product.categoryName}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                        <Typography variant="body2">
                          Selling Price: &nbsp; {currencySymbol} {product.sellingPrice}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                        <Box
                          sx={{
                            border: '1px solid',
                            borderColor: product.quantity > 5 ? 'green' : 'red',
                            padding: '2px 5px',
                            borderRadius: '5px',
                            '&:hover': {
                              backgroundColor: '#19ab53',
                              color: 'white',
                              fontWeight: 500,
                            }
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: product.quantity > 5 ? 'green' : 'red',
                              textAlign: 'right',
                              '&:hover': {
                                color: 'white',
                              }
                            }}
                          >
                            {product.quantity > 5 ? 'In Stock' : 'Out of Stock'} ({product.quantity})
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

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
                            handleDelete(product._id);
                            handlePopoverClose();
                          }}
                        >
                          <DeleteIcon sx={{ marginRight: 1 }} />
                          Delete
                        </Typography>
                      </Box>
                    </Popover>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>

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
