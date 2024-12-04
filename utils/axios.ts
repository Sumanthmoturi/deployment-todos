import axios from 'axios';

const instance = axios.create({


  baseURL: 'http://ec2-13-127-150-162.ap-south-1.compute.amazonaws.com:10000', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
