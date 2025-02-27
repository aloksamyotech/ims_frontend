import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Typography, Avatar, Breadcrumbs, Button, Divider, TextField, Stack, Link as MuiLink } from '@mui/material';
import { fetchAdmin } from 'apis/api.js';
import logo from 'assets/images/profile.png';
import UpdateProfile from './updateProfile.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdmin();
        const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
        setProfile(adminData);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    load();
  }, []);

  const handleEditClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
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
            <Typography variant="h4">Profile Details</Typography>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <MuiLink component={Link} to="/dashboard/admin" color="inherit">
                <HomeIcon sx={{ color: '#5e35b1' }} />
              </MuiLink>
              <Typography color="text.primary">Profile</Typography>
            </Breadcrumbs>
          </Box>

      <Grid item xs={12} mt={2.5}>
        <Box sx={{ width: '100%', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} display="flex">
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                <Typography sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>Profile</Typography>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px',mt: '5px' }}>
                  <Avatar
                    alt="Profile Image"
                    src={logo}
                    sx={{ width: 200, height: 200, borderRadius: '50%' }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>Account Details</Typography>
                <Divider />
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} sm={12}>
                    <TextField fullWidth label="Company" variant="outlined" defaultValue="Inventory Management System" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Name" variant="outlined" defaultValue={profile?.name || 'NA'} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email Address" variant="outlined" defaultValue={profile?.email || 'NA'} />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField fullWidth label="Phone Number" variant="outlined" defaultValue={profile?.phone || 'NA'} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <UpdateProfile open={openDialog} onClose={handleDialogClose} profile={profile} setProfile={setProfile} />
    </Grid>
  );
};

export default ProfileSection;
