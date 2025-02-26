import React, { useEffect, useState } from 'react';
import {
  Box,
  styled,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import { fetchEmployeeById } from 'apis/api.js';
import { fetchApi, addApi } from 'apis/common.js';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginTop: theme.spacing(2.4)
}));

const permissionsList = [
  { id: 'default', label: 'Dashboard' },
  { id: '01', label: 'Employee Management' },
  { id: '02', label: 'Statistics' },
  { id: '03', label: 'Products' },
  { id: '04', label: 'Low-Stocks' },
  { id: '05', label: 'Financial Summary' },
  { id: '06', label: 'Orders' },
  { id: '07', label: 'Purchases' },
  { id: '08', label: 'Clients' },
  { id: '08', label: 'Suppliers' },
  { id: '08', label: 'Customers' },
  { id: '09', label: 'Category' },
  { id: '10', label: 'Reports' },
  { id: '11', label: 'Subscription' },
  { id: '12', label: 'Profile' },
];

const ViewEmployeePage = () => {
  const { id } = useParams();
  const [empData, setEmpData] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const response = await fetchEmployeeById(id);
        setEmpData(response?.data);
      } catch (error) {
        toast.error('No employee data found');
      }
    };
    loadEmployee();
  }, [id]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetchApi(`/permissions/fetch/${id}`);
        setSelectedPermissions(response?.data?.permissions || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [id]);

  const handleCheckboxChange = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const savePermissions = async () => {
    try {
      await addApi('/permissions/save', {
        empId: id,
        permissions: selectedPermissions
      });
      toast.success('Permissions updated successfully!');
    } catch (error) {
      toast.error('Failed to update permissions.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Grid>
      <Box
        sx={{
          backgroundColor: '#ffff',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h4">View Employees</Typography>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/employee" color="inherit">
            <Typography color="text.primary">Employee</Typography>
          </MuiLink>
          <Typography color="text.primary">ViewEmployee</Typography>
        </Breadcrumbs>
      </Box>

      <TabContentCard>
        <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab
            icon={<InfoIcon />}
            iconPosition="start"
            label="Employee Details"
            sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: 120,
              textTransform: 'none',
              color: activeTab === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<SecurityIcon />}
            iconPosition="start"
            label="Permissions"
            sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: 120,
              textTransform: 'none',
              color: activeTab === 1 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs>

        {activeTab === 0 && (
          <CardContent sx={{ m: 1, minHeight: '70vh' }}>
            <Paper elevation={3} sx={{ p: '10px' }}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography fontWeight='700' sx={{ marginTop: '10px' }}>Full Name:</Typography>
                  <Typography sx={{ marginTop: '2px' }}>{empData?.name}</Typography>
                  <Typography fontWeight='700' sx={{ marginTop: '10px' }}>Email Address: </Typography>
                  <Typography sx={{ marginTop: '2px' }}>{empData?.email}</Typography>
                  <Typography fontWeight='700' sx={{ marginTop: '10px' }}>Phone Number:</Typography>
                  <Typography sx={{ marginTop: '2px' }}>{empData?.phone}</Typography>
                  <Typography fontWeight='700' sx={{ marginTop: '10px' }}>Address: </Typography>
                  <Typography sx={{ marginTop: '2px' }}>{empData?.address}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight='700' sx={{ marginTop: '10px' }}>Account Status: </Typography>
                  <Typography sx={{ marginTop: '2px', bgcolor: '#b9f6ca', display: 'inline', color: '#00c853', padding: '2px', borderRadius: '5px' }}>{empData?.isActive ? 'Active' : 'Inactive'}</Typography>
                  <Typography fontWeight='700' sx={{ marginTop: '10px' }}>Role: </Typography>
                  <Typography sx={{ marginTop: '2px' }}>{empData?.role}</Typography>
                  <Typography fontWeight='700' sx={{ marginTop: '10px' }}>Date of Joining: </Typography>
                  <Typography sx={{ marginTop: '2px' }}>{moment.utc(empData?.createdAt).local().format('ll')}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </CardContent>
        )}

        {activeTab === 1 && (
          <CardContent sx={{ m: 1, minHeight: '70vh' }}>
            <Paper elevation={3} sx={{ p: '20px' }}>
              <Typography gutterBottom sx={{ opacity: '0.6' }}>Manage Permissions</Typography>
              <Divider sx={{ marginY: '10px' }} />
              <Grid container spacing={1}>
                {permissionsList.map((permission) => (
                  <Grid item xs={12} sm={6} md={2} key={permission.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handleCheckboxChange(permission.id)}
                          color="primary"
                        />
                      }
                      label={<Typography variant="body1">{permission.label}</Typography>}
                    />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{marginY:'10px'}}/>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={savePermissions}>
                  Save Permissions
                </Button>
              </Box>
            </Paper>
          </CardContent>
        )}
      </TabContentCard>
    </Grid>
  );
};

export default ViewEmployeePage;
