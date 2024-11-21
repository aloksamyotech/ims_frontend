import { useEffect, useState } from 'react';
import { fetchUnits } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent,TextField, Typography, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ViewUnit = ({ open, handleClose, unit}) => {
    const [unitData, setUnitData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        
      const loadUnit = async () => {
        if (unit) {
          try {
            const response = await fetchUnits(unit);
            setUnitData(response.data); 
            setLoading(false);
          } catch (error) {
            console.error('Error fetching unit details:', error);
            setLoading(false);
          }
        }
      };
  
      loadUnit();
    }, [unit]);
  
    if (loading) return null; 
  
    if (!unit) return <div>Unit not found.</div>;
 

  return (
    <>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
          <Typography variant="h3">View Unit</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Unit name" variant="outlined" fullWidth margin="dense" value={unit?.unitnm || 'NA'} />
          <TextField autoFocus label="Shortcode" variant="outlined" fullWidth margin="dense" value={unit?.shortcode || 'NA'} />
        </DialogContent>
      </Dialog>
      </>
  );
};

export default ViewUnit;

