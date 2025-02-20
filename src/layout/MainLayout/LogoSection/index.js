import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { fetchAdmin } from 'apis/api.js';
import { ButtonBase } from '@mui/material';
import LOGO from '../../../assets/images/inventory.png'
import { useNavigate } from 'react-router';
const Logo = () => {
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState('');

  const load = async () => {
    try {
      const response = await fetchAdmin();
      const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
      setLogoUrl(adminData.logoUrl);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate('/')
  }
  return (

    <ButtonBase disableRipple onClick={handleNavigate}>
      <img alt="" src={logoUrl || LOGO} style={{ height: '70px', width: '160px', objectFit: 'contain' }} />
    </ButtonBase>

  );
};

export default Logo;

