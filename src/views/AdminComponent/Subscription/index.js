/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Card, Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Company from './subscription.js';

// ----------------------------------------------------------------------

const Call = () => {
  
  return (
    <>
    
      <Container>
       <Company/>
      </Container>
    </>
  );
};

export default Call;
