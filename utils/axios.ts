/*

import axios from 'axios';

// Axios is correctly pointing to port 3001 for the backend
const api = axios.create({
  baseURL: 'http://localhost:3001', // NestJS backend URL
});

export default api;
*/

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001', // Match backend port
  withCredentials: true, // Enable this if using cookies for auth
});

export default instance;
