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
import { getTotalSales } from 'apis/api.js';
import { fetchCurrencySymbol } from 'apis/constant.js'; 

const TotalGrowthBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const [salesData, setSalesData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [companyNames, setCompanyNames] = useState([]); 

  const customization = useSelector((state) => state.customization);
  const { navType } = customization;
  const { primary } = theme.palette.text;
  const grey200 = theme.palette.grey[200];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const amount = await getTotalSales();
        if (amount.data.success && Array.isArray(amount.data.data)) {
          setSalesData(amount.data.data);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const companyNames = salesData.map((item) => item.companyName); 
    setCompanyNames(companyNames);
  }, [salesData]);

  const chartData = {
    labels: companyNames, 
    series: [
      {
        name: 'Sales Amount',
        data: salesData.map((item) => item.total_sales_amount), 
      },
    ],
  };

  const chartOptions = {
    chart: {
      height: 480,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '10%',
        borderRadius: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: companyNames, 
    },
    yaxis: {
      title: {
        text: 'Total Sales Amount',
      },
    },
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="h4">Sales By Company</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart
                options={chartOptions}
                series={chartData.series}
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
  isLoading: PropTypes.bool,
};

export default TotalGrowthBarChart;
