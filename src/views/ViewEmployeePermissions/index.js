import React, { useEffect, useState } from 'react';
import {
  Box,
  styled,
  Card,
  TextField,
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
  Avatar,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import { fetchEmployeeById } from 'apis/api.js';
import { fetchApi, addApi } from 'apis/common.js';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  marginTop: theme.spacing(2.4)
}));

const permissionsList = [
  { id: 'default', label: 'Dashboard' },
  { id: '01', label: 'Statistics' },
  { id: '02', label: 'Category' },
  { id: '03', label: 'Products' },
  { id: '04', label: 'Clients' },
  { id: '05', label: 'Suppliers' },
  { id: '06', label: 'Customers' },
  { id: '07', label: 'Orders' },
  { id: '08', label: 'Purchases' },
  { id: '09', label: 'Low-Stocks' },
  { id: '10', label: 'Financial Summary' },
  { id: '12', label: 'Reports' },
  { id: '14', label: 'Profile' }
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
    let updatedPermissions = [...selectedPermissions];

    if (updatedPermissions.includes(permissionId)) {
      if (permissionId === '04') {
        updatedPermissions = updatedPermissions.filter((id) => id !== '04' && id !== '05' && id !== '06');
      } else {
        updatedPermissions = updatedPermissions.filter((id) => id !== permissionId);
      }
    } else {
      updatedPermissions.push(permissionId);

      if (permissionId === '04') {
        updatedPermissions.push('05', '06');
      }
    }

    setSelectedPermissions(updatedPermissions);
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
          <Grid container spacing={3} p={2}>
            <Grid item xs={12} md={6}>
              <Box p={2} boxShadow={3} borderRadius={2} bgcolor="background.paper">
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary', mr: 2 }}>
                        {empData?.name ? empData.name.charAt(0).toUpperCase() : 'N'}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        Personal Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <TextField fullWidth label="Full Name" value={empData?.name || 'NA'} InputProps={{ readOnly: true }} margin="normal" />
                    <TextField
                      fullWidth
                      label="Joining Date"
                      value={moment(empData?.createdAt).format('DD-MM-YYYY')}
                      InputProps={{ readOnly: true }}
                      margin="normal"
                    />
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box p={2} boxShadow={3} borderRadius={2} bgcolor="background.paper">
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Contact Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TextField
                      fullWidth
                      label="Email"
                      value={empData?.email || 'NA'}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <EmailIcon color="#caced4" sx={{ mr: 1 }} />
                      }}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={empData?.phone || 'NA'}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <PhoneIcon color="#caced4" sx={{ mr: 1 }} />
                      }}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Address"
                      value={empData?.address || 'NA'}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <HomeIcon color="#caced4" sx={{ mr: 1 }} />
                      }}
                      margin="normal"
                    />
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <CardContent>
            <Paper sx={{ padding: '20px' }}>
              <Grid container spacing={3}>
                {permissionsList.map((permission) => (
                  <Grid item xs={12} sm={6} md={4} key={permission.id}>
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
