import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchAdmin } from 'apis/api.js';

const Logo = () => {
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdmin();

        const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
        setLogoUrl(adminData.logoUrl || 'N/A'); 
      } catch (error) {
        console.error('Error fetching details:', error);
        toast.error('Failed to fetch profile');
      }
    };
    load();
  }, []);

  return (
    <Box component="div" display="flex" alignItems="center">
      <img
        src={logoUrl || 'path-to-default-logo.png'}
        alt="Inventory Management"
        width="190" 
        height="60"
      />
    </Box>
  );
};

export default Logo;
