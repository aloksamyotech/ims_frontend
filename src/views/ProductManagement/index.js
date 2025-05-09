import { useState, useEffect } from 'react';
import {
  Stack,
  IconButton,
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
import ReactPaginate from 'react-paginate';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from 'confirmDeletion/deletion.js';
import { toast } from 'react-toastify';
import UpdateProduct from './updateProduct.js';
import AddProductPage from './AddProducts';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import { deleteProduct, fetchProducts } from 'apis/api.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import BulkUpload from './bulkproduct.js';

const items = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`
}));

const ITEMS_PER_PAGE = 8;

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverState, setPopoverState] = useState({ anchorEl: null, productId: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setOpenDeleteDialog(true);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const loadProducts = async () => {
    try {
      const userId = getUserId();
      const response = await fetchProducts({ userId });
      setProducts(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch products');
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

  const handlePopoverOpen = (event, productId) => {
    setPopoverState({ anchorEl: event.currentTarget, productId });
  };

  const handlePopoverClose = () => {
    setPopoverState({ anchorEl: null, productId: null });
  };

  const open = Boolean(popoverState.anchorEl);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setOpenAdd(true);
  };

  const handleView = (_id) => {
    navigate(`/dashboard/products/view-product/${_id}`);
  };
  const handleEdit = () => {
    const product = products.find((prod) => prod._id === popoverState.productId);
    if (product) {
      setSelectedProduct(product);
      setOpenUpdate(true);
    }
    handlePopoverClose();
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      setProducts((prev) => prev.filter((product) => product._id !== selectedProductId));
      setOpenDeleteDialog(false);
      toast.success('Deleted successfully!');
      handlePopoverClose();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleProductAdded = (newproduct) => {
    setProducts((prev) => [...prev, newproduct]);
    setOpenAdd(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = products.filter((product) => product.productnm.toLowerCase().includes(searchTerm));
  const paginatedProducts = filteredProducts.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const handleProductUpdated = (updatedProduct) => {
    if (!updatedProduct || !updatedProduct._id) {
      console.error('Updated product is missing or invalid', updatedProduct);
      return;
    }

    setProducts((prev = []) => prev.map((prod) => (prod._id === updatedProduct._id ? updatedProduct : prod)));

    loadProducts();
    setOpenUpdate(false);
  };

  return (
    <>
      <ConfirmDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={handleDelete} />

      <AddProductPage
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        onProductAdded={handleProductAdded}
        loadProducts={loadProducts}
      />
      <UpdateProduct
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
        loadProducts={loadProducts}
      />
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

        <Card sx={{ marginTop: '20px', height: 'auto' }}>
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

            <Stack direction="row" spacing={2} alignItems="center">
              <BulkUpload loadProducts={loadProducts} />

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
            </Stack>
          </Box>

          <Box sx={{ padding: '8px 20px' }}>
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => (
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
                      onClick={(event) => handlePopoverOpen(event, product._id)}
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
                            borderRadius: '5px'
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: product.quantity > 5 ? 'green' : 'red',
                              textAlign: 'right'
                            }}
                          >
                            {product.quantity > 5 ? 'In Stock' : 'Out of Stock'} ({product.quantity})
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <Popover
                      open={open}
                      anchorEl={popoverState.anchorEl}
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
                          onClick={() => handleDeleteClick(popoverState.productId)}
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              m: 2
            }}
          >
            <ReactPaginate
              previousLabel="<"
              nextLabel=">"
              pageCount={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              previousClassName="prev-button"
              nextClassName="next-button"
            />
          </Box>

          <style>
            {`
  .pagination {
    display: flex;
    list-style: none;
    gap: 8px;
    padding: 0;
    margin: 0;
  }
  .pagination li {
    display: inline-block;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  .pagination li:hover {
    background-color: #f0f0f0;
  }
  .pagination .active {
    background-color: #5e35b1;
    color: #fff;
    border-color: #5e35b1;
  }
  .prev-button,
  .next-button {
    font-weight: bold;
    color: #5e35b1;
  }
`}
          </style>
        </Card>
      </Grid>
    </>
  );
};

export default Product;
