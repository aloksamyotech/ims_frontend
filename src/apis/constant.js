import { fetchAdmin } from './api.js';

export const fetchCurrencySymbol = async () => {
  try {
    const response = await fetchAdmin();
    const adminData = Array.isArray(response.data) ? response.data[0] : response.data;
    return adminData.currencySymbol;
  } catch (error) {
    console.error('Error fetching currency symbol:', error);
    return '';
  }
};

export const getUserId = () => {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  if (!userId || !role) {
    console.error('User ID & role are missing. Please log in again.');
    return null;
  }

  if (role === 'employee') {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.userId || null; 
  }

  return userId;
};

  
