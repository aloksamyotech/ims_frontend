import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { fetchAdmin } from 'apis/api.js';
import { ButtonBase } from '@mui/material';

const Logo = () => {
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('companyLogo') || null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdmin();
        const adminData = Array.isArray(response.data) ? response.data[0] : response.data;

        if (adminData?.logoUrl) {
          setLogoUrl(adminData.logoUrl);
          localStorage.setItem('companyLogo', adminData.logoUrl);
        } else {
          setLogoUrl(null); 
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        setLogoUrl(null);
      }
    };
    load();
  }, []);

  return (
    <ButtonBase>
      <img
        alt="Company Logo"
        src={logoUrl || '/inventory-logo.png'}
        onError={(e) => { e.target.src = '/inventory-logo.png'; }} 
        style={{ height: '70px', width: '160px' }}
      />
    </ButtonBase>
  );
};

export default Logo;

