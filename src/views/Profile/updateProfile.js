import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle,Typography,InputLabel,
     TextField, Button, FormControl, Select, MenuItem } from '@mui/material';
import { updateAdmin } from 'apis/api.js';
import currencySymbolMap from 'currency-symbol-map';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

const currency = [
  'USD',  // United States Dollar
  'EUR',  // Euro
  'GBP',  // British Pound Sterling
  'INR',  // Indian Rupee
  'JPY',  // Japanese Yen
  'AUD',  // Australian Dollar
  'CAD',  // Canadian Dollar
  'CHF',  // Swiss Franc
  'CNY',  // Chinese Yuan
  'SEK',  // Swedish Krona
  'NZD',  // New Zealand Dollar
  'MXN',  // Mexican Peso
  'SGD',  // Singapore Dollar
  'HKD',  // Hong Kong Dollar
  'NOK',  // Norwegian Krone
  'KRW',  // South Korean Won
  'TRY',  // Turkish Lira
  'BRL',  // Brazilian Real
  'ZAR',  // South African Rand
];

const UpdateProfile = ({ open, onClose, profile, setProfile }) => {
  const [currencyCode, setCurrencyCode] = useState(profile.currencyCode || '');
  const [currencySymbol, setCurrencySymbol] = useState(currencySymbolMap(profile.currencyCode || '') || '');
  const [username, setUsername] = useState(profile.username || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');

  const handleCurrencyCodeChange = (event) => {
    const selectedCode = event.target.value;
    setCurrencyCode(selectedCode);
    setCurrencySymbol(currencySymbolMap(selectedCode));
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        username,
        phone,
        email,
        currencyCode,
        currencySymbol
      };
      const response = await updateAdmin({ ...updatedProfile, _id: profile._id });

      if (response.status === 200) {
        toast.success('Profile updated successfully');
        setProfile(updatedProfile); 
        onClose(); 
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Profile</Typography>
        <ClearIcon onClick={onClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="dense"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          margin="dense"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth margin="dense">
        <InputLabel >Currency Code</InputLabel>
          <Select value={currencyCode} onChange={handleCurrencyCodeChange} label="Currency Code">
            {currency.map((code) => (
              <MenuItem key={code} value={code}>{code}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Currency Symbol"
          variant="outlined"
          fullWidth
          margin="dense"
          value={currencySymbol}
          onChange={(e) => setCurrencySymbol(e.target.value)}
          sx={{ marginTop : 2  }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveProfile} variant="contained" color="secondary">Update</Button>
        <Button onClick={onClose} variant="contained" color="error">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProfile;
