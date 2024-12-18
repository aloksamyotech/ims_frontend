import { useEffect, useState } from 'react';
import { fetchUsers } from 'apis/api.js';
import { Dialog, DialogTitle, DialogContent, TextField, Typography, Grid, FormLabel } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';

const ViewUser = ({ open, handleClose, user }) => {
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
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormLabel>User Name</FormLabel>
              <TextField variant="outlined" size="small" fullWidth value={user?.name || 'NA'} />
            </Grid>

            <Grid item xs={12} >
              <FormLabel>Email</FormLabel>
              <TextField variant="outlined" size="small" fullWidth value={user?.email || 'NA'} />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>Phone</FormLabel>
              <TextField variant="outlined" size="small" fullWidth value={user?.phone || 'NA'} />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>Role</FormLabel>
              <TextField variant="outlined" size="small" fullWidth value={user?.role || 'NA'} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewUser;
