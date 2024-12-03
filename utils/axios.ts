import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://65.1.106.158:10000', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
