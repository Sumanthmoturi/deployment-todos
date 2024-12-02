import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://ec2-65-2-80-196.ap-south-1.compute.amazonaws.com:10000', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
