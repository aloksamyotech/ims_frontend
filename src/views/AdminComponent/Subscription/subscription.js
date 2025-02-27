import React, { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, FormLabel } from '@mui/material';
import { useFormik } from 'formik';
import ClearIcon from '@mui/icons-material/Clear';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { addSubscription } from 'apis/api.js';
import { margin } from '@mui/system';

const AddSubscription = ({ open, handleClose, onSubscriptionAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    title: yup.string().max(30, 'Max 30 characters are allowed').required('Title is required'),
    desc: yup.string().max(100, 'Max 100 characters are allowed').required('Description is required'),
    amount: yup
      .number()
      .required('Amount is required')
      .positive('Must be a positive number')
      .max(1000000, 'Price cannot exceed Rs.1000000'),
    noOfDays: yup.number().max(365, 'Max 365 days are allowed').required('No of days is required'),
    discount: yup.number().max(100, 'Max 5100% discount is allowed').required('Discount is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      desc: '',
      amount: '',
      noOfDays: '',
      discount: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await addSubscription(values);

        if (response?.data && response?.data?.message) {
          toast.error(response.data.message);
        } else {
          onSubscriptionAdded(response?.data);
          toast.success('Subscription added successfully');
          resetForm();
          handleClose();
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to add subscription');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Add Subscription</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
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
                onBlur={formik.handleBlur}
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

          <DialogActions>
            <Button type="submit" disabled={isSubmitting} variant="contained" color="secondary">
              {isSubmitting ? 'Submitting...' : 'Add Subscription'}{' '}
            </Button>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscription;
