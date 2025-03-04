import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { ButtonBase } from '@mui/material';
import LogoInvento from 'assets/images/StockSmart.png';

const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;

const BASE_URL = 'https://ims.samyotech.in/api';

const Logo = () => {
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState(LogoInvento);

  useEffect(() => {
    console.log("Logo URL updated:", logoUrl);
  }, [logoUrl]);

  useEffect(() => {
    if (userObj?.logo) {
      let formattedPath = userObj.logo;
      if (!formattedPath.startsWith('/')) {
        formattedPath = `/${formattedPath}`;
      }

      const fullUrl = formattedPath.startsWith('http') ? formattedPath : `${BASE_URL}${formattedPath}`;
      setLogoUrl(fullUrl);
    } else {
      setLogoUrl(LogoInvento);
    }
  }, [userObj]); 

  return (
    <ButtonBase>
      <img
        alt="Company Logo"
        src={logoUrl}
        style={{ height: '70px', width: '180px', objectFit: 'contain' }}
      />
    </ButtonBase>
  );
};

export default Logo;
