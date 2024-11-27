import { useState, useEffect } from 'react';
import { Stack, Button, Container, IconButton, Typography, Card, Box, Dialog } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCategory from './addCategory.js';
import UpdateCategory from './updateCategory.js';
import ViewCategory from './viewCategory.js';
import { deleteCategory, fetchCategories } from 'apis/api.js';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';
import { minWidth } from '@mui/system';

const Category = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response?.data?.length > 0) { 
          setCategories(response.data);
        } else {
          console.warn('No categories found');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);
  

  const columns = [
    { field: 'catnm', headerName: 'Category Name', flex: 1.5, minWidth: 250 },
    { field: 'desc', headerName: 'Description', flex: 1, minWidth: 400  },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
         <Box
          sx={{backgroundColor: '#e3f2fd', borderRadius: '8px',padding: '8px', paddingTop:'8 px','&:hover': { backgroundColor: '#bbdefb' },
               display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
           <IconButton size="small" onClick={() => handleView(params.row)} color="primary" sx={{ padding: 0 }}>
           <VisibilityIcon />  </IconButton>
          </Box>
          <Box sx={{ backgroundColor: '#fff3e0', borderRadius: '8px', padding: '8px',paddingTop:'8 px', '&:hover': { backgroundColor: '#ffe0b2' },
           display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon sx={{ color: '#ff9800' }} />
            </IconButton>
          </Box>
          <Box sx={{ backgroundColor: '#ffebee', borderRadius: '8px', padding: '8px',paddingTop:'8 px', '&:hover': { backgroundColor: '#ef9a9a' } ,
           display: 'flex',alignItems: 'center',justifyContent: 'center', width: '40px',height: '40px',  }}>
            <IconButton size="small" onClick={() => handleDelete(params.row?._id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setCurrentCategory(null);
    setOpenAdd(true);
  };

  const handleView = (category) => {
    setCurrentCategory(category);
    setOpenView(true);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setOpenUpdate(true);
  };

  const handleDelete = async (_id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await deleteCategory(_id);
        setCategories((prev) => prev.filter((category) => category?._id !== _id));
        Swal.fire(
          "Deleted!", 
          "Your category has been deleted.", 
          "success"  
        );
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  

  const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setOpenAdd(false);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories((prev) => prev.map((category) => (category._id === updatedCategory._id ? updatedCategory : category)));
    setOpenUpdate(false);
  };

  return (
    <>
     <AddCategory open={openAdd} handleClose={() => setOpenAdd(false)} onCategoryAdded={handleCategoryAdded} />
      <UpdateCategory open={openUpdate} handleClose={() => setOpenUpdate(false)} category={currentCategory} onUpdateCategory={handleCategoryUpdated} />
      <ViewCategory open={openView} handleClose={() => setOpenView(false)} category={currentCategory} />

      <Container>
      <Box
          sx={{
            marginTop: '20px',
            backgroundColor: '#ffff',
            padding: '12px',          
            borderRadius: '8px', 
            width: '100%',          
            display: 'flex',         
            alignItems: 'center',  
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h3">Category Lists</Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add Category
            </Button>
           </Box>
        <TableStyle>
          <Box width="100%" overflow="hidden">
            <Card style={{ height: '600px', paddingTop: '5px',marginTop:'25px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                <DataGrid
                  rows={categories}
                  columns={columns}
                  checkboxSelection
                  getRowId={(row) => row._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  stickyHeader
                  style={{ minWidth: '800px', overflow: 'auto' }}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }, 
                    },
                  }}
                  pagination
                />
              </div>
            </Card>
          </Box>
        </TableStyle>
       
      </Container>
    </>
  );
};

export default Category;


