import { useEffect, useState } from 'react';
import { fetchUsers } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent,IconButton, Typography, Box } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

const ViewUser = ({ open, handleClose, user}) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        
      const loadUser = async () => {
        if (user) {
          try {
            const response = await fetchUsers(user);
            setUserData(response.data); 
            setLoading(false);
          } catch (error) {
            console.error('Error fetching user details:', error);
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle variant="h3" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            User Details
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
                User name:  {user.name}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body1">Email : {user.email}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body1">Phone : {user.phone}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body1">Role : {user.role}</Typography>
            </Box>
            <Box mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ marginRight: 1 }} />
            <Typography variant="body2">Created At: {moment(user.createdAt).format('DD-MM-YYYY')}</Typography>
          </Box>
          </DialogContent>
        </Dialog>
      </>
  );
};

export default ViewUser;

