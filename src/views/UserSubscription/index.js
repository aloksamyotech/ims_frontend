import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  IconButton,
  Container,
  Typography,
  Card,
  Box,
  Grid,
  Tooltip,
  CardMedia,
  Popover,
  CardContent,
  TextField,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCurrencySymbol } from 'apis/constant.js';
import { fetchSubscription } from 'apis/api.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const Product = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetchSubscription();
        setSubscription(response?.data);
      } catch (error) {
        toast.error('Error fetching subscriptions:', error);
      }
    };
    loadSubscription();
  }, []);

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  return (
    <>
      <Container>
        <Box
          sx={{
            backgroundColor: '#ffff',
            padding: '10px',
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h4">Subscriptions</Typography>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <Typography color="text.primary">Subscription</Typography>
          </Breadcrumbs>
        </Box>

        <Card sx={{ marginTop: '20px' }}>
          <Box sx={{ padding: '20px' }}>
            <Grid container spacing={3}>
              {subscription.map((sub, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      paddingTop: 3,
                      paddingBottom: 2,
                      position: 'relative',
                      height: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h3" noWrap sx={{ fontWeight: 'bold' }}>
                          {sub.title}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                        <Typography variant="h2">
                          {currencySymbol} {sub.amount}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="body2">({sub.noOfDays} Days)</Typography>
                      </Box>

                      <Box mt={2} display="flex" justifyContent="center">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            backgroundColor: '#2196f3', 
                            '&:hover': {
                              backgroundColor: '#1a72bb' 
                            }
                          }}
                          //   onClick={() => alert(`Buying: ${sub.title}`)}
                        >
                          Buy Now
                        </Button>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" mt={2}
                      sx={{padding:'3px'}}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {sub.desc}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {sub.discount}% Off
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default Product;
