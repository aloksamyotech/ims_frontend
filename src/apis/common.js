import axios from 'axios';
import { urls } from './urls.js';

const baseUrl = urls.base;

export const deleteApi = async (url, _id) => axios.delete(`${baseUrl}${url.replace(':id', _id)}`);

export const updateApi = async (url, updatedEntity) => axios.patch(`${baseUrl}${url.replace(':id', updatedEntity._id)}`, updatedEntity);

export const fetchApi = async (url) => axios.get(`${baseUrl}${url}`);

export const addApi = async (url, data) => axios.post(`${baseUrl}${url}`, data);

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
    default:
      throw new Error('Unsupported entity type');
  }

  return updateApi(url, updatedEntity);
};
