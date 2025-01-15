import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { fetchAdmin } from 'apis/api.js';
import { ButtonBase } from '@mui/material';

const Logo = () => {
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdmin();
        const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
        setLogoUrl(adminData.logoUrl); 
      } catch (error) {
        console.error('Error fetching details:', error);
       
      }
    };
    load();
  }, []);

  return (

    <ButtonBase >
    <img alt="" src={logoUrl || '/inventory-logo.png'} style={{ height: '70px', width: '160px' }} />
  </ButtonBase>
  
  );
};

export default Logo;

