import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
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
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

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

  const subscriptionStyles = {
    Standard: {
      icon: <StarOutlineIcon sx={{ color: '#FFA726', fontSize: 30 }} />,
      borderColor: '#FFA726',
      buttonColor: '#FFA726',
      hoverColor: '#FB8C00'
    },
    Professional: {
      icon: <TrendingUpIcon sx={{ color: '#29B6F6', fontSize: 30 }} />,
      borderColor: '#29B6F6',
      buttonColor: '#29B6F6',
      hoverColor: '#0288D1'
    },
    Premium: {
      icon: <EmojiEventsIcon sx={{ color: '#7E57C2', fontSize: 30 }} />,
      borderColor: '#7E57C2',
      buttonColor: '#7E57C2',
      hoverColor: '#5E35B1'
    },
    Elite: {
      icon: <WorkspacePremiumIcon sx={{ color: '#4CAF50', fontSize: 30 }} />,
      borderColor: '#4CAF50',
      buttonColor: '#4CAF50',
      hoverColor: '#388E3C'
    }
  };

  return (
    <>
      <Grid>
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
          <Typography variant="h2" sx={{ textAlign: 'center', margin: '5px' }}>
            Subscription Plans
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', margin: '5px' }}>
          &quot;Take a subscription to use the inventory system and enhance your business operations.&quot;
          </Typography>

          <Box sx={{ padding: '20px' }}>
            <Grid container spacing={3}>
              {subscription.map((sub, index) => {
                const styles = subscriptionStyles[sub.title] || {};
                const discountedPrice = sub.amount - (sub.amount * sub.discount) / 100;
                const savedAmount = sub.amount - discountedPrice;
                const descriptionPoints = sub.desc?.split('.') || [];

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 4,
                        padding: 2,
                        position: 'relative',
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: `2px solid ${styles.borderColor || '#E0E0E0'}`,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 8
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={2} sx={{ flexDirection: 'row' }}>
                          <Box sx={{ marginLeft: -1 }}>{styles.icon}</Box>

                          <Typography variant="h3" noWrap sx={{ fontWeight: 'bold' }}>
                            {sub.title}
                          </Typography>
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                          <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'gray', fontWeight: 'bold' }}>
                            {currencySymbol} {sub.amount}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: styles.borderColor }}>
                            {currencySymbol} {discountedPrice.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            You save: {currencySymbol} {savedAmount.toFixed(2)} ({sub.discount}% Off)
                          </Typography>
                        </Box>

                        <Box mt={1}>
                          {descriptionPoints.map((point, idx) =>
                            point.trim() ? (
                              <Typography key={idx} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                • {point.trim()}
                              </Typography>
                            ) : null
                          )}
                        </Box>
                      </CardContent>

                      <Box sx={{ padding: 2, textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            backgroundColor: styles.buttonColor || '#2196f3',
                            '&:hover': {
                              backgroundColor: styles.hoverColor || '#1a72bb'
                            }
                          }}
                        >
                          Purchase
                        </Button>
                      </Box> 
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Card>
      </Grid>
    </>
  );
};

export default Product;
