import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import inventoryLogo from 'assets/images/inventory-logo.png';

const Logo = () => {
  const theme = useTheme();

  return (
    <Box component="div" display="flex" alignItems="center">
      <img
        src={inventoryLogo}
        alt="Inventory Management"
        width="180" 
        height='80'
      />
    </Box>
  );
};

export default Logo;


