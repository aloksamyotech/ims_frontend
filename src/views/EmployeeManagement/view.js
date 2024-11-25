import { useEffect, useState } from 'react';
import { fetchUsers } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent,TextField, Typography, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';

const ViewUser = ({ open, handleClose, user}) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        
      const loadUser = async () => {
        if (user) {
          try {
            const response = await fetchUsers(user);
            setUserData(response?.data); 
            setLoading(false);
          } catch (error) {
            setLoading(false);
          }
        }
      };
      loadUser();
    }, [user]);
  
    if (loading) return null; 
    if (!user) return <div>User not found.</div>;
 
  return (
    <>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
          <Typography variant="h3">View User</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent>
          <TextField autoFocus label="User name" variant="outlined" fullWidth margin="dense" value={user?.name || 'NA'} sx={{marginBottom:2}}/>
          <TextField autoFocus label="Email" variant="outlined" fullWidth margin="dense" value={user?.email || 'NA'} sx={{marginBottom:2}}/>
          <TextField autoFocus label="Phone" variant="outlined" fullWidth margin="dense" value={user?.phone || 'NA'} sx={{marginBottom:2}}/>
          <TextField autoFocus label="Role" variant="outlined" fullWidth margin="dense" value={user?.role || 'NA'} sx={{marginBottom:2}}/>
          <TextField autoFocus label="Created At" variant="outlined" fullWidth margin="dense" value={moment(user?.createdAt).format('DD-MM-YYYY')} sx={{marginBottom:2}}/>
        </DialogContent>
      </Dialog>  
    </>       
  );
};

export default ViewUser;

