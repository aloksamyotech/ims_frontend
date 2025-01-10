import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Breadcrumbs, Container, Link as MuiLink, Button } from '@mui/material';
import { fetchAdmin } from 'apis/api.js';
import logo from 'assets/images/profile.png';
import { toast } from 'react-toastify';
import UpdateCurrency from './updateProfile.js';
import UpdateProfileForm from './updateUser.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

const user = localStorage.getItem('user');
const userObj = JSON.parse(user);

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currencyDialog, setCurrencyDialog] = useState(false);

  const load = async () => {
    try {
      const response = await fetchAdmin();
      const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
      setProfile(adminData);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEditClick = () => {
    setCurrencyDialog(true);
  };

  const handleDialogClose = () => {
    setCurrencyDialog(false);
    setOpenDialog(false);
  };

  const handleEditProfileClick = () => {
    setOpenDialog(true);
  };

  const handleDialogCloseEditProfile = () => {
    setOpenDialog(false);
  };

  return (
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
        <Typography variant="h4">Profile Details</Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <Typography color="text.primary">Profile</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ marginTop: '20px' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Card sx={{ marginBottom: 2, padding: '10px', margin: '12px' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={logo} alt="profile" style={{ width: '200px', height: 'auto', borderRadius: '8px' }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ marginBottom: 3, margin: '12px', padding: '10px' }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      Inventory Management
                    </Typography>
                    <Typography variant="h5">
                      &quot;Efficiently track, manage, and optimize stock levels with a streamlined inventory management system.&quot;
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Company Name:
                    </Typography>
                    <Typography variant="h5">{userObj?.name || 'NA'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Contact on:
                    </Typography>
                    <Typography variant="h5">{userObj?.phone || 'NA'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Email:
                    </Typography>
                    <Typography variant="h5">{userObj?.email || 'NA'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Currency Code:
                    </Typography>
                    <Typography variant="h5">{profile?.currencyCode || 'NA'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Currency Symbol:
                    </Typography>
                    <Typography variant="h5">{profile?.currencySymbol || 'NA'}</Typography>
                  </Grid>

                  <Box sx={{marginTop: '5px', marginLeft:'10px'}}>
                    <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
                      <Grid item>
                        <Button variant="contained" size="small" color="secondary" onClick={handleEditProfileClick}>
                          Edit Profile
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" size="small" color="primary" onClick={handleEditClick}>
                          Edit Currency
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>

      <UpdateProfileForm open={openDialog} onClose={handleDialogCloseEditProfile} profile={profile} setProfile={setProfile}/>

      <UpdateCurrency open={currencyDialog} onClose={handleDialogClose} profile={profile} setProfile={setProfile} load={load} />
    </Container>
  );
};

export default ProfileSection;
