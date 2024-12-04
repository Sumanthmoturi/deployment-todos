import axios from 'axios';

const instance = axios.create({


  baseURL: 'ec2-3-110-156-172.ap-south-1.compute.amazonaws.com:10000', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
