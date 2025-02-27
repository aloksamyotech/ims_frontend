import { useEffect, useState } from 'react';
import { fetchCategories } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent,TextField, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ViewCategory = ({ open, handleClose, category }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      if (category) {
        try {
          const response = await fetchCategories(category);
          setCategoryData(response?.data);
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
          <Typography variant="h3">View Category</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Category name" variant="outlined"  size='small' fullWidth margin="dense" value={category.catnm || 'NA'} sx={{marginBottom:2}} />
          <TextField autoFocus label="Description" variant="outlined"   size='small' fullWidth margin="dense" value={category.desc || 'NA'} sx={{marginBottom:2}}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewCategory;
