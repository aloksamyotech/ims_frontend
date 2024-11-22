import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, IconButton } from '@mui/material';
import { fetchAdmin } from 'apis/api.js';
import logo from 'assets/images/profile.png';
import { toast } from 'react-toastify';
import UpdateProfile from './updateProfile.js';
import EditIcon from '@mui/icons-material/Edit';

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
        toast.error('Failed to fetch profile');
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
    <Box sx={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
              <img src={logo} alt="profile" style={{ width: '200px', height: 'auto', borderRadius: '8px' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Company:
                  </Typography>
                  <Typography variant="h5">Inventory Management</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Name:
                  </Typography>
                  <Typography variant="h5">{profile?.username || 'NA'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Contact on:
                  </Typography>
                  <Typography variant="h5">{profile?.phone || 'NA'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Email:
                  </Typography>
                  <Typography variant="h5">{profile?.email || 'NA'}</Typography>
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
                <Grid item xs={12}>
                  <Box
                    sx={{
                      backgroundColor: '#fff3e0',
                      borderRadius: '8px',
                      padding: '8px',
                      paddingTop: '8px',
                      '&:hover': { backgroundColor: '#ffe0b2' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px'
                    }}
                  >
                    <IconButton size="small" onClick={handleEditClick}>
                      <EditIcon sx={{ color: '#ff9800' }} />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <UpdateProfile open={openDialog} onClose={handleDialogClose} profile={profile} setProfile={setProfile} />
    </Box>
  );
};

export default ProfileSection;
