import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SoldQuantityDisplay from './soldQuantity';
import EarningCard from './EarningCard';
import EarningCard1 from './EarningCard1';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalOrderLineChartCard1 from './TotalOrderLineChartCard1';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
const Dashboard = () => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard1 isLoading={isLoading} />
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={12}>
            <EarningCard1 isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={gridSpacing} sx={{ marginTop: '5px' }}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <SoldQuantityDisplay isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
