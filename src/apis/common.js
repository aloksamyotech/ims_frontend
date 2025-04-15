import axios from 'axios';
import { urls } from './urls.js';
import { decryptWithAESKey } from './drcrypt.js';

const baseUrl = urls.base;
const token = localStorage.getItem('imstoken');

export const deleteApi = async (url, _id) =>
  axios.delete(`${baseUrl}${url.replace(':id', _id)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const updateApi = async (url, updatedEntity) => {
  const response = await axios.patch(`${baseUrl}${url.replace(':id', updatedEntity._id)}`, updatedEntity, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  let responseData = await decryptWithAESKey(response.data);
  return JSON.parse(responseData);
};

export const fetchApi = async (url) => {
  const response = await axios.get(`${baseUrl}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  let responseData = await decryptWithAESKey(response.data);
  return JSON.parse(responseData);
};

export const addApi = async (url, data) => {
  try {
    const response = await axios.post(`${baseUrl}${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const responseData = await decryptWithAESKey(response.data);
    return JSON.parse(responseData);
  } catch (error) {
    let decryptedErrorMsg = 'Something went wrong';
    if (error.response && error.response.data) {
      try {
        const decrypted = await decryptWithAESKey(error.response.data);
        const parsed = JSON.parse(decrypted);
        decryptedErrorMsg = parsed.message || parsed.error || decryptedErrorMsg;
      } catch (decryptErr) {
        console.error('Failed to decrypt error:', decryptErr);
      }
    }
    throw new Error(decryptedErrorMsg);
  }
};

export const updateEntity = async (entityType, updatedEntity) => {
  if (!updatedEntity._id) {
    throw new Error('Updated entity must include an _id field');
  }
  let url;

  switch (entityType) {
    case 'unit':
      url = urls.unit.update;
      break;
    case 'category':
      url = urls.category.update;
      break;
    case 'user':
      url = urls.user.update;
      break;
    case 'supplier':
      url = urls.supplier.update;
      break;
    case 'customer':
      url = urls.customer.update;
      break;
    case 'product':
      url = urls.product.update;
      break;
    case 'admin':
      url = urls.admin.update;
      break;
    case 'subscription':
      url = urls.subscription.update;
      break;
    case 'employee':
      url = urls.employee.update;
      break;
    default:
      throw new Error('Unsupported entity type');
  }

  return updateApi(url, updatedEntity);
};

export const chatbotApi = async (url, options = {}) => {
  const { method = 'GET', data = null, params = {}, headers = {} } = options;

  const response = await axios({
    url: `${baseUrl}${url}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers
    },
    params,
    data: method !== 'GET' ? data : undefined
  });
  let responseData = await decryptWithAESKey(response.data);
  return JSON.parse(responseData);
};

export const updateMultipartApi = async (url, formData, method = 'PUT') => {
  try {
    const response = await axios({
      url: `${baseUrl}${url}`,
      method,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      data: formData
    });
    let responseData = await decryptWithAESKey(response.data);
    return JSON.parse(responseData);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};
