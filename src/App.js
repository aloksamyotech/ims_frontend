import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from 'react-loader-spinner';

import Routes from 'routes';

import themes from 'themes';

import NavigationScroll from 'layout/NavigationScroll';

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh'
            }}
          >
            <Grid height="80" width="80" radius="9" color="#7951bf" ariaLabel="loading" visible={true} />
          </Box>
        ) : (
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
