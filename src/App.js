import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from 'react-loader-spinner';
import Routes from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('imstoken');
    if (!token) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        <Box
          sx={{
            minHeight: '100vh',
            position: 'relative'
          }}
        >
          {loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
              }}
            >
              <Grid height="80" width="80" radius="9" color="#7951BF" ariaLabel="loading" visible={true} />
            </Box>
          )}
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
export default App;
