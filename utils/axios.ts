import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://13.201.224.43',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;