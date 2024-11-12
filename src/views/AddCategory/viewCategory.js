import { useEffect, useState } from 'react';
import { fetchCategories } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

const ViewCategory = ({ open, handleClose, category }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      if (category) {
        try {
          const response = await fetchCategories(category);
          setCategoryData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching category details:', error);
          setLoading(false);
        }
      }
    };

    loadCategory();
  }, [category]);

  if (loading) return null;

  if (!category) return <div>Category not found.</div>;

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle variant="h3" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
          Category Details
          <IconButton edge="end" color="inherit" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <Box mb={2} sx={{ paddingTop: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 1 }}>
              Category name: {category.catnm}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body1">Description : {category.desc}</Typography>
          </Box>
          <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ marginRight: 1 }} />
            <Typography variant="body2">Created At: {moment(category.createdAt).format('DD-MM-YYYY')}</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewCategory;
