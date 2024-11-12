import { useEffect, useState } from 'react';
import { fetchUnits } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent,IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle variant="h3" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            Unit Details
            <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: 2 }}>
            <Box mb={2} sx={{ paddingTop : 3}}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 1 }}>
                Unit name:  {unit.unitnm}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body1">Short name : {unit.shortcode}</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </>
  );
};

export default ViewUnit;

