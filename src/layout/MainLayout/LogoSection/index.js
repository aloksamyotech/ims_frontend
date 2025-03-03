import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { ButtonBase } from '@mui/material';

const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;

const BASE_URL = 'https://ims.samyotech.in/api';

const Logo = () => {
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState('/StockSmart.png');

  useEffect(() => {
    if (userObj?.logo) {
      let formattedPath = userObj.logo;

      if (!formattedPath.startsWith('/')) {
        formattedPath = `/${formattedPath}`;
      }

      const fullUrl = formattedPath.startsWith('http') ? formattedPath : `${BASE_URL}${formattedPath}`;
      setLogoUrl(fullUrl);
    } else {
      setLogoUrl('/StockSmart.png'); 
    }
  }, []);

  return (
    <ButtonBase>
      <img
        alt="Company Logo"
        src={logoUrl || '/StockSmart.png'}
        style={{ height: '70px', width: '180px', objectFit: 'contain' }}
      />
    </ButtonBase>
  );
};

export default Logo;
