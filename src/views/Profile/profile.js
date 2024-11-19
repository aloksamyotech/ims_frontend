import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Divider, Box } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import moment from 'moment';

const ProfileSection = () => {
  const [profile, setProfile] = useState('');

  useEffect(() => {
    setProfile({
      companyName: 'Inventory Management System',
      address: '123 Default St, City, India',
      email: 'inventory@company.com',
      contactNo: '+91 9903714567',
      adminName: 'Admin',
      adminEmail: 'admin@gmail.com',
      adminPhone: '9876376321'
    });
  }, []);

  return (
    <Grid container spacing={2} justifyContent="left" sx={{ marginTop: '15px' }}>
      <Grid item xs={12} sm={6}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box sx={{ backgroundColor: '#2196F3', padding: 2, borderRadius: 1, marginBottom: 2 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Company Details
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Company Name:</strong> {profile.companyName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Address:</strong> {profile.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Email:</strong> {profile.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Contact No:</strong> {profile.contactNo}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box sx={{ backgroundColor: '#2196F3', padding: 2, borderRadius: 1, marginBottom: 2 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Admin Details
              </Typography>
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Name:</strong> {profile.adminName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Email:</strong> {profile.adminEmail}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Contact No:</strong> {profile.adminPhone}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfileSection;
