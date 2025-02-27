import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { totalSalesAmount, totalSoldQuantity } from 'apis/api.js';
import getChartData from './chart-data/total-growth-bar-chart';
import { fetchCurrencySymbol, getUserId } from 'apis/constant.js';

const status = [
  {
    value: 'sales_amount',
    label: 'Sales Amount'
  },
  {
    value: 'sold_quantity',
    label: 'Sold Quantity'
  }
];

const TotalGrowthBarChart = ({ isLoading }) => {
  const [value, setValue] = useState('sales_amount');
  const [year, setYear] = useState(new Date().getFullYear());
  const theme = useTheme();
  const [salesData, setSalesData] = useState([]);
  const [soldQuantities, setSoldQuantityData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');

  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];
  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const userId = getUserId();
        const amount = await totalSalesAmount({ userId, year });
        if (amount.data.success && Array.isArray(amount.data.data) && amount.data.data.length === 12) {
          setSalesData(amount.data.data);
        }

        const quantity = await totalSoldQuantity({ userId, year });
        if (quantity.data.success && Array.isArray(quantity.data.data) && quantity.data.data.length === 12) {
          setSoldQuantityData(quantity.data.data);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [year]);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const newChartData = getChartData(salesData, soldQuantities, value, currencySymbol);

    if (!isLoading && (salesData.length > 0 || soldQuantities.length > 0)) {
      ApexCharts.exec('bar-chart', 'updateOptions', newChartData.options);
      ApexCharts.exec('bar-chart', 'updateSeries', newChartData.series);
    }
  }, [
    navType,
    primary200,
    primaryDark,
    secondaryMain,
    secondaryLight,
    primary,
    grey200,
    isLoading,
    grey500,
    salesData,
    soldQuantities,
    value,
    year
  ]);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      {isLoading || (salesData.length === 0 && soldQuantities.length === 0) ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h4">Sales Report</Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                      <TextField id="select-year" select value={year} onChange={(e) => setYear(e.target.value)}>
                        {years.map((yearOption) => (
                          <MenuItem key={yearOption} value={yearOption}>
                            {yearOption}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item>
                      <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                        {status.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart
                options={getChartData(salesData, soldQuantities, value, currencySymbol).options}
                series={getChartData(salesData, soldQuantities, value, currencySymbol).series}
                type="bar"
                height={480}
              />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
