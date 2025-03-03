import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Box
} from '@mui/material';
import currencySymbolMap from 'currency-symbol-map';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, Field, Form } from 'formik';
import { updateMultipartApi } from 'apis/common.js';
import { getUserId } from 'apis/constant.js';

const currency = [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'SEK',
  'NZD',
  'MXN',
  'SGD',
  'HKD',
  'NOK',
  'KRW',
  'TRY',
  'BRL',
  'ZAR'
];

const user = localStorage.getItem('user');
const userObj = JSON.parse(user);

const UpdateProfile = ({ open, onClose, profile, setProfile, load }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [currencyCode, setCurrencyCode] = useState(userObj?.currencyCode || '');
  const [currencySymbol, setCurrencySymbol] = useState(currencySymbolMap(userObj?.currencyCode || '') || '');
  const [imageFile, setImageFile] = useState(null);

  const userId = getUserId();

  const handleCurrencyCodeChange = (event, setFieldValue) => {
    const selectedCode = event.target.value;
    const symbol = currencySymbolMap(selectedCode) || '';

    setCurrencyCode(selectedCode);
    setCurrencySymbol(symbol);

    setFieldValue('currencyCode', selectedCode);
    setFieldValue('currencySymbol', symbol);

  };

  const handleLogoChange = (event, setFieldValue, values) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setFieldValue('logo', file);
  
      setFieldValue('currencyCode', values.currencyCode || userObj?.currencyCode || currencyCode);
      setFieldValue('currencySymbol', values.currencySymbol || userObj?.currencySymbol || currencySymbol);
    }
  };
  
  const handleSaveProfile = async (values) => {
    const formData = new FormData();
    formData.append('currencyCode', values.currencyCode || userObj?.currencyCode);
    formData.append('currencySymbol', values.currencySymbol || userObj?.currencySymbol);
    if (values.logo) {
      formData.append('logo', values.logo);
    }

    try {
      formData.append('_id', userId);
      const response = await updateMultipartApi(`/user/currency-logo/${userId}`, formData);

      if (response?.data) {
        setProfile((prevProfile) => ({ ...prevProfile, ...response.data }));

        localStorage.setItem('user', JSON.stringify(response.data));

        toast.success('Data Updated Successfully!');

        if (response?.data) {
          setUser((prevProfile) => ({
            ...prevProfile,
            currencyCode: response.data.currencyCode || prevProfile.currencyCode,
            currencySymbol: response.data.currencySymbol || prevProfile.currencySymbol,
            logo: response.data.logo || prevProfile.logo
          }));
        }

        onClose();
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
        <Typography variant="h3">Update Currency</Typography>
        <ClearIcon onClick={onClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            currencyCode: userObj?.currencyCode || currencyCode,
            currencySymbol: userObj?.currencySymbol || currencySymbol
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
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200
                          }
                        }
                      }}
                    >
                      {currency.map((code) => (
                        <MenuItem key={code} value={code}>
                          {code}
                        </MenuItem>
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
                        value={field.value}
                        disabled
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
                      <img src={URL.createObjectURL(values.logo)} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Preview Logo
                      </Typography>
                    )}
                    <Box position="absolute" left={0} bottom={0} p={2}>
                      <input
                        accept="image/*"
                        type="file"
                        onChange={(event) => handleLogoChange(event, setFieldValue, values)}
                        style={{ display: 'block' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <DialogActions>
                <Button type="submit" variant="contained" color="secondary">
                  Update
                </Button>
                <Button onClick={onClose} variant="contained" color="error">
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
