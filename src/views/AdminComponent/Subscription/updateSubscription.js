import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, 
    Grid,FormLabel,TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateSubscription } from 'apis/api.js';
import ClearIcon from '@mui/icons-material/Clear';
import { update } from 'lodash';

const UpdateSubscription = ({ open, handleClose, subscription, onUpdateSubscription }) => {
  const formik = useFormik({
    initialValues: {
      title: subscription?.title || '',
      noOfDays: subscription?.noOfDays || '',
      amount: subscription?.amount || '',
      discount: subscription?.discount || '',
      desc: subscription?.desc || ''
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup.string().max(30, 'Max 30 characters are allowed').required('Title is required'),
      desc: yup.string().max(100, 'Max 100 characters are allowed').required('Description is required'),
      amount: yup
        .number()
        .required('Amount is required')
        .positive('Must be a positive number')
        .max(1000000, 'Price cannot exceed Rs.1000000'),
        noOfDays: yup.number().max(365, 'Max 365 days are allowed').required('No of days is required'),
      discount: yup.number().max(100, 'Max 100% discount is allowed').required('Discount is required')
    }),
    onSubmit: async (values) => {
      try {
        const response = await updateSubscription({ ...subscription, ...values });
        onUpdateSubscription(response?.data);
        toast.success('Subscription updated successfully');
      } catch (error) {
        toast.error('Failed to update subscription');
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Update Subscription</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Title</FormLabel>
              <TextField
                size="small"
                required
                id="title"
                name="title"
                fullWidth
                type="text"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>No of Days</FormLabel>
              <TextField
                required
                size="small"
                id="noOfDays"
                name="noOfDays"
                type="number"
                fullWidth
                value={formik.values.noOfDays}
                onChange={formik.handleChange}
                error={formik.touched.noOfDays && Boolean(formik.errors.noOfDays)}
                helperText={formik.touched.noOfDays && formik.errors.noOfDays}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Amount</FormLabel>
              <TextField
                required
                size="small"
                id="amount"
                name="amount"
                type="number"
                fullWidth
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Discount(%)</FormLabel>
              <TextField
                required
                size="small"
                id="discount"
                name="discount"
                type="number"
                fullWidth
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Description</FormLabel>
              <TextField
                required
                size="small"
                id="desc"
                name="desc"
                fullWidth
                type="text"
                value={formik.values.desc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.desc && Boolean(formik.errors.desc)}
                helperText={formik.touched.desc && formik.errors.desc}
              />
            </Grid>
          </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="secondary" onClick={formik.handleSubmit}>
          Update
        </Button>
        <Button onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSubscription;
