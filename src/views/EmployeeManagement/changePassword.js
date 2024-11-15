import { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ChangePassword = ({ open, handleClose , onchangePassword, user}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); 
      console.log('Token:', token);

      const response = await axios.put(
        'http://localhost:4200/user/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.data.success) {
        alert('Password changed successfully');
        handleClose(); 
      } else {
        alert(response.data.message || 'Error changing password');
      }
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data.message || 'Something went wrong');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
    id="scroll-dialog-title"
    style={{ display: 'flex', justifyContent: 'space-between' }}
  >
    <Typography variant="h3">Change Password</Typography>
    <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
  </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormLabel>Current Password</FormLabel>
              <TextField
                autoFocus
                margin="dense"
                required
                id="currentPassword"
                name="currentPassword"
                fullWidth
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>New Password</FormLabel>
              <TextField
                autoFocus
                margin="dense"
                required
                id="newPassword"
                name="newPassword"
                fullWidth
                type="password"
                value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Confirm New Password</FormLabel>
              <TextField
                autoFocus
                margin="dense"
                required
                id="confirmPassword"
                name="confirmPassword"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={loading}
        >
          {loading ? 'Changing...' : 'Submit'}
        </Button>
        <Button
          onClick={handleClose}
           variant="contained"
          color="error"
          disabled={loading}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePassword;
