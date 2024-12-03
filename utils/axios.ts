import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://13.201.192.253:10000', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
