import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Routes from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        
        <Box
          sx={{
            minHeight: '100vh',
            position: 'relative', 
          }}
        >
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
