
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://deployment-todo-backend.onrender.com', 
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach token as Bearer token
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
