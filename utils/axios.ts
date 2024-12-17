import axios from 'axios';
import Cookies from 'js-cookie';



const instance = axios.create({
  baseURL: 'http://ec2-15-207-221-132.ap-south-1.compute.amazonaws.com',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default instance;

