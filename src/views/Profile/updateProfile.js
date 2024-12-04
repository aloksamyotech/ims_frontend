import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, Select, MenuItem, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';
import currencySymbolMap from 'currency-symbol-map';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, Field, Form } from 'formik';

const currency = [
  'USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK',
  'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'BRL', 'ZAR',
];

const UpdateProfile = ({ open, onClose, profile, setProfile }) => {
  const [currencyCode, setCurrencyCode] = useState(profile.currencyCode || '');
  const [currencySymbol, setCurrencySymbol] = useState(currencySymbolMap(profile.currencyCode || '') || '');
  const [imageFile, setImageFile] = useState(null);

  const handleCurrencyCodeChange = (event, setFieldValue) => {
    const selectedCode = event.target.value;
    setCurrencyCode(selectedCode);
    setCurrencySymbol(currencySymbolMap(selectedCode));
    setFieldValue('currencyCode', selectedCode); 
  };

  const handleLogoChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setFieldValue('logo', file); 
    }
  };

  const handleSaveProfile = async (values) => {
    const formData = new FormData();
    formData.append('currencyCode', values.currencyCode);
    formData.append('currencySymbol', values.currencySymbol);
    if (values.logo) {
      formData.append('logo', values.logo); 
    }

    try {
      const response = await axios.post(
        `http://localhost:4200/admin/update`,  
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.status === 200) {
        console.log('Profile updated successfully', response.data);
        toast.success("Profile Updated Successfully!");
      } else {
        console.error('Failed to update profile', response.data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Profile</Typography>
        <ClearIcon onClick={onClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            currencyCode: currencyCode || '',
            currencySymbol: currencySymbol || '',
            logo: null,
          }}
          enableReinitialize={true} 
          onSubmit={handleSaveProfile}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Currency Code</InputLabel>
                    <Select
                      value={values.currencyCode}
                      onChange={(e) => handleCurrencyCodeChange(e, setFieldValue)}
                      label="Currency Code"
                    >
                      {currency.map((code) => (
                        <MenuItem key={code} value={code}>{code}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    name="currencySymbol"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Currency Symbol"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="200px"
                border={1}
                borderColor="grey.300"
                borderRadius={1}
                bgcolor="background.paper"
                position="relative"
              >
                    {values.logo ? (
                      <img
                        src={URL.createObjectURL(values.logo)}
                        alt="Logo preview"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Preview Logo
                      </Typography>
                    )}
                       <Box position="absolute" left={0} bottom={0} p={2}>
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) => handleLogoChange(event, setFieldValue)}
                      style={{ display: 'block' }}
                    />
                  </Box>
                  </Box>
                </Grid>
              </Grid>

              <DialogActions>
                <Button type="submit" variant="contained" color="secondary">Update</Button>
                <Button onClick={onClose} variant="contained" color="error">Cancel</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
