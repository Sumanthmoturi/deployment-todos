
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001', // Match backend port
  withCredentials: true, // Enable this if using cookies for auth
});

export default instance;
