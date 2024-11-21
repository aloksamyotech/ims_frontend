import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import logo from 'assets/images/profile.png'; 
import axios from 'axios'; 

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get('http://localhost:4200/admin/fetch');
        const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
        setProfile(adminData);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    load();
  }, []);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={logo}
                alt="profile"
                style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
                {profile?.username || 'Inventory Management System'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Name:
                  </Typography>
                  <Typography variant="body2">
                    {profile?.username || 'NA'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Phone:
                  </Typography>
                  <Typography variant="body2">
                    {profile?.phone || 'NA'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Email:
                  </Typography>
                  <Typography variant="body2">
                    {profile?.email || 'NA'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Role:
                  </Typography>
                  <Typography variant="body2">
                    {profile?.role || 'NA'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Currency Code:
                  </Typography>
                  <Typography variant="body2">
                    {profile?.currencyCode || 'NA'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Currency Symbol:
                  </Typography>
                  <Typography variant="body2">
                    {profile?.currencySymbol || 'NA'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileSection;
