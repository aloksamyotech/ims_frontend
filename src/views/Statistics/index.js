import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  Tabs,
  Stack,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Tab,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Card,
  styled
} from '@mui/material';
import moment from 'moment';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import EarningCard from './EarningCard';
import EarningCard1 from './EarningCard1';
import TotalOrderLineChartCard1 from './TotalOrderLineChartCard1';
import SoldQuantityDisplay from './soldQuantity';
import SelectSoldQuantity from './selectSoldQuantity';
import NewBox from './newBox';
import { Link } from 'react-router-dom';
import { Container } from '@mui/system';
import { gridSpacing } from 'store/constant';

const Analytics = () => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid>
      <Box
        sx={{
          backgroundColor: '#ffff',
          padding: '10px',
          borderRadius: '8px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h4">Statistics </Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <Typography color="text.primary">Statistics</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={gridSpacing} sx={{ marginTop: '5px' }}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <SelectSoldQuantity isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={gridSpacing} sx={{ marginTop: '1px' }}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <EarningCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalOrderLineChartCard1 isLoading={isLoading} />
            </Grid>

            <Grid item lg={4} md={6} sm={6} xs={12}>
              <EarningCard1 isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <Grid container spacing={gridSpacing} sx={{ marginTop: '5px' }}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <SoldQuantityDisplay isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}

      <Grid container spacing={gridSpacing} sx={{ marginTop: '5px' }}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <NewBox isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

     
    </Grid>
  );
};

export default Analytics;
