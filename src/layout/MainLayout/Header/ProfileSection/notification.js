import React, { useState, useEffect, useCallback } from 'react';
import { Badge, IconButton, Menu, Card, Box, MenuItem, List, ListItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { fetchQuantityAlert } from 'apis/api.js';
import { getUserId } from 'apis/constant.js';

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

const fetchNotifications = async () => {
  if (role === 'user') {
    try {
      const userId = getUserId();
      const response = await fetchQuantityAlert({ userId });
      const lowStockProducts = response?.data?.data;

      const notificationMessages = lowStockProducts.map(
        (product) => `Quantity Alert Restock for ${product.productnm}, current quantity ${product.quantity}.`
      );

      setNotifications(notificationMessages);
      setUnreadCount(notificationMessages.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }
};

useEffect(() => {
  fetchNotifications(); 
}, []);


  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUnreadCount(0);
  };

  if (role !== 'user') return null;

  return (
    <div>
      <IconButton color="inherit" onClick={handleClick} sx={{ fontSize: '30px' }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: 'secondary' }} />
        </Badge>
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          style: { width: '350px', maxHeight: 'auto' }
        }}
      >
        {/* Card Wrapper */}
        <Card sx={{ p: 2 }}>
          {/* Heading */}
          <Box sx={{ backgroundColor: 'primary' }}>
            <Typography variant="h4" sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', mb: 2 }}>
              All Notifications
            </Typography>
          </Box>

          {/* Notifications List */}
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <ListItem
                  key={index}
                  onClick={handleClose}
                  sx={{
                    borderRadius: '8px',
                    cursor: 'pointer',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  {/* Colorful Bullet */}
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: index % 2 === 0 ? 'primary.main' : 'secondary.main',
                      mr: 2
                    }}
                  />
                  <Typography variant="body1">{notification}</Typography>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography variant="body2" color="textSecondary">
                  No notifications
                </Typography>
              </ListItem>
            )}
          </List>
        </Card>
      </Menu>
    </div>
  );
};

export default NotificationDropdown;
