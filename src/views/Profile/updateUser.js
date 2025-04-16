import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField, Button, Grid } from '@mui/material';
import { updateApi } from 'apis/common.js';
import { getUserId } from 'apis/constant.js';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

const user = localStorage.getItem('user');
const userObj = JSON.parse(user);

const UpdateProfileForm = ({ open, onClose, profile, setProfile }) => {
  const [formData, setFormData] = useState({
    name: userObj?.data?.name || '',
    email: userObj?.data?.email || '',
    phone: userObj?.data?.phone || ''
  });
  const userId = getUserId();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = { ...formData, _id: userId };
      const response = await updateApi(`/user/update/${userId}`, updatedProfile);

      if (response?.data) {
        setProfile((prevProfile) => ({ ...prevProfile, ...response.data }));

        localStorage.setItem('user', JSON.stringify(response.data));
      
        toast.success('Profile updated successfully!');
    
        onClose();
      } else {
        toast.error('Profile update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Profile</Typography>
        <ClearIcon onClick={onClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} direction="column" marginTop={1}>
          <Grid item xs={12}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} size="small" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} size="small" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} size="small" fullWidth />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleUpdateProfile} color="secondary">
          Save Changes
        </Button>
        <Button variant="contained" onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProfileForm;
