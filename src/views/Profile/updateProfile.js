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
import { addApi } from 'apis/common.js';
import { style } from '@mui/system';

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

const UpdateProfile = ({ open, onClose, profile, setProfile, load }) => {
  const [currencyCode, setCurrencyCode] = useState(profile?.currencyCode || '');
  const [currencySymbol, setCurrencySymbol] = useState(currencySymbolMap(profile?.currencyCode || '') || '');
  const [imageFile, setImageFile] = useState(null);

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

      setFieldValue('currencyCode', profile?.currencyCode || currencyCode);
      setFieldValue('currencySymbol', profile?.currencySymbol || currencySymbol);
    }
  };

  const handleSaveProfile = async (values) => {
    const formData = new FormData();
    formData.append('currencyCode', values.currencyCode || profile?.currencyCode);
    formData.append('currencySymbol', values.currencySymbol || profile?.currencySymbol);

    if (values.logo) {
      formData.append('logo', values.logo);
    }

    try {
      const response = await addApi('/admin/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        toast.success('Profile Updated Successfully!');

        setProfile((prevProfile) => ({
          ...prevProfile,
          currencyCode: values.currencyCode || prevProfile.currencyCode,
          currencySymbol: values.currencySymbol || prevProfile.currencySymbol,
          logo: response.data.logo || prevProfile.logo
        }));
        load();
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
            currencyCode: profile?.currencyCode || currencyCode,
            currencySymbol: profile?.currencySymbol || currencySymbol,
            logo: null
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
