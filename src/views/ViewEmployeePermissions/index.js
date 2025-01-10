import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper
} from '@mui/material';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { fetchEmployeeById } from 'apis/api.js';
import { fetchApi , addApi } from 'apis/common.js';

const permissionsList = [
  { id: 'default', label: 'Dashboard' },
  { id: '01', label: 'Employee Management' },
  { id: '02', label: 'Statistics' },
  { id: '03', label: 'Products' },
  { id: '04', label: 'Low-Stocks' },
  { id: '05', label: 'Financial Summary' },
  { id: '06', label: 'Orders' },
  { id: '07', label: 'Purchases' },
  { id: '09', label: 'Suppliers' },
  { id: '10', label: 'Customers' },
  { id: '11', label: 'Category' },
  { id: '12', label: 'Reports' },
  { id: '13', label: 'Subscription' },
  { id: '14', label: 'Profile' }
];

const ViewEmployeePage = () => {
  const { id } = useParams();
  const [empData, setEmpData] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching permissions', error);
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
        <Typography variant="h4">Employee Permissions</Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/employee" color="inherit">
            <Typography color="text.primary">Employee</Typography>
          </MuiLink>
          <Typography color="text.primary">View Employee</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ marginTop: '20px' }}>
        <Card style={{ margin: '20px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h4">
                    <strong>{empData?.name || 'NA'}</strong>
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {empData?.email || 'NA'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {empData?.phone || 'NA'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">
                    <strong>Address:</strong> {empData?.address || 'NA'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">
                    <strong>Created At:</strong> {moment(empData?.createdAt).format('DD-MM-YYYY')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Divider />
        <div>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: 'center',
              mt:3
            }}
          >
            Manage Permissions
          </Typography>

          <Paper sx={{ padding: '20px' }}>
            <Grid container spacing={3}>
              {permissionsList.map((permission) => (
                <Grid item xs={12} sm={4} md={4} key={permission.id}>
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
                    sx={{ display: 'flex', alignItems: 'center' }}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={savePermissions}>
                Save Permissions
              </Button>
            </Box>
          </Paper>
        </div>
      </Card>
    </Grid>
  );
};

export default ViewEmployeePage;
