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
    if (!userId) {
      console.error('User ID is missing. Please log in again.');
      return null;
    }
    return userId;
  };
  
