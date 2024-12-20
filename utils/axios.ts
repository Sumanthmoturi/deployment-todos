import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://ec2-15-207-221-132.ap-south-1.compute.amazonaws.com',
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      alert('Your session has expired. Please log in again.');
      const router = useRouter();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);



export default instance;

