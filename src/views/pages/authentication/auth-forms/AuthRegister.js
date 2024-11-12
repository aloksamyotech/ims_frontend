import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';

import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        phone: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().required('Password is required'),
        phone: Yup.string()
          .matches(/^[1-9][0-9]{9}$/, 'Phone number must be 10 digits and cannot start with 0')
          .required('Phone number is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        console.log('Attempting to register user:', values);
        try {
          if (scriptedRef.current) {
            const res = await axios.post('http://localhost:4200/user/save/', values);
            console.log('User registered successfully:', res.data);
            setStatus({ success: true });
            toast.success('Customer added successfully');
            values.name = '';
            values.email = '';
            values.password = '';
            values.phone = '';
          }
        } catch (err) {
          console.error('Registration error:', err.response ? err.response.data : err);
          if (scriptedRef.current) {
            setStatus({ success: false });
            if (err.response && err.response.data && err.response.data.message) {
              const message = err.response.data.message;
              if (message.includes('User already registered')) {
                toast.error('Email already in use. Please use a different email.');
              } else {
                toast.error(message);
              }
              setErrors({ submit: message });
            } else {
              toast.error('Failed to add customer');
              setErrors({ submit: err.message });
            }
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              name="name"
              type="text"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              sx={{ ...theme.typography.customInput }}
            />
            {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
          </Grid>

          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-register"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text--register">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-register"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-register">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              margin="normal"
              name="phone"
              type="text"
              value={values.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              sx={{ ...theme.typography.customInput }}
            />
            {touched.phone && errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
          </Grid>

          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label={
                  <Typography variant="subtitle1">
                    Agree with &nbsp;
                    <Typography variant="subtitle1" component={Link} to="#">
                      Terms & Condition.
                    </Typography>
                  </Typography>
                }
              />
            </Grid>
          </Grid>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Sign up
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthRegister;
