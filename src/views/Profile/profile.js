import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';
import logo from 'assets/images/profile.png';
import { toast } from 'react-toastify';
import UpdateCurrency from './updateProfile.js';
import UpdateProfileForm from './updateUser.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { urls } from 'apis/urls.js';
import axios from 'axios';
import { decryptWithAESKey } from 'apis/drcrypt.js';

const user = localStorage.getItem('user');
const userObj = JSON.parse(user);

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currencyDialog, setCurrencyDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: true,
    new: true,
    confirm: true
  });

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };


  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password must match!');
      return;
    }

    try {
      const token = localStorage.getItem('imstoken');
      const userId = localStorage.getItem('userId');

      if (!token) {
        toast.error('User is not authenticated.');
        return;
      }

      const response = await axios.put(
        `${urls.base}/user/change-password`,
        { currentPassword, newPassword, userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const decryptedData = await decryptWithAESKey(response.data);
      const parsedData = JSON.parse(decryptedData);

      if (parsedData?.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

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
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <Typography color="text.primary">Profile</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ marginTop: '20px' }}>
        <Box sx={{ width: '100%', mx: 'auto' }}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab
              icon={<SettingsIcon />}
              iconPosition="start"
              label="Account Settings"
              sx={{
                fontSize: '14px',
                minWidth: 120,
                fontWeight: 'bold',
                textTransform: 'none',
                color: tabIndex === 0 ? '#1976d2' : '#757070'
              }}
            />
            <Tab
              icon={<KeyIcon />}
              iconPosition="start"
              label="Change Password"
              sx={{
                fontSize: '14px',
                minWidth: 120,
                fontWeight: 'bold',
                textTransform: 'none',
                color: tabIndex === 1 ? '#1976d2' : '#757070'
              }}
            />
          </Tabs>
        </Box>

        {tabIndex === 0 && (
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
                      <Typography variant="h5">{userObj?.currencyCode || 'NA'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Currency Symbol:
                      </Typography>
                      <Typography variant="h5">{userObj?.currencySymbol || 'NA'}</Typography>
                    </Grid>

                    <Box sx={{ marginTop: '5px', marginLeft: '10px' }}>
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
        )}

        {tabIndex === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Password"
                  type={showPassword.current ? 'text' : 'password'}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePassword('current')}>
                          {showPassword.current ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item sm={6}></Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type={showPassword.new ? 'text' : 'password'}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={newPassword !== confirmPassword && confirmPassword !== ''}
                  helperText={newPassword !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePassword('new')}>
                          {showPassword.new ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item sm={6}></Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type={showPassword.confirm ? 'text' : 'password'}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={newPassword !== confirmPassword && confirmPassword !== ''}
                  helperText={newPassword !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePassword('confirm')}>
                          {showPassword.confirm ? <Visibility/> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleChangePassword}
                    disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      <UpdateProfileForm open={openDialog} onClose={handleDialogCloseEditProfile} profile={profile} setProfile={setProfile} />
      <UpdateCurrency open={currencyDialog} onClose={handleDialogClose} profile={profile} setProfile={setProfile} />
    </Grid>
  );
};

export default ProfileSection;
