import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Divider,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef.js';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import { addApi } from 'apis/common.js';
import { filterMenuItems, dashboard } from '../../../../menu-items/dashboard.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCredentialClick = async (email, password, setFieldValue, handleSubmit) => {
    setFieldValue('email', email);
    setFieldValue('password', password);

    setTimeout(() => {
      handleSubmit();
    }, 500);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus }) => {
          try {
            setIsSubmitting(true);
            const res = await addApi('/user/login/', values);

            if (res?.data && res?.data?.jwtToken && res?.data?.user) {
              const storageMethod = rememberMe ? localStorage : sessionStorage;
              storageMethod.setItem('imstoken', JSON.stringify(res.data.jwtToken));
              storageMethod.setItem('user', JSON.stringify(res.data.user));
              storageMethod.setItem('userId', res.data.user._id);
              storageMethod.setItem('email', res.data.user.email);
              storageMethod.setItem('role', res.data.user.role);
              storageMethod.setItem('permissions', res.data.user.permissions || []);
              console.log(res.data.jwtToken);
              if (res.data.user.role === 'user') {
                navigate('/dashboard/default');
                window.location.reload();
              } else if (res.data.user.role === 'admin') {
                navigate('/dashboard/admin');
                window.location.reload();
              } else if (res.data.user.role === 'employee') {
                const permissions = (localStorage.getItem('permissions') || '').split(',');
                const filteredMenu = filterMenuItems(dashboard.children, permissions);
                const firstAvailableRoute = filteredMenu.length > 0 ? filteredMenu[0].url : '/dashboard/default';

                window.location.replace(firstAvailableRoute);
              }

              toast.success('Logged in successfully');
            } else {
              throw new Error('Unexpected response structure');
            }
          } catch (error) {
            toast.error(error.message || 'Login failed');
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{
                '& .MuiFormLabel-root': {
                  color: '#000066'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: errors.email ? '#000066' : ''
                  }
                },
                mb: 2
              }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
              />
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{
                '& .MuiFormLabel-root': {
                  color: '#000066'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: errors.email ? '#000066' : ''
                  }
                }
              }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
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
                      size="small"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </FormControl>

            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
                onClick={() => handleCredentialClick('admin@gmail.com', 'admin123', setFieldValue, handleSubmit)}
              >
                <Typography variant="h5">Admin Credentials</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
                onClick={() => handleCredentialClick('samyotech@gmail.com', '123456', setFieldValue, handleSubmit)}
              >
                <Typography variant="h5">User Credentials</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    background: 'linear-gradient(45deg, #441572, #7c4bad)',
                    borderRadius: '50px',
                    '&:hover': {
                      background: 'linear-gradient(to right, #4b6cb7, #182848)',
                      boxShadow: '2'
                    }
                  }}
                >
                  {isSubmitting ? 'Logging in...' : 'Sign in'}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
