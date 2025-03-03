import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { ButtonBase } from '@mui/material';

const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;

const BASE_URL = 'https://ims.samyotech.in/api/';

const Logo = () => {
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState('/StockSmart.png'); 

  useEffect(() => {
    if (userObj?.logo) {
      const fullUrl = userObj.logo.startsWith('http') ? userObj.logo : `${BASE_URL}${userObj.logo}`;
      setLogoUrl(fullUrl);
    }
  }, [userObj]);

  return (
    <ButtonBase>
      <img
        alt="Company Logo"
        src={logoUrl}
        onError={(e) => { e.target.src = '/StockSmart.png'; }} 
        style={{ height: '70px', width: '180px', objectFit: 'contain' }}
      />
    </ButtonBase>
  );
};

export default Logo;
