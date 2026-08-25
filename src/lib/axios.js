import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';
import { setupInterceptors } from './interceptors';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(axiosInstance);

export default axiosInstance;
