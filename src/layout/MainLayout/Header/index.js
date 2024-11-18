import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;
      
{/* heading */}
<Box
  sx={{
    flexGrow: 1,
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'Playfair Display, serif', 
    textAlign: 'left',
    color: '#0054a6',
    backgroundImage: 'linear-gradient(90deg, #2b2d42, #3a3d5e)', 
    textShadow: '2px 2px 8px rgba(43, 45, 66, 0.3)', 
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    padding: '10px 0',
    transition: 'all 0.3s ease',
  }}
>
  Inventory - Efficient Tracking and Management
</Box>


      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
