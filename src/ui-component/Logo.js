// import { useTheme } from '@mui/material/styles';
// import { Box } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { fetchAdmin } from 'apis/api.js';
// import { toast } from 'react-toastify';

// const Logo = () => {
//   const theme = useTheme();
//   const [logoUrl, setLogoUrl] = useState('');

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const response = await fetchAdmin();

//         const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
//         setLogoUrl(adminData.logoUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ24Ow1xRIPVAQPRHqG3FcXsh80DR0PSCgzqA&s'); 
//       } catch (error) {
//         console.error('Error fetching details:', error);
       
//       }
//     };
//     load();
//   }, []);

//   return (
//     <Box component="div" display="flex" alignItems="center">
//       <img
//         src={logoUrl || 'assets/images/invento.png'}
//         alt="Inventory Management"
//         width="100" 
//         height="65"
//         style={{ alignItems: 'center'}}
//       />
//     </Box>
//   );
// };

// export default Logo;
