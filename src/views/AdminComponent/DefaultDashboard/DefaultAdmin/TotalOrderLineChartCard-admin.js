import PropTypes from 'prop-types';
import { useState , useEffect} from 'react';
import { countCompany } from 'apis/api.js';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart-admin';
import ChartDataYear from './chart-data/total-order-year-line-chart-admin';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IconShoppingCart } from '@tabler/icons';

// const CardWrapper = styled(MainCard)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.dark,
//   color: '#fff',
//   overflow: 'hidden',
//   position: 'relative',
//   '&>div': {
//     position: 'relative',
//     zIndex: 5
//   },
//   // '&:after': {
//   //   content: '""',
//   //   position: 'absolute',
//   //   width: 210,
//   //   height: 210,
//   //   background: theme.palette.primary[800],
//   //   borderRadius: '50%',
//   //   zIndex: 1,
//   //   top: -85,
//   //   right: -95,
//   //   [theme.breakpoints.down('sm')]: {
//   //     top: -105,
//   //     right: -140
//   //   }
//   // },
//   // '&:before': {
//   //   content: '""',
//   //   position: 'absolute',
//   //   zIndex: 1,
//   //   width: 210,
//   //   height: 210,
//   //   background: theme.palette.primary[800],
//   //   borderRadius: '50%',
//   //   top: -125,
//   //   right: -15,
//   //   opacity: 0.5,
//   //   [theme.breakpoints.down('sm')]: {
//   //     top: -155,
//   //     right: -70
//   //   }
//   // }
// }));

// const CardWrapper = styled(MainCard)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.dark,
//   color: '#fff',
//   overflow: 'hidden',
//   position: 'relative', 
// }));

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

const TopRightIcon = styled(Box)(({ theme }) => ({
  position: 'absolute', 
  top: '20px',
  right: '10px',
  color: theme.palette.primary[100],
  backgroundColor: '#ffff', 
  borderRadius: '50%', 
  padding: '12px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
  const theme = useTheme();
  const[companyCount , setCompanyCount] = useState(0);

  const [timeValue, setTimeValue] = useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  useEffect(() => {
    const getCompanyCount = async () => {
      try {
        const response = await countCompany();
        setCompanyCount(response.data.count);
      } catch (err) {
      console.log(err);
      } 
    };
    getCompanyCount(); 
  }, []);
   
  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 3.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '2.125rem',
                    fontWeight: 500,
                    mr: 1,
                    mt: 1.75,
                    mb: 0.75,
                  }}
                >
                  {companyCount}
                </Typography>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.primary[200],
                  }}
                >
                  Total Companys
                </Typography>
              </Grid>
            </Grid>
            <TopRightIcon>
            <IconShoppingCart size={30} color='#1e88e5' />
          </TopRightIcon>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
